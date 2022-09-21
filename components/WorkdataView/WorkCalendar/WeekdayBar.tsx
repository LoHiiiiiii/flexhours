import { getWeekdayNames, getWeekdayNamesShort } from "utils/format-util";

export function WeekdayBar() {
  return (
    <>
      <div className="tablet:grid hidden bg-wdBar py-1 rounded-lg mt-3 grid-cols-7 justify-between">
        {getWeekdayNames().map((day) => (
          <div key={day} className="justify-self-stretch text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="tablet:hidden grid bg-wdBar mt-2 rounded-lg grid-cols-7 justify-between">
        {getWeekdayNamesShort().map((day) => (
          <div key={day} className="justify-self-stretch text-center">
            {day}
          </div>
        ))}
      </div>
    </>
  );
}
