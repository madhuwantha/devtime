import { useEffect, useState } from "react";
import { CreateProject, GetProjects } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";




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
      fetchProjects(); // Refresh the projects list
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
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25">
          Create Project
        </button>
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
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          New Project
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {data.map((project) => (
          <div
            key={project.ProjectId}
            className={`
              group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
              ${expandedId === project.ProjectId 
                ? 'ring-2 ring-cyan-400/50 bg-white/10 shadow-lg shadow-cyan-500/20' 
                : 'hover:bg-white/10 hover:border-white/20 hover:shadow-lg'
              }
            `}
            onClick={() =>
              setExpandedId(expandedId === project.ProjectId ? null : project.ProjectId)
            }
          >
            {/* Project Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                    ${expandedId === project.ProjectId
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 group-hover:from-slate-500 group-hover:to-slate-600'
                    }
                  `}>
                    {project.Name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`
                      text-xl font-semibold transition-colors duration-300
                      ${expandedId === project.ProjectId ? 'text-cyan-300' : 'text-slate-100'}
                    `}>
                      {project.Name}
                    </h3>
                    <p className="text-slate-400 text-sm">Project ID: {project.ProjectId}</p>
                  </div>
                </div>
                
                {/* Expand/Collapse Indicator */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${expandedId === project.ProjectId 
                    ? 'bg-cyan-500/20 text-cyan-400 rotate-180' 
                    : 'bg-slate-600/50 text-slate-400 group-hover:bg-slate-500/50'
                  }
                `}>
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === project.ProjectId && (
              <div className="border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                <div className="p-6 space-y-4">
                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Project Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Name:</span>
                          <span className="text-slate-200 font-medium">{project.Name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ID:</span>
                          <span className="text-slate-200 font-mono text-sm">{project.ProjectId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Quick Actions</h4>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105">
                          View Tasks
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25">
                      Start Working
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 rounded-xl font-medium hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105">
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Modal Content */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                📁
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">Create New Project</h2>
              <p className="text-slate-400 text-center">Add a new project to track your development work</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-slate-300 text-sm font-medium mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="code" className="block text-slate-300 text-sm font-medium mb-2">
                  Project Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter project code (e.g., DEV, WEB, API)"
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500"
                  required
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !formData.name.trim() || !formData.code.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
