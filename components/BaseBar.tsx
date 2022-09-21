import { ReactNode } from "react";

export default function BaseBar({ children }: { children: ReactNode }) {
  return <div className="mt-2 bg-wdBar px-4 py-3 rounded-lg">{children}</div>;
}
