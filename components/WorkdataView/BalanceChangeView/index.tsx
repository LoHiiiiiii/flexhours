import BaseBar from "components/BaseBar";
import BaseButton from "components/BaseButton";
import { MouseEventHandler } from "react";
import { BalanceChange } from "types/balance";
import { BalanceChangeEntry } from "./BalanceChangeEntry";

export interface BalanceChangeViewProps {
  title: string;
  toggle: MouseEventHandler<HTMLButtonElement>;
  balanceChanges?: BalanceChange[];
}

export function BalanceChangeView({
  title,
  toggle,
  balanceChanges,
}: BalanceChangeViewProps) {
  return (
    <div className="basis-80 laptop:mt-0 tablet:mt-2">
      <BaseBar>
        <div className="text-xl font-bold basis-full text-center py-0.5">
          <BaseButton onClick={toggle}>
            <div className="px-1">{title}</div>
          </BaseButton>
        </div>
      </BaseBar>
      {!balanceChanges || balanceChanges.length === 0 ? (
        <div className="bg-wdBar rounded-xl text-m p-1 tablet:mt-3 mt-2">
          {"Your hours match the targets!"}
        </div>
      ) : (
        <div className="flex flex-col gap-2 tablet:mt-3 mt-2">
          {balanceChanges?.map((change) => (
            <BalanceChangeEntry
              key={change.description}
              balanceChange={change}
            />
          ))}
        </div>
      )}
    </div>
  );
}
