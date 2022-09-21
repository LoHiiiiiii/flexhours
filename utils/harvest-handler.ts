import axios, { AxiosResponse } from "axios";
import { request } from "http";
import {
  HarvestTimeEntriesAndPagesResponse,
  HarvestTimeEntry,
} from "types/harvest";

export async function getTimeEntries(
  harvestId: string,
  accessToken: string
): Promise<HarvestTimeEntry[]> {
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Harvest-Account-Id": Number(process.env.HARVEST_WUNDERDOG_ACCOUNT_ID),
      "User-Agent": "Doggotime (vertti.viitanen@wunderdog.fi)",
    },
  };

  let entries: HarvestTimeEntry[] = [];
  const response = await axios.get<HarvestTimeEntriesAndPagesResponse>(
    `https://api.harvestapp.com/v2/time_entries?page=1&user_id=${harvestId}`,
    headers
  );
  entries = entries.concat(response.data.time_entries);

  if (response.data.total_pages > 1) {
    let requests: Promise<
      AxiosResponse<HarvestTimeEntriesAndPagesResponse, any>
    >[] = [];
    for (let i = 2; i <= response.data.total_pages; ++i) {
      requests[i - 2] = axios.get<HarvestTimeEntriesAndPagesResponse>(
        `https://api.harvestapp.com/v2/time_entries?page=${i}&user_id=${harvestId}`,
        headers
      );
    }

    const responses = await Promise.all(requests);
    entries = responses.reduce((previous, current) => {
      return previous.concat(current.data.time_entries);
    }, entries);
  }

  return entries;
}

export async function tryRefreshAccessToken(refreshToken: string | undefined) {
  if (!process.env.HARVEST_CLIENT_ID || !process.env.HARVEST_CLIENT_SECRET || !refreshToken) return null;

  try {
    const url =
      "https://id.getharvest.com/api/v2/oauth2/token?" +
      new URLSearchParams({
        client_id: process.env.HARVEST_CLIENT_ID,
        client_secret: process.env.HARVEST_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Math.floor(Date.now()/1000) + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? refreshToken
    }
  } catch (error) {
    console.log(error)

    return null
  }
}
