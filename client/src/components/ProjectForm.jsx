import React from "react";
import { Plus, Sparkles, Trash2, GraduationCap } from "lucide-react";

const ProjectForm = ({ data = [], onChange = () => {} }) => {
  // DEBUG: see what parent passes
  console.log("ProjectForm data (debug) =>", data);

  const addProject = () => {
    const newProject = { name: "", type: "", description: "" };
    onChange([...(Array.isArray(data) ? data : []), newProject]);
  };

  const removeProject = (index) => {
    if (!Array.isArray(data)) return;
    onChange(data.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    if (!Array.isArray(data)) return;
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const list = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your Projects</p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* DEBUG VISUAL HELP: temporary border + bg so it's obvious */}
      <div style={{ border: "1px dashed rgba(0,0,0,0.06)", padding: 8 }}>

        {list.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {/* placeholder so you can visually confirm */}
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No projects added yet</p>
            <p className="text-sm">Click “Add Project” to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((project, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4>Project #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        value={project?.name ?? ""}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                        type="text"
                        placeholder="e.g. Portfolio Website"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <input
                        value={project?.type ?? ""}
                        onChange={(e) => updateProject(index, "type", e.target.value)}
                        type="text"
                        placeholder="type of project"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Project Description</label>
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
                          <Sparkles className="w-3 h-3" />
                          Enhance with AI
                        </button>
                      </div>

                      <textarea
                        value={project?.description ?? ""}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                        rows={4}
                        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm resize-none"
                        placeholder="Describe your key responsibilities and achievements..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
