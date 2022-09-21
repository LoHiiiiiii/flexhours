import { MouseEventHandler, ReactNode } from "react";

export default function BaseButton({
  onClick,
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}) {
  if (!onClick) {
    return (
      <button className="bg-wdTertiary rounded-3xl cursor-default px-2 py-1">
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="bg-wdSecondary hover:bg-wdBg rounded-3xl px-2 py-1"
    >
      {children}
    </button>
  );
}
