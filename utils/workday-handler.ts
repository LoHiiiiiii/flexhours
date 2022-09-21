import { BalanceChange, BalanceData, SpecialDay, Workday } from "types/balance";
import { dateToWeekdayFormat, dateToYMD } from "./format-util";
import { getFirstOfMonthsFromDates, getSpecialDay, getSpanFromDates } from "./time-util";

export function parseBalance(balanceData: BalanceData): {
    dataWorkdays: Record<string, Workday>,
    otherWorkdays: Record<string, Workday>,
    monthBalances: Record<string, number>,
    totalBalance: number
} {
    let totalBalance = 0;
    let ymd: string;
    let workday: Workday;
    let dataWorkdays: Record<string, Workday> = {};
    let otherWorkdays: Record<string, Workday> = {};
    let specialDay: SpecialDay | undefined;
    let difference: number;
    let monthBalances: Record<string, number> = {};

    const todayTime = new Date(balanceData.today).getTime();
    const span = getSpanFromDates(
      new Date(balanceData.firstWorkday),
      new Date(balanceData.lastMarkedDay)
    );
    const firstOfMonths = getFirstOfMonthsFromDates(
      new Date(balanceData.firstWorkday),
      new Date(balanceData.lastMarkedDay)
    );

    let firstOfMonthIndex = 0;
    monthBalances[dateToYMD(firstOfMonths[0])] = 0;

    span.forEach((date) => {
      ymd = dateToYMD(date);

      if (
        firstOfMonthIndex < firstOfMonths.length - 1 &&
        date.getTime() >= firstOfMonths[firstOfMonthIndex + 1].getTime()
      ) {
        firstOfMonthIndex++;
        monthBalances[dateToYMD(firstOfMonths[firstOfMonthIndex])] = 0;
      }

      workday = balanceData.workdays[ymd]
        ? balanceData.workdays[ymd]
        : {
            date: ymd,
            hoursWorked: 0,
            targetHours: balanceData.defaultDailyHours,
            overtimeHours: 0,
            timerRunning: false,
          };
        specialDay = getSpecialDay(new Date(date));
        if (specialDay) {
          workday.specialDay = specialDay;
          workday.targetHours = 0;
        }
      if (
        date.getTime() <= todayTime &&
        markBalance(workday, balanceData.today)
      ) {
        difference = workday.hoursWorked - workday.targetHours;

        totalBalance += difference;
        monthBalances[dateToYMD(firstOfMonths[firstOfMonthIndex])] +=
          difference;
      }

      if (balanceData.workdays[workday.date])
        dataWorkdays[workday.date] = workday;
      else otherWorkdays[workday.date] = workday;
    });

    return {
        dataWorkdays,
        otherWorkdays,
        monthBalances,
        totalBalance
    }
}

export function getBalanceChanges(workdays: Workday[], today: Workday, firstDate: Date): BalanceChange[] {
    const balanceChanges: BalanceChange[] = [];
    let date: Date;
    const todayDate = new Date(today.date);
    
    workdays.forEach(workday => {
        date = new Date(workday.date);

    if (
        date.getTime() > todayDate.getTime() ||
        date.getTime() < firstDate.getTime()
      )
        return workday;
  
      if (
        markBalance(workday, today.date) &&
        workday.hoursWorked != workday.targetHours
      ) {
        balanceChanges.push({
          description: dateToWeekdayFormat(new Date(workday.date)),
          change: workday.hoursWorked - workday.targetHours,
        });
      }
  
      return workday;
    });

    return balanceChanges;
}

export function markBalance(day: Workday, currentDate: string): boolean {
    return (
      day.date != currentDate ||
      (day.hoursWorked != 0 && !day.timerRunning) ||
      day.hoursWorked > day.targetHours
    );
  }