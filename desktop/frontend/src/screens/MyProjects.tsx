import { useEffect, useState } from "react";
import { GetProjects } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";


export default function MyProjects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [data, setData] = useState<entity.Project[]>([]);

  useEffect(() => {
    GetProjects().then((projects) => {
      console.log("Projects fetched:", projects);
      setData(projects);
    }).catch((error) => {
      console.error("Error fetching projects:", error);
    });
  }, []);

  return (
    <div>
      <ul className="list-none p-0">
        {data?.map((project) => (
          <li
            key={project.ProjectId}
            className="relative border border-gray-300 rounded-lg mb-1 pl-3.5 pr-3.5 pb-1 pt-1 cursor-pointer hover:shadow"
            onClick={() =>
              setExpandedId(expandedId === project.ProjectId ? null : project.ProjectId)
            }
          >
            <div>
              <strong className="text-lg">{project.Name}</strong>
            </div>

            {expandedId === project.ProjectId && (
              <div className="mt-2 text-gray-700">{project.Name}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
