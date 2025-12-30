import { useEffect, useState } from "react";
import { repo } from "../../wailsjs/go/models";
import { GetTodayTasks } from "../../wailsjs/go/main/App";


export type StatHandler = {
    isLoading: boolean;
    getTodayTasks: (date: Date) => void;
    todayTasks: repo.TodayTask[];
    onDateChange: (date: Date) => void;
}

export const useStatHandler = (): StatHandler => {
    const [isLoading, setIsLoading] = useState(true);
    const [todayTasks, setTodayTasks] = useState<repo.TodayTask[]>([]);
    const getTodayTasks = (date: Date) => {
        setIsLoading(true);
        GetTodayTasks(date)
            .then((tasks) => {
                console.log("Today tasks:", tasks);
                if(tasks){
                    setTodayTasks(() => [...tasks]);
                }else{
                    setTodayTasks([]);
                }
            }).catch((error) => {
                console.error("Error fetching today tasks:", error);
                setTodayTasks([]);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getTodayTasks(new Date());
    }, []);


    const onDateChange = (date: Date) => {        
        getTodayTasks(date);
    }

    return { isLoading, getTodayTasks, todayTasks, onDateChange }
}