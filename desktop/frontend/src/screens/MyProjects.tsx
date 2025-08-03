import  { useEffect, useState } from "react";
import { useProjectList } from "../hooks/useProjectList";


export default function MyProjects() {
 const [expandedId, setExpandedId] = useState<string | null>(null);

 const { data } = useProjectList();

 useEffect(() => {
  console.log(data);
 }, [data]);

 return (
  <div>
   <ul className="list-none p-0">
    {data?.map((project) => (
     <li
      key={project.id}
      className="relative border border-gray-300 rounded-lg mb-1 pl-3.5 pr-3.5 pb-1 pt-1 cursor-pointer hover:shadow"
      onClick={() =>
       setExpandedId(expandedId === project.id ? null : project.id)
      }
     >
      <div>
       <strong className="text-lg">{project.name}</strong>       
      </div>
      
      {expandedId === project.id && (
       <div className="mt-2 text-gray-700">{project.name}</div>
      )}
     </li>
    ))}
   </ul>
  </div>
 );
}
