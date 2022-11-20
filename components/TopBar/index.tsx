import BaseButton from "components/BaseButton";
import { useRouter } from "next/router";

export function TopBar() {
  const router = useRouter();

  return (
    <div className="flex justify-between font-bold items-end p-5">
      <h1 className="uppercase laptop:text-4xl text-[1.7rem]">
        Doggotime - Flex Hours
      </h1>
      <BaseButton onClick={()=>router.replace("/")}>
        Go to Dummy Data View
      </BaseButton>
    </div>
  );
}
