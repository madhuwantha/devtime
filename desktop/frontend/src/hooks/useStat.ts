import { useEffect, useState } from "react";
import { repo } from "../../wailsjs/go/models";
import { GetTodayTasks } from "../../wailsjs/go/main/App";


export type StatHandler = {
    isLoading: boolean;
    getTodayTasks: (date: Date) => void;
    todayTasks: repo.TodayTask[];
    onDateChange: (date: Date) => void;
    summary: {
        totalTime: number,
        taskSummary: Map<string, number>,
        projectSummary: Map<string, number>
    }
}

export const useStatHandler = (): StatHandler => {
    const [isLoading, setIsLoading] = useState(true);
    const [todayTasks, setTodayTasks] = useState<repo.TodayTask[]>([]);
    const [summary, setSummary] = useState<{ 
        totalTime: number, 
        taskSummary: Map<string, number>, 
        projectSummary: Map<string, number>
    }>
    ({ totalTime: 0, taskSummary: new Map(), projectSummary: new Map() });



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

    useEffect(() => {
        calculateSummary();
    }, [todayTasks]);


    const onDateChange = (date: Date) => {        
        getTodayTasks(date);
    }

    const calculateSummary = ()  => {
        const totalTime = todayTasks.reduce((acc, task) => {
            const startDate = task.StartTime ? new Date(String(task.StartTime)) : null;
            const endDate = task.EndTime ? new Date(String(task.EndTime)) : null;
            if (startDate && endDate) {
                return acc + (endDate.getTime() - startDate.getTime());
            }
            return acc;
        }, 0);
        
        const taskMap: Map<string, number> = new Map();
        todayTasks.forEach((task) => {
            const taskName = !task.IsIdle ? task.TaskName + " - " + task.ProjectName : "Idle";
            const startTime = task.StartTime ? new Date(String(task.StartTime)) : null;
            const endTime = task.EndTime ? new Date(String(task.EndTime)) : null;
            if (startTime && endTime) {
                const duration = endTime.getTime() - startTime.getTime();
                taskMap.set(taskName, (taskMap.get(taskName) || 0) + duration);
            }
        });

        const projectMap: Map<string, number> = new Map();
        todayTasks.forEach((task) => {
            if(!task.IsIdle){
                const projectName = task.ProjectName;
                const startTime = task.StartTime ? new Date(String(task.StartTime)) : null;
                const endTime = task.EndTime ? new Date(String(task.EndTime)) : null;
                if (startTime && endTime) {
                    const duration = endTime.getTime() - startTime.getTime();
                    projectMap.set(projectName, (projectMap.get(projectName) || 0) + duration);
                }
            }

        });

        const summary: { totalTime: number, taskSummary: Map<string, number>, projectSummary: Map<string, number> } = {
            totalTime,
            taskSummary: taskMap,
            projectSummary: projectMap
        }
        setSummary(() => summary);        
    }

    return { isLoading, getTodayTasks, todayTasks, onDateChange, summary }
}