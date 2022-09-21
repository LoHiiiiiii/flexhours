export type Workday = {
  date: string;
  hoursWorked: number;
  targetHours: number;
  overtimeHours: number;
  timerRunning: boolean;
  specialDay?: SpecialDay;
};

export type BalanceChange = {
  description: string;
  change: number;
}

const specialTypeSource = ["dayoff", "ignore", "overtime"] as const;
type SpecialType = typeof specialTypeSource[number];

export function IsSpecialType(string: string): string is SpecialType {
  const lower = string.toLowerCase();
  return specialTypeSource.some(s => s.toLowerCase() === lower)
}

export type SpecialDay = {
  type: SpecialType;
  description?: string;
}

export type PartTimePeriod = {
  startsOn: Date;
  endsOn: Date;
  dailyHours: number;
};

export type BalanceData = {
  baseBalance: number;
  defaultDailyHours: number;
  today: string;
  firstWorkday: string;
  lastMarkedDay: string;
  workdays: Record<string, Workday>; // Key = YYYY-MM-DD
};