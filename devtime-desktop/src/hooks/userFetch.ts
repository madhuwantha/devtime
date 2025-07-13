import { useState, useEffect } from "react";

export const useFetch = <T>(url: string, method: string = "GET", body?: any) => {
 const [data, setData] = useState<T | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 useEffect(() => {
  const fetchData = async () => {
   setLoading(true);
   try {
    const response = await fetch(url, {
     method: method,
     headers: {
      "Content-Type": "application/json",
     },
     body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    setData(data);
   } catch (error) {
    setError(error instanceof Error ? error.message : String(error));
   } finally {
    setLoading(false);
   }
  };
  fetchData();
 }, [url]);

 return { data, loading, error };
};