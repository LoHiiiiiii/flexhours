import { MouseEventHandler } from "react";
import { BalanceChange, Workday } from "types/balance";
import { BalanceChangeView } from "./BalanceChangeView";
import { WorkCalendar } from "./WorkCalendar";

export interface WorkdataViewProps {
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
  balanceChangeTitle: string;
  balanceToggle: MouseEventHandler<HTMLButtonElement>;
  balanceChanges?: BalanceChange[];
}

export function WorkdataView(props: WorkdataViewProps) {
  return (
    <div className="flex laptop:flex-row flex-col tablet:mt-2 laptop:gap-4 items-start">
      <WorkCalendar {...props} />
      <BalanceChangeView
        title={props.balanceChangeTitle}
        toggle={props.balanceToggle}
        balanceChanges={props.balanceChanges}
      />
    </div>
  );
}
