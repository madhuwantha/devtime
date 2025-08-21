import { useEffect, useState } from "react";
import { GetActiveTask, GetTasks } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";


export const useMyTaskList = () => {

  const [activeTask, setActiveTask] = useState<entity.Task | null>(null);
  const [tasks, setTasks] = useState<entity.Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTasks();
  }, [])

  const getTasks = async (projectId?: string) => {
    try{
      await getActiveTask();
    }catch (error) {
      console.error("Error fetching active task:", error);
    }

    
    setLoading(true);
    GetTasks(projectId).then((tasks) => {
      setTasks(tasks);
    }).catch((error) => {
      console.error("Error fetching projects:", error);
    }).finally(() => {
      setLoading(false);
    });
  }

  const getActiveTask = async () => {
    setLoading(true);
    try{
      const task = await GetActiveTask();      
      console.log("Active task fetched:", task);
      if(task && task.TaskId){
        setActiveTask(task);
      }
    }catch (error) {
      console.error("Error fetching active task:", error);
    } finally {
      setLoading(false);
    }
  }


  return { tasks, activeTask, loading, setActiveTask, getTasks };
}