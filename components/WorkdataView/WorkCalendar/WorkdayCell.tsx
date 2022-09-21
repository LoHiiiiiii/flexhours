import { Workday } from "types/balance";
import { toHoursAndMinutes } from "utils/format-util";
import { FiClock } from "react-icons/fi";

export interface WorkdayCellProps {
  workday: Workday;
  today: Workday;
  firstDay: Workday;
  extra: boolean;
}

export function WorkdayCell({
  workday,
  today,
  firstDay,
  extra,
}: WorkdayCellProps) {
  const color = getColor(workday, today, firstDay, extra);
  const date = new Date(workday.date);
  const hideZeroHours =
    ((workday.date === today.date || workday.specialDay != undefined) &&
      workday.hoursWorked === 0 &&
      !workday.timerRunning) ||
    today.date < workday.date ||
    workday.date < firstDay.date;

  const hourColor = getHourColor(
    workday.hoursWorked - workday.targetHours,
    hideZeroHours || extra
  );

  return (
    <div
      className={`${color} ${
        today.date === workday.date ? "border-wdText border-2" : "p-0.5"
      } rounded-lg text-center flex flex-col items-center `}
    >
      <div className={`${today.date === workday.date ? "font-bold" : ""}`}>
        {" "}
        {`${date.getDate()}.${date.getMonth() + 1}`}{" "}
      </div>
      <div className="tablet:h-10 h-8 flex items-center">
        {!hideZeroHours ||
        workday.hoursWorked > 0 ||
        workday.overtimeHours > 0 ? (
          <div className="flex flex-row items-center gap-1 justify-center">
            <div className="w-4 tablet:inline hidden" />
            <div
              className={`${hourColor} w-fit rounded-2xl px-1.5 text-xl font-bold`}
            >
              {toHoursAndMinutes(workday.hoursWorked + workday.overtimeHours)}
            </div>
            {workday.timerRunning ? (
              <FiClock className="tablet:inline hidden w-4" />
            ) : (
              <div className="w-4 tablet:inline hidden" />
            )}
          </div>
        ) : (
          <div className="laptopL:text-base text-smMinus tablet:inline hidden px-0.5 align-center">
            {workday?.specialDay?.description}
          </div>
        )}
      </div>
    </div>
  );
}

function getColor(
  workday: Workday,
  today: Workday,
  firstDay: Workday,
  extra: boolean
): string {
  if (extra) return "bg-wdTertiary";
  if (
    workday.specialDay &&
    (workday.specialDay.type === "dayoff" || workday.hoursWorked === 0)
  )
    return "bg-wdSpecial";
  if (
    new Date(today.date).getTime() < new Date(workday.date).getTime() ||
    new Date(firstDay.date).getTime() > new Date(workday.date).getTime()
  )
    return "bg-wdSecondary";
  if (today.date === workday.date) return "bg-wdPrimary";
  return "bg-wdSecondary";
}

function getHourColor(difference: number, hide: boolean) {
  if (hide) return "";
  if (difference < 0) return "bg-wdBehind";
  if (difference > 0) return "bg-wdAhead";
  return "";
}
