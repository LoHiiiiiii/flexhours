import { toHoursAndMinutes } from "utils/format-util";

export interface BalanceDisplayProsp {
  text: string;
  balance?: number;
}

export function BalanceDisplay({ text, balance }: BalanceDisplayProsp) {
  return (
    <div className="laptop:text-lg tablet:text-base text-lg flex items-center">
      <div className="tablet:basis-auto basis-40">{text}</div>
      <div className="bg-wdSecondary rounded-lg px-2 py-1 mx-2">
        {balance != undefined ? toHoursAndMinutes(balance) : "—"}
      </div>
    </div>
  );
}
