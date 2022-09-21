import { BalanceChange } from "types/balance";
import { toHoursAndMinutes } from "utils/format-util";

export interface BalanceChangeProps {
  balanceChange: BalanceChange;
}

export function BalanceChangeEntry({ balanceChange }: BalanceChangeProps) {
  return (
    <div className="flex flex-row gap-2 justify-between items-center">
      <div className="bg-wdBar rounded-xl text-m py-1 p-2">
        {balanceChange.description}
      </div>
      <div
        className={`${
          balanceChange.change > 0 ? "bg-wdAhead" : "bg-wdBehind"
        } basis-16 rounded-2xl py-1 px-2 font-bold text-center`}
      >
        {balanceChange.change > 0
          ? "+" + toHoursAndMinutes(balanceChange.change)
          : toHoursAndMinutes(balanceChange.change)}
      </div>
    </div>
  );
}
