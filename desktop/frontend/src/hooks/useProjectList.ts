import { Project } from "../types/entity";
import { useFetch } from "./userFetch";
import { API_URL } from "../const/variables";

export const useProjectList = () => {
 const { data, loading, error } =  useFetch<Project[]>(`${API_URL}/projects/users/${'6887baccee48cf2c844dee92'}`)
 return {
   data,
   loading,
   error   
 };
}