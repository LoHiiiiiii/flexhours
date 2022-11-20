import BaseButton from "components/BaseButton";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="flex justify-between font-bold items-end p-5">
      <h1 className="uppercase laptop:text-4xl text-[1.7rem]">
        Doggotime - Flex Hours
      </h1>
      <BaseButton onClick={()=>{}}>
        <Link href="/"> Go to Dummy Data View </Link>
      </BaseButton>
    </div>
  );
}
