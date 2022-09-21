import { NameBar } from "components/NameBar";
import { TopBar } from "components/TopBar";
import { WorkdataView } from "components/WorkdataView";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BalanceChange, BalanceData, Workday } from "types/balance";
import getBalanceData from "utils/balance-handler";
import { getAccessToken } from "utils/database-handler";
import { dateToYMD, getMonthYear } from "utils/format-util";
import {
  getMonthFromFirstDate,
  getEarlierWeekdates,
  getSpecialDay,
  getLaterWeekdates,
} from "utils/time-util";
import { getBalanceChanges, parseBalance } from "utils/workday-handler";

export default function Page({
  name,
  balanceData,
}: {
  name: string;
  balanceData: BalanceData;
}) {
  const today = new Date(balanceData.today);

  const [cookies, setCookies] = useCookies(["currentMonth"]);

  if (!cookies.currentMonth) {
    cookies.currentMonth = new Date(today.getFullYear(), today.getMonth());
    setCookies("currentMonth", cookies.currentMonth);
  }
  const firstOfMonth = new Date(cookies.currentMonth);

  const [dataWorkdays, setDataWorkdays] = useState<Record<string, Workday>>({});
  const [totalBalance, setTotalBalance] = useState(0);
  const [otherWorkdays, setOtherWorkdays] = useState<Record<string, Workday>>(
    {}
  );
  const [showMonthBalances, setShowMonthBalances] = useState(false);
  const [monthBalances, setMonthBalances] = useState<Record<string, number>>(
    {}
  );
  const [balanceHandled, setBalanceHandled] = useState(false);

  useEffect(() => {
    if (!balanceData) {
      return;
    }

    const parsedData = parseBalance(balanceData);

    setDataWorkdays(parsedData.dataWorkdays);
    setOtherWorkdays(parsedData.otherWorkdays);
    setMonthBalances(parsedData.monthBalances);
    setTotalBalance(parsedData.totalBalance + balanceData.baseBalance);
    setBalanceHandled(true);
  }, [name, balanceData]);

  if (!balanceHandled) return null;

  const monthDates = getMonthFromFirstDate(firstOfMonth);
  const tempOtherWorkdays = { ...otherWorkdays };
  let balanceChanges: BalanceChange[] = [];

  let otherWorkdaysUpdated = false;
  let currentWorkday = getWorkdayFromDate(balanceData.today);

  function getWorkdayFromDate(date: string): Workday {
    if (dataWorkdays[date]) return dataWorkdays[date];

    if (!tempOtherWorkdays[date]) {
      const newWorkDay: Workday = {
        date,
        hoursWorked: 0,
        targetHours: balanceData.defaultDailyHours,
        overtimeHours: 0,
        timerRunning: false,
      };
      newWorkDay.specialDay = getSpecialDay(new Date(date));
      if (newWorkDay.specialDay && newWorkDay.specialDay.type == "dayoff")
        newWorkDay.targetHours = 0;
      tempOtherWorkdays[newWorkDay.date] = newWorkDay;
      otherWorkdaysUpdated = true;
    }
    return tempOtherWorkdays[date];
  }

  const monthWorkdays = monthDates.map((date) =>
    getWorkdayFromDate(dateToYMD(date))
  );

  if (showMonthBalances) {
    if (balanceData.baseBalance != 0)
      balanceChanges.push({
        description: "Pre-Harvest",
        change: balanceData.baseBalance,
      });
    Object.keys(monthBalances).forEach((ymd) => {
      if (monthBalances[ymd] === 0) return;
      balanceChanges.push({
        description: getMonthYear(new Date(ymd)),
        change: monthBalances[ymd],
      });
    });
    balanceChanges.reverse();
  } else {
    balanceChanges = getBalanceChanges(
      monthWorkdays,
      currentWorkday,
      new Date(balanceData.firstWorkday)
    );
  }

  const earlyWeekFillerWorkdays: Workday[] = getEarlierWeekdates(
    firstOfMonth
  ).map((date) => getWorkdayFromDate(dateToYMD(date)));
  const lateWeekFillerWorkdays: Workday[] = getLaterWeekdates(
    monthDates[monthDates.length - 1]
  ).map((date) => getWorkdayFromDate(dateToYMD(date)));

  if (otherWorkdaysUpdated) setOtherWorkdays(tempOtherWorkdays);

  let remainingWork = 0;

  if (currentWorkday.targetHours > currentWorkday.hoursWorked)
    remainingWork = currentWorkday.targetHours - currentWorkday.hoursWorked;

  const setMonthCurrent =
    today.getFullYear() === firstOfMonth.getFullYear() &&
    today.getMonth() === firstOfMonth.getMonth()
      ? undefined
      : () =>
          setCookies(
            "currentMonth",
            new Date(today.getFullYear(), today.getMonth())
          );
  const increaseMonth = () =>
    setCookies(
      "currentMonth",
      new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 1)
    );
  const decreaseMonth = () =>
    setCookies(
      "currentMonth",
      new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() - 1)
    );
  const setMonth = (month: Date) => setCookies("currentMonth", month);

  const toggleMonthBalances = () => {
    setShowMonthBalances(!showMonthBalances);
  };

  const inFirstWorkMonth =
    firstOfMonth.getFullYear() ==
      new Date(balanceData.firstWorkday).getFullYear() &&
    firstOfMonth.getMonth() == new Date(balanceData.firstWorkday).getMonth();

  return (
    <>
      <Head>
        <title>Doggotime</title>
      </Head>
      <div className="cursor-default select-none m-auto tablet:px-4 pt-1 text-wdText font-global min-w-[480px] max-w-[1300px]">
        <TopBar />
        <NameBar
          name={name}
          total={totalBalance}
          month={monthBalances[dateToYMD(firstOfMonth)]}
          remaining={remainingWork}
        />
        <WorkdataView
          currentMonth={monthDates[0]}
          goBack={inFirstWorkMonth ? undefined : decreaseMonth}
          goCurrent={setMonthCurrent}
          goForward={increaseMonth}
          setMonth={setMonth}
          monthDays={monthWorkdays}
          preExtraDays={earlyWeekFillerWorkdays}
          postExtraDays={lateWeekFillerWorkdays}
          firstDay={getWorkdayFromDate(balanceData.firstWorkday)}
          lastDay={getWorkdayFromDate(balanceData.lastMarkedDay)}
          today={currentWorkday}
          balanceChangeTitle={
            showMonthBalances ? "Total Changes" : "Month Changes"
          }
          balanceToggle={toggleMonthBalances}
          balanceChanges={balanceChanges}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const harvestId = `${session.harvestId}`;

  const accessToken = await getAccessToken(harvestId);
  if (!accessToken) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const balanceData = await getBalanceData(harvestId, accessToken);

  return {
    props: {
      name: session.user.name,
      balanceData,
    },
  };
};
