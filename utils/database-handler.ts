import { Connection, IDatabaseDriver, MikroORM, wrap } from "@mikro-orm/core";
import { PartTimePeriod as DBPartTimePeriod } from "db/entities/PartTimePeriod";
import { Task } from "db/entities/Task";
import { emit } from "process";
import { IsSpecialType, PartTimePeriod, SpecialDay } from "types/balance";
import config from "../config/mikro-orm";
import { Account, User } from "../db/entities/User";
import {tryRefreshAccessToken} from "./harvest-handler"

let orm: MikroORM<IDatabaseDriver<Connection>>;

const checkOrmInitialized = async () => {
  if (!orm) orm = await MikroORM.init(config);
};

export async function getAccessToken(
  harvestId: string
): Promise<string | undefined> {
  await checkOrmInitialized();
  const account = await orm.em.findOne(Account, {
    providerAccountId: harvestId,
  });

  if (!account) return undefined;

  let invalidAccessToken = false;

  if (!account.access_token || !account.expires_at) invalidAccessToken = true;
  if (!invalidAccessToken &&
    account.expires_at && 
    Date.now() >= account.expires_at * 1000) {
    const refreshedTokens = await tryRefreshAccessToken(account.refresh_token);
    if (!refreshedTokens) invalidAccessToken = true;
    else {
        wrap(account).assign({
          access_token: refreshedTokens.accessToken,
          refresh_token: refreshedTokens.refreshToken,
          expires_at: Number(refreshedTokens.accessTokenExpires)
        })
        await orm.em.flush();
        return refreshedTokens.accessToken;
    }
  }

  if (invalidAccessToken) {
    await deleteAccount(account.providerAccountId); 
    return undefined; 
  }

  return account.access_token;
}

export async function getPartTimePeriods(
  harvestId: string
): Promise<PartTimePeriod[]> {
  await checkOrmInitialized();
  const databasePeriods = await orm.em.find(DBPartTimePeriod, {
    harvestId: { harvestId: Number(harvestId) },
  });

  let partTimePeriods: PartTimePeriod[] = databasePeriods.map((period) => {
    return {
      dailyHours: period.dailyHours,
      startsOn: new Date(period.startsOn),
      endsOn: new Date(period.endsOn),
    };
  });

  return partTimePeriods;
}

export async function getPreHarvestBalance(harvestId: string): Promise<number> {
  await checkOrmInitialized();
  let balance = 0;

  const user = await orm.em.findOne(User, { harvestId: Number(harvestId) });

  if (user) {
    balance = user.preHarvestBalance;
  }

  return balance;
}

export async function deleteAccount(harvestId: string): Promise<void> {
  await checkOrmInitialized();
  const account = await orm.em.findOne(Account, {
    providerAccountId: harvestId,
  });
  if (!account) return;
  await orm.em.removeAndFlush(account);
}

export async function getAllSpecials(): Promise<Record<number, SpecialDay>> {
  await checkOrmInitialized();
  const days: Record<number, SpecialDay> = {};
  const tasks = await orm.em.find(Task, {});
  tasks.forEach(t => {
    if (!IsSpecialType(t.type)) {
      console.log("Database has an unsupported SpecialType!");
      return;
    }

    days[t.id] = {
      type: t.type,
      description: t.description
    }
  })

  return days;
}