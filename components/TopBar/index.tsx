import Image from "next/image";
import harvestLogo from "./img/harvest.png";

export function TopBar() {
  return (
    <div className="flex justify-between font-bold items-end p-5">
      <h1 className="uppercase laptop:text-4xl text-[1.7rem]">
        Doggotime - Flex Hours
      </h1>
      <a
        className="text-lg flex align-middle items-center hover:bg-wdSecondary hover:tablet:bg-opacity-0 tablet:bg-opacity-0 bg-wdPrimary tablet:p-0 p-3 rounded-lg"
        href="https://wunderdog.harvestapp.com"
      >
        <span className="tablet:inline hidden"> Data synced from </span>
        <div className="tablet:px-1 px-0">
          <div className="relative w-5.5 h-5.5">
            <Image layout="fill" alt="harvest logo" src={harvestLogo} />
          </div>
        </div>
      </a>
    </div>
  );
}
