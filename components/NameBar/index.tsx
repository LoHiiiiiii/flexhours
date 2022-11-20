import { BalanceBar } from "components/NameBar/BalanceBar";
import BaseBar from "components/BaseBar";
import BaseButton from "components/BaseButton";
import { useRouter } from "next/router";

export interface NameBarProps {
  name: string;
  total: number;
  month: number;
  remaining: number;
}

export function NameBar({ name, total, month, remaining }: NameBarProps) {
  const router = useRouter();

  return (
    <BaseBar>
      <div className="flex justify-between tablet:items-center items-start">
        <div className="tablet:flex hidden items-center h-full">
          <Name name={name} />
        </div>
        <BalanceBar total={total} month={month} remaining={remaining}>
          <Name className="tablet:hidden" name={name} />
        </BalanceBar>
        <BaseButton>
          Logout
        </BaseButton>
      </div>
    </BaseBar>
  );
}

export function Name({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`${className} text-lg`}>
      {name ? name.split("_")[0] : "Unknown Doggo"}
    </span>
  );
}
