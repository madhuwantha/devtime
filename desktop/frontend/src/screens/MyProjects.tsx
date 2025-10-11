import { useEffect, useState } from "react";
import { GetProjects } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";
import {
  ProjectItem,
  Modal,
  ProjectCreationForm,
  Button
} from "../components";

// Direct call to Go function for CreateProject
const CreateProject = (name: string, code: string): Promise<void> => {
  return (window as any).go.main.App.CreateProject(name, code);
};

export default function MyProjects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [data, setData] = useState<entity.Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = () => {
    setIsLoading(true);
    GetProjects().then((projects) => {
      console.log("Projects fetched:", projects);
      setData(projects);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await CreateProject(formData.name.trim(), formData.code.trim());
      setFormData({ name: "", code: "" });
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mb-4 animate-pulse">
            <span className="text-2xl">📁</span>
          </div>
          <div className="text-slate-400 text-lg">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl mb-4">
          <span className="text-3xl">📂</span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-200 mb-2">No Projects Found</h3>
        <p className="text-slate-400 mb-6">Start by creating your first project</p>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">My Projects</h2>
          <p className="text-slate-400">Manage and track your development projects</p>
        </div>
        <Button
          variant="success"
          onClick={() => setShowCreateModal(true)}
        >
          <span className="text-lg">+</span>
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {data.map((project) => (
          <ProjectItem
            key={project.ProjectId}
            project={project}
            isExpanded={expandedId === project.ProjectId}
            onToggleExpand={() =>
              setExpandedId(expandedId === project.ProjectId ? null : project.ProjectId)
            }
          />
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">{data.length}</div>
            <div className="text-slate-400 text-sm">Total Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">0</div>
            <div className="text-slate-400 text-sm">Active Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-slate-400 text-sm">Completed</div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        icon="📁"
        description="Add a new project to track your development work"
      >
        <ProjectCreationForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateModal(false)}
          isCreating={isCreating}
        />
      </Modal>
    </div>
  );
}