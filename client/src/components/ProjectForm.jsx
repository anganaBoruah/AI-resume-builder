import React, { useState } from 'react'
import { Plus, Sparkles, Trash2, GraduationCap } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ProjectForm = ({ data = [], onChange = () => {} }) => {
  const { token } = useSelector(state => state.auth)
  const [loadingIndex, setLoadingIndex] = useState(null)

  const addProject = () => {
    const newProject = { name: '', type: '', description: '' }
    onChange([...(Array.isArray(data) ? data : []), newProject])
  }

  const removeProject = index => {
    if (!Array.isArray(data)) return
    onChange(data.filter((_, i) => i !== index))
  }

  const updateProject = (index, field, value) => {
    if (!Array.isArray(data)) return
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleAiEnhanceProject = async index => {
    if (!Array.isArray(data)) return
    const project = data[index]
    const description = project?.description || ''

    if (!description.trim()) return

    try {
      setLoadingIndex(index)
      toast.loading('Enhancing project description...', {
        id: `proj-${index}`,
      })

      // reuse the same endpoint as job descriptions
      const { data: res } = await api.post(
        '/api/ai/enhance-job-desc',
        { userContent: description },
        { headers: { Authorization: token } }
      )

      const enhanced = res?.enhancedContent || description
      updateProject(index, 'description', enhanced)

      toast.success('Project description enhanced!', {
        id: `proj-${index}`,
      })
    } catch (error) {
      console.error('AI project enhance error:', error)
      toast.error('Failed to enhance project description', {
        id: `proj-${index}`,
      })
    } finally {
      setLoadingIndex(null)
    }
  }

  const list = Array.isArray(data) ? data : []

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Projects
          </h3>
          <p className='text-sm text-gray-500'>Add your Projects</p>
        </div>

        <button
          type='button'
          onClick={addProject}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Add Project
        </button>
      </div>

      <div style={{ border: '1px dashed rgba(0,0,0,0.06)', padding: 8 }}>
        {list.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300' />
            <p className='font-medium'>No projects added yet</p>
            <p className='text-sm'>Click “Add Project” to create one.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {list.map((project, index) => (
              <div
                key={index}
                className='p-4 border border-gray-200 rounded-lg space-y-3'
              >
                <div className='flex justify-between items-start'>
                  <h4>Project #{index + 1}</h4>
                  <button
                    type='button'
                    onClick={() => removeProject(index)}
                    className='text-red-500 hover:text-red-700 transition-colors'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>

                <div className='flex flex-col gap-3 w-full'>
                  <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Name
                      </label>
                      <input
                        value={project?.name ?? ''}
                        onChange={e =>
                          updateProject(index, 'name', e.target.value)
                        }
                        type='text'
                        placeholder='e.g. Portfolio Website'
                        className='w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Type
                      </label>
                      <input
                        value={project?.type ?? ''}
                        onChange={e =>
                          updateProject(index, 'type', e.target.value)
                        }
                        type='text'
                        placeholder='type of project'
                        className='w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          Project Description
                        </label>
                        <button
                          type='button'
                          onClick={() => handleAiEnhanceProject(index)}
                          disabled={
                            !project?.description?.trim() ||
                            loadingIndex === index
                          }
                          className='  flex items-center gap-2 px-3 py-1.5 text-xs font-medium
  rounded-md
  bg-indigo-500/10
  text-indigo-700
  border border-indigo-200
  hover:bg-indigo-500/20
  hover:border-indigo-300
  transition-all'
                        >
                          <Sparkles className='w-3 h-3' />
                          {loadingIndex === index
                            ? 'Enhancing...'
                            : 'Enhance with AI'}
                        </button>
                      </div>

                      <textarea
                        value={project?.description ?? ''}
                        onChange={e =>
                          updateProject(index, 'description', e.target.value)
                        }
                        rows={4}
                        className='w-full text-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm resize-none'
                        placeholder='Describe your key responsibilities and achievements...' //
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
  )
}

export default ProjectForm
