import { Briefcase, Plus, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'

const ExperienceForm = ({ data, onChange}) => {

    const addExperience =() =>{
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        };
        onChange([...data, newExperience])
    }

    const removeExperience = (index) =>{
        const updated = data.filter((_, i)=> i !== index);
        onChange(updated)
    }
    
    const updateExperience = (index, field, value) =>{
        const updated = [...data];
        updated[index] = {...updated[index], [field]: value}
        onChange(updated)
    }

  return (
        <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-seminbold text-gray-900'>
                    Professional Experience
                </h3>
                <p className='text-sm text-gray-500'>
                    Add your job experience
                </p>
            </div>
            <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors '>
              <Plus className='size-4' />
              Add Experience
            </button>
        </div>

        {data.length === 0 ?(
            <div className='text-center py-8 text-gray-500'>
                <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300'/>
                <p>No work experience added yet.</p>
                <p className='text-sm'>Click "Add Experience" to get started.</p>
            </div>
        ): (
            <div className='space-y-4'>
                {data.map((experience, index)=>(
                    <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                        <div className='flex justify-between items-start'>
                            <h4>
                                Experience #{index + 1}
                            </h4>
                            <button onClick={()=> removeExperience(index)}
                                className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4'/>
                            </button>
                        </div>

                        <div className='flex flex-col gap-3 w-full'>
                            
                                                    
                                 {/* fields layout */}
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {/* Company */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                                    <input
                                    value={experience.company || ""}
                                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                                    type="text"
                                    placeholder="Company name"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Job title</label>
                                    <input
                                    value={experience.position || ""}
                                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                                    type="text"
                                    placeholder="e.g. Frontend Developer"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>

                                {/* Start date */}
                                <div className="flex flex-wrap gap-4 w-full">
                                {/* Start date */}
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
                                    <input
                                    value={experience.start_date || ""}
                                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                                    type="month"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>

                                {/* End date + Current below */}
                                <div className="flex-1 min-w-[150px] flex flex-col">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
                                    <input
                                    value={experience.end_date || ""}
                                    onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                                    type="month"
                                    disabled={Boolean(experience.is_current)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />

                                    <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(experience.is_current)}
                                        onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span>Currently working here</span>
                                    </label>
                                </div>
                                </div>



                                </div>

                            </div>

                        

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-medium text-gray-700'>
                                    Job Description
                                </label>
                                <button className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                    <Sparkles className='w-3 h-3' />
                                    Enhance with AI
                                </button>
                            </div>

                            <textarea value={experience.description || ""} 
                                onChange={(e)=> updateExperience(index, "description", e.target.value)} rows={4}
                                className='w-full text-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm resize-none' placeholder='Describe your key responsibilites and achievements...'/>

                        </div>
                    </div>
                ))}
            </div>        
        )}
    </div>
  )
}

export default ExperienceForm