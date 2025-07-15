export type Project = {
  id: string;
  name: string;
 };

export type Task = {
  id: string;
  name: string;
  description: string;
  projectId: string;  
  users: any[];
};

//TODO: Add all the types for the entity