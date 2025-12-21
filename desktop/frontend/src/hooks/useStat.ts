import { useEffect, useState } from "react";
import { repo } from "../../wailsjs/go/models";
import { GetTodayTasks } from "../../wailsjs/go/main/App";



export type StatHandler = {
    isLoading: boolean;
    getTodayTasks: () => void;
    todayTasks: repo.TodayTask[];
}

export const useStatHandler = (): StatHandler =>{
    const [isLoading, setIsLoading] = useState(true);
    const [todayTasks, setTodayTasks] = useState<repo.TodayTask[]>([]);

    const getTodayTasks = ()=> {
        setIsLoading(true);
        GetTodayTasks().then((tasks) => {
            console.log("Today tasks:", tasks);
            setTodayTasks(tasks);
        }).catch((error) => {
            console.error("Error fetching today tasks:", error);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getTodayTasks();
    }, []);

    return { isLoading, getTodayTasks, todayTasks }
}