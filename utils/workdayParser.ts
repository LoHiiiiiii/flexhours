import { Workday } from "types/balance";
import { dateToYMD } from "./format-util";

type RawWorkday = {
    date?: string;
    hoursWorked?: string;
    targetHours?: string;
    special?: "ignore" | "dayoff" | "overtime" | "timing";
    description?: string;
}

export type ParsedWorkdays = {
    name: string;
    currentDay: string;
    firstDay: string;
    dailyHours: number;
    workdays: Record<string, Workday>;
}

export function parseWorkdays(text: string): ParsedWorkdays {
    const splitString = " | "
    const rows = text.split("\n");
    const today = dateToYMD(new Date());
    
    if (rows.length === 0) return { 
        name: "Unknown name",
        firstDay: today,
        currentDay: today,
        dailyHours: 7.5,
        workdays: {}
    };

    const firstRow = rows[0].split(splitString);
    const name = firstRow[0];
    const currentDay = (firstRow.length > 1) ? stringToYMD(firstRow[1]) : undefined;
    let dailyHours = 7.5;
    if (firstRow.length > 2) {
        const parsed = parseFloat(firstRow[2]);
        if (!isNaN(parsed)) dailyHours = parsed;
    }
    
    const firstDay = (rows.length > 1) ? stringToYMD(rows[1].split(splitString)[0]): undefined;

    const rawWorkdays: RawWorkday[] = rows.slice(1, -1).map((string) => {
        const split = string.split(splitString);
        const raw: RawWorkday =  {
            date: split[0] ?? undefined,
            hoursWorked: split[1] ?? undefined,
            targetHours: split[2] ?? undefined,
            special: undefined,
            description: split[4] ?? undefined
        };
        if (split[3] === "dayoff" 
        || split[3] === "ignore" 
        || split[3] === "overtime" 
        || split[3] === "timing") raw.special = split[3];
        return raw;
    });

    const workdays = rawWorkdays.reduce((workdays: Record<string, Workday>, raw) => {
        return addRawToRecord(workdays, raw);
    }, {});

    return {
        name,
        firstDay: firstDay ?? today,
        currentDay: currentDay ?? today,
        dailyHours,
        workdays
    };
};

function addRawToRecord(workdays: Record<string, Workday>, raw: RawWorkday) {
    if (!raw.date || !raw.hoursWorked ||!raw.targetHours) return workdays;
    const date = new Date(raw.date);
    if (isNaN(date.getTime())) return workdays;
    const ymd = dateToYMD(date);
    const workday: Workday = {
        date: ymd,
        hoursWorked: 0,
        targetHours: 0,
        overtimeHours: 0,
        timerRunning: raw.special === "timing"
    };

    if (raw.special != "ignore" && raw.special != "overtime" && raw.special != "dayoff") {
        const parsed = parseFloat(raw.hoursWorked);
        workday.hoursWorked = (isNaN(parsed)) ? workday.hoursWorked : parsed;
    } else if (raw.special === "overtime") {
        const parsed = parseFloat(raw.hoursWorked);
        workday.overtimeHours = (isNaN(parsed)) ? workday.overtimeHours : parsed;
    }

    if (raw.special != "dayoff") {
        const parsed = parseFloat(raw.targetHours);
        workday.targetHours = (isNaN(parsed)) ? workday.targetHours : parsed;
    }

    if (raw.special && raw.special != "timing"){
        workday.specialDay = {
            type: raw.special,
            description: raw.description
        }
    }

    if (workdays[ymd]){
        workdays[ymd].hoursWorked += workday.hoursWorked;
        workdays[ymd].targetHours = Math.max(workday.targetHours, workdays[ymd].targetHours);
        workdays[ymd].overtimeHours += workday.overtimeHours;
        workdays[workday.date].timerRunning = workdays[workday.date].timerRunning || workday.timerRunning;
        if (!workdays[ymd].specialDay && workday.specialDay) workdays[ymd].specialDay = workday.specialDay;
    } else {
        workdays[ymd] = workday;
    }

    return workdays;
};

function stringToYMD(string: string | undefined) {
    if (!string) return undefined;
    const date = new Date(string);
    if (isNaN(date.getTime())) return undefined;
    return dateToYMD(date);
}