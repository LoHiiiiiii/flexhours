import BaseButton from "components/BaseButton";
import { useState } from "react";
import { dateToYMD, getMonthYear } from "utils/format-util";
import { getFirstOfMonthsFromDates } from "utils/time-util";

export interface MonthDropdownProps {
  currentMonth: Date;
  setMonth: (month: Date) => void;
  firstDay: Date;
  lastDay: Date;
}

export function MonthDropdown({
  currentMonth,
  setMonth,
  firstDay,
  lastDay,
}: MonthDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const months = getFirstOfMonthsFromDates(firstDay, lastDay);
  const currentYMD = dateToYMD(currentMonth);

  months.reverse();

  return (
    <div className="basis-full flex self-stretch justify-center items-start">
      <div
        onBlur={() => setShowDropdown(false)}
        className={`${
          showDropdown ? "border-wdText border-2 px-2" : "m-0.5"
        } bg-wdSecondary absolute rounded-3xl flex flex-col justify-end`}
      >
        <BaseButton onClick={() => setShowDropdown(!showDropdown)}>
          <span className="text-xl font-bold text-center">
            {getMonthYear(currentMonth)}
          </span>
        </BaseButton>
        <div className={`flex flex-col items-start`}>
          {months.map((month) => {
            if (!showDropdown) return null;
            const ymd = dateToYMD(month);
            return (
              <button
                className={`hover:bg-wdBg rounded-3xl px-2 py-1 z-10 ${
                  currentYMD === ymd ? "font-bold" : ""
                }`}
                key={ymd}
                onMouseDown={() => {
                  if (currentYMD != ymd) setMonth(month);
                  setShowDropdown(false);
                }}
              >
                {getMonthYear(month)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
