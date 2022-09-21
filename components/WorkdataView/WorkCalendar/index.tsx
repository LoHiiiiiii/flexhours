import { Arrow } from "components/Arrow";
import BaseBar from "components/BaseBar";
import BaseButton from "components/BaseButton";
import { MouseEventHandler } from "react";
import { Workday } from "types/balance";
import { getMonthYear } from "utils/format-util";
import { MonthDropdown } from "./MonthDropdown";
import { WeekdayBar } from "./WeekdayBar";
import { WorkdayCell } from "./WorkdayCell";

export interface WorkCalendarProps {
  currentMonth: Date;
  goBack?: MouseEventHandler<HTMLButtonElement>;
  goCurrent?: MouseEventHandler<HTMLButtonElement>;
  goForward: MouseEventHandler<HTMLButtonElement>;
  setMonth: (month: Date) => void;
  monthDays: Workday[];
  preExtraDays: Workday[];
  postExtraDays: Workday[];
  firstDay: Workday;
  lastDay: Workday;
  today: Workday;
}

export function WorkCalendar({
  currentMonth,
  goBack,
  goCurrent,
  goForward,
  setMonth,
  monthDays,
  preExtraDays,
  postExtraDays,
  firstDay,
  lastDay,
  today,
}: WorkCalendarProps) {
  return (
    <div className="w-full">
      <BaseBar>
        <div className="flex items-center grow-0">
          <div className="flex gap-1 shrink-0 basis-[230px] py-1 justify-end">
            {goBack ? <Arrow right={false} onClick={goBack} /> : <></>}
            <BaseButton onClick={goCurrent}>To current month</BaseButton>
            <Arrow right={true} onClick={goForward} />
          </div>
          <MonthDropdown
            currentMonth={currentMonth}
            setMonth={setMonth}
            firstDay={new Date(firstDay.date)}
            lastDay={new Date(lastDay.date)}
          />
        </div>
      </BaseBar>
      <WeekdayBar />
      <div className="grid grid-cols-7 grid-flow-row gap-2 pt-2">
        {preExtraDays.map((day) => (
          <WorkdayCell
            key={day.date}
            workday={day}
            today={today}
            firstDay={firstDay}
            extra={true}
          />
        ))}
        {monthDays.map((day) => (
          <WorkdayCell
            key={day.date}
            workday={day}
            today={today}
            firstDay={firstDay}
            extra={false}
          />
        ))}
        {postExtraDays.map((day) => (
          <WorkdayCell
            key={day.date}
            workday={day}
            today={today}
            firstDay={firstDay}
            extra={true}
          />
        ))}
      </div>
    </div>
  );
}
