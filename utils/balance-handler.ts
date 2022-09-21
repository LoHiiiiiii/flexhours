import { Workday, BalanceData, SpecialDay } from "types/balance";
import { HarvestTimeEntry } from "types/harvest";
import { getPartTimePeriods, getPreHarvestBalance, getAllSpecials } from "./database-handler";
import { dateToYMD } from "./format-util";
import { getTimeEntries } from "./harvest-handler";
import { getSpanFromDates } from "./time-util";

const defaultDailyHours = 7.5;
const firstHarvestDay = "2016-01-01";

export default async function getTotalBalance(
  harvestId: string,
  accessToken: string
): Promise<BalanceData> {
  const entries = await getTimeEntries(harvestId, accessToken);
  const partTimePeriods = await getPartTimePeriods(harvestId);
  const baseBalance = await getPreHarvestBalance(harvestId);
  const firstPossibleTime = new Date(firstHarvestDay).getTime();

  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let firstWorkdayTime = today.getTime();
  let lastMarkedTime = today.getTime();
  let special: SpecialDay | undefined;

  const workdays: Record<string, Workday> = {};

  const specials = await getAllSpecials();

  for await (const entry of entries) {
    special = (specials[entry.task.id]) ? { ...specials[entry.task.id] } : undefined;
    
    const time = new Date(entry.spent_date).getTime();

    if (time < firstPossibleTime) break;

    const workday: Workday = {
      date: entry.spent_date,
      timerRunning: entry.is_running,
      targetHours: defaultDailyHours,
      hoursWorked: entry.rounded_hours,
      overtimeHours: 0
    };

    if (special) {
      workday.specialDay = special;
      switch (special.type) {
        case "dayoff":
          workday.targetHours = 0;
          break;
        case "overtime":
          workday.overtimeHours += workday.hoursWorked;
          break;
      }
      workday.hoursWorked = 0;
    }

    if (!workdays[workday.date]) {
      workdays[workday.date] = workday;
    } else {
      workdays[workday.date].hoursWorked += workday.hoursWorked;
      workdays[workday.date].overtimeHours += workday.overtimeHours;
      workdays[workday.date].timerRunning = workdays[workday.date].timerRunning || workday.timerRunning;

      if (workday.specialDay && !workdays[workday.date].specialDay) {
        workdays[workday.date].specialDay = workday.specialDay;
      }
    }

    if (time < firstWorkdayTime) {
      firstWorkdayTime = time;
    }

    if (time > lastMarkedTime) {
      lastMarkedTime = time;
    }
  }

  partTimePeriods.forEach((period) => {
    const dates: Date[] = getSpanFromDates(
      new Date(period.startsOn),
      new Date(period.endsOn)
    );

    dates.forEach((date) => {
      if (date.getTime() < firstPossibleTime) return;

      const ymd = dateToYMD(date);

      if (!workdays[ymd]) {
        workdays[ymd] = {
          date: ymd,
          timerRunning: false,
          targetHours: period.dailyHours,
          hoursWorked: 0,
          overtimeHours: 0
        };
      } else {
        if (workdays[ymd].targetHours > 0)
        workdays[ymd].targetHours = period.dailyHours;
      }

      if (date.getTime() < firstWorkdayTime) {
        firstWorkdayTime = date.getTime();
      }
    });
  });

  return {
    baseBalance,
    today: dateToYMD(today),
    firstWorkday: dateToYMD(new Date(firstWorkdayTime)),
    lastMarkedDay: dateToYMD(new Date(lastMarkedTime)),
    defaultDailyHours,
    workdays,
  };
}