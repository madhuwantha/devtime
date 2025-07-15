import { Project } from "../types/entity";
import { useFetch } from "./userFetch";
import { API_URL } from "../const/variables";

export const useProjectList = () => {
 const { data, loading, error } =  useFetch<Project[]>(`${API_URL}/projects/users/${'6873e2fb6ebc409486ceb87c'}`)
 return {
   data,
   loading,
   error   
 };
}