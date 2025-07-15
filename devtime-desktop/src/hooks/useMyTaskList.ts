import { useFetch } from "./userFetch";
import { API_URL } from "../const/variables";
import { Task } from "../types/entity";


export const useMyTaskList = () => {
 const { data, loading, error } =  useFetch<Task[]>(`${API_URL}/tasks/users/${'6873e2fb6ebc409486ceb87c'}`)
 return {
   data,
   loading,
   error   
 };
}