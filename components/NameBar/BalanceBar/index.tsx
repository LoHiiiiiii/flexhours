import { ReactNode } from "react";
import { BalanceDisplay } from "./BalanceDisplay";

export interface BalanceBarProps {
  total?: number;
  month?: number;
  remaining?: number;
  children?: ReactNode;
}

export function BalanceBar({
  total,
  month,
  remaining,
  children,
}: BalanceBarProps) {
  return (
    <div className="flex tablet:items-center gap-4 tablet:flex-row flex-col">
      {children}
      <BalanceDisplay text="Total" balance={total} />
      <BalanceDisplay text="This month" balance={month} />
      <BalanceDisplay text="Left today" balance={remaining} />
    </div>
  );
}
