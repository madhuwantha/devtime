import { useEffect, useState } from "react";
import { repo } from "../../wailsjs/go/models";
import { GetTodayTasks } from "../../wailsjs/go/main/App";



export type StatHandler = {
    isLoading: boolean;
    getTodayTasks: () => void;
    todayTasks: repo.TodayTask[];
}

export const useStatHandler = (): StatHandler => {
    const [isLoading, setIsLoading] = useState(true);
    const [todayTasks, setTodayTasks] = useState<repo.TodayTask[]>([]);

    const getTodayTasks = () => {
        setIsLoading(true);
        GetTodayTasks()
            .then((tasks) => {
                console.log("Today tasks:", tasks);
                if(tasks){
                    setTodayTasks(tasks);
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
        getTodayTasks();
    }, []);

    return { isLoading, getTodayTasks, todayTasks }
}