import { SpecialDay } from "types/balance";
import holidays from "finnish-holidays-js";
import { dateToYMD } from "./format-util";

function isEarlierOrEqualDate(a: Date, b: Date) {
  return (a.getFullYear() < b.getFullYear() 
  || (a.getFullYear() === b.getFullYear()
      && (a.getMonth() < b.getMonth() 
          || (a.getMonth() === b.getMonth() && a.getDate() <= b.getDate())
         )
      )
  )
}

export function getSpanFromDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];

  let currentDate: Date = startDate;
  while (isEarlierOrEqualDate(currentDate, endDate)) {
    dates.push(currentDate);
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function getMonthFromFirstDate(firstOfMonth: Date): Date[] {
  return getSpanFromDates(
    firstOfMonth,
    new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 1, 0)
  );
}

export function getFirstOfMonthsFromDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];

  let currentDate: Date = new Date(startDate.getFullYear(), startDate.getMonth());
  while (isEarlierOrEqualDate(currentDate, endDate)) {
    dates.push(currentDate);
    currentDate = new Date(currentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return dates;
}

export function getEarlierWeekdates(date: Date) {
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 1
  );
  let firstDay = new Date(date);

  if (firstDay.getDay() != 1) {
    if (firstDay.getDay() === 0) {
      firstDay.setDate(firstDay.getDate() - 6);
    } else {
      firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
    }
  }

  return getSpanFromDates(firstDay, lastDay);
}

export function getLaterWeekdates(date: Date) {
  const firstDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  let lastDay = new Date(date);

  if (lastDay.getDay() != 0) {
    lastDay.setDate(lastDay.getDate() + (7 - lastDay.getDay()));
  }

  return getSpanFromDates(firstDay, lastDay);
}

export function getSpecialDay(date: Date): SpecialDay | undefined {
  const monthsHolidays = holidays.month(
    date.getMonth() + 1,
    date.getFullYear(),
    true
  );
  let foundHoliday: SpecialDay | undefined;
  monthsHolidays.forEach((holiday) => {
    const holidayDate = new Date(holiday.year, holiday.month - 1, holiday.day);
    if (dateToYMD(date) === dateToYMD(holidayDate)) {
      foundHoliday = {
        type: "dayoff",
        description: holiday.description
      };
      return;
    }
  });

  if (foundHoliday) return foundHoliday;

  if (date.getDay() === 6 || date.getDay() === 0) return {type: "dayoff"};

  return undefined;
}
