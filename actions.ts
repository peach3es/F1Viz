"use server";

import { Driver } from "./types/driver";

const f1API = process.env.F1API_URL;

export async function getDrivers(
  // session_key: number = 9472,
  teamName: string
): Promise<Driver[]> {
  if (!f1API) {
    throw new Error("F1API_URL is not defined");
  }

  teamName = encodeURIComponent(teamName);

  const endpointURL = `${f1API}drivers?session_key=9472&team_name=${teamName}`;
  const res = await fetch(endpointURL);

  if (!res.ok) {
    throw new Error("Failed to fetch drivers");
  }

  const apiResponse = await res.json();
  return apiResponse || [];
}

export async function getDriverByNumber(
  driverNumber: number,
  session_key: number = 9472
): Promise<Driver | null> {
  if (!f1API) {
    throw new Error("F1API_URL is not defined");
  }

  const endpointURL = `${f1API}drivers?session_key=${session_key}&driver_number=${driverNumber}`;
  const res = await fetch(endpointURL);

  if (!res.ok) {
    throw new Error("Failed to fetch driver");
  }

  const apiResponse = await res.json();

  if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
    return null;
  }

  return apiResponse[0];
}

export async function getTeams(session_key: number = 9472): Promise<string[]> {
  try {
    const res = await fetch(`${f1API}drivers?session_key=${session_key}`);
    const drivers = await res.json();

    // Extract unique team names
    const uniqueTeams: string[] = Array.from(
      new Set(drivers.map((driver: { team_name: string }) => driver.team_name))
    );

    return uniqueTeams;
  } catch (error) {
    console.error("Error fetching driver data:", error);
    return []; // Return an empty array on error
  }
}
