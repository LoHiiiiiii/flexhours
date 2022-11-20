import BaseBar from "components/BaseBar";
import BaseButton from "components/BaseButton";
import Head from "next/head";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function Page({
  workdaysString,
  setWorkdaysString,
}:{workdaysString:string, setWorkdaysString:any}) {

  const handleChange:ChangeEventHandler<HTMLTextAreaElement> = (event) => { 
    setWorkdaysString(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Doggotime</title>
      </Head>
      <div className="cursor-default select-none m-auto tablet:px-4 pt-1 text-wdText font-global min-w-[480px] max-w-[1300px] flex flex-col">
        <div className="flex justify-between font-bold items-end p-5">
          <h1 className="uppercase laptop:text-4xl text-[1.7rem]">
            Doggotime - Dummy Data View
          </h1>
          <BaseButton onClick={()=>{}}>
            <Link href="calendar"> Go to Calendar </Link>
          </BaseButton>
        </div>
        <textarea className="rounded-lg p-2 bg-wdBar min-h-[600px]" style={{resize: "none"}} value={workdaysString} onChange={handleChange} draggable={false}/>
      </div>
    </>
  );
};
