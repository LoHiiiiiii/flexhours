export function zeroPad(num: number, places: number): string {
  return String(num).padStart(places, "0");
}

function getMinutes(num: number, hour: number): string {
  return zeroPad(Math.round(Math.abs(num - hour) * 60), 2);
}

function getHours(num: number): number {
  return Math.sign(num) * Math.floor(Math.abs(num));
}

export function toHoursAndMinutes(num: number): string {
  const hour = getHours(num);

  return `${num < 0 && hour == 0 ? "-" : ""}${hour}:${getMinutes(num, hour)}`;
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function getWeekdayName(num: number): string {
  if (num < 0 || num > 6) return "";

  return weekdays[(num + 6) % 7];
}

export function getWeekdayNames(): string[] {
  return weekdays;
}
export function getWeekdayNamesShort(): string[] {
  return weekdaysShort;
}

export function getMonthYear(date: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function dateToYMD(date: Date): string {
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1, 2)}-${zeroPad(
    date.getDate(),
    2
  )}`;
}

export function dateToWeekdayFormat(date: Date): string {
  return `${date.getDate()}.${date.getMonth() + 1}. - ${getWeekdayName(
    date.getDay()
  )}`
}