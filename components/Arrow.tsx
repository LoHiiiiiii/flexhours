import { MouseEventHandler } from "react";

export interface ArrowProps {
  right: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function Arrow({ right, onClick }: ArrowProps) {
  return (
    <button className="flex items-center cursor-pointer" onClick={onClick}>
      <div
        className={`w-8 h-8 px-2 flex rounded-xl ${
          right ? "justify-start" : "justify-end"
        } items-center hover:bg-wdBg`}
      >
        <div
          className={`w-2 h-2 p-[5px] border-solid border-r-[3px] border-b-[3px] ${
            right ? "-rotate-45" : "rotate-[135deg]"
          }`}
        />
      </div>
    </button>
  );
}
