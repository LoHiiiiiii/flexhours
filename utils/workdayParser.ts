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
    const currentDay = (firstRow.length > 1) ? firstRow[1] : undefined;
    let dailyHours = 7.5;
    if (firstRow.length > 2) {
        const parsed = parseFloat(firstRow[2]);
        if (!isNaN(parsed)) dailyHours = parsed;
    }
    const firstDay = (rows.length > 1) ? rows[1].split(splitString)[0]: undefined;

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

const addRawToRecord = (workdays: Record<string, Workday>, raw: RawWorkday) => {
    if (!raw.date || !raw.hoursWorked ||!raw.targetHours) return workdays;
        const workday: Workday = {
            date: raw.date,
            hoursWorked: 0,
            targetHours: 0,
            overtimeHours: 0,
            timerRunning: raw.special === "timing"
        };

        if (raw.special != "ignore" && raw.special != "overtime") {
            const parsed = parseFloat(raw.hoursWorked);
            workday.hoursWorked = (isNaN(parsed)) ? workday.hoursWorked : parsed;
        } else if (raw.special === "overtime") {
            const parsed = parseFloat(raw.hoursWorked);
            workday.overtimeHours = (isNaN(parsed)) ? workday.overtimeHours : parsed;
        }

        const parsed = parseFloat(raw.targetHours);
        workday.targetHours = (isNaN(parsed)) ? workday.targetHours : parsed;

        if (raw.special && raw.special != "timing"){
            workday.specialDay = {
                type: raw.special,
                description: raw.description
            }
        }

        if (workdays[raw.date]){
            workdays[raw.date].hoursWorked += workday.hoursWorked;
            workdays[raw.date].targetHours += Math.max(workday.targetHours, workdays[raw.date].targetHours);
            workdays[raw.date].overtimeHours += workday.hoursWorked;
            workdays[workday.date].timerRunning = workdays[workday.date].timerRunning || workday.timerRunning;
            if (!workdays[raw.date].specialDay && workday.specialDay) workdays[raw.date].specialDay = workday.specialDay;
        } else {
            workdays[raw.date] = workday;
        }


        return workdays;
}