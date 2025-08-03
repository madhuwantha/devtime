import { useFetch } from "./userFetch";
import { API_URL } from "../const/variables";
import { Task } from "../types/entity";


export const useMyTaskList = () => {
 const { data, loading, error } =  useFetch<Task[]>(`${API_URL}/tasks/users/${'6887baccee48cf2c844dee92'}`)
 return {
   data,
   loading,
   error   
 };
}