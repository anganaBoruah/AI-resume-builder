import React from 'react'
import { Plus, Trash2, GraduationCap } from "lucide-react"; 

export const EducationForm = ({ data, onChange}) => {

    const addEducation =() =>{
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            cgpa: "",
        };
        onChange([...data, newEducation])
    }

    const removeEducation = (index) =>{
        const updated = data.filter((_, i)=> i !== index);
        onChange(updated)
    }
    
    const updateEducation = (index, field, value) =>{
        const updated = [...data];
        updated[index] = {...updated[index], [field]: value}
        onChange(updated)
    }
  return (
            <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-seminbold text-gray-900'>
                    Education
                </h3>
                <p className='text-sm text-gray-500'>
                    Add your Education details
                </p>
            </div>
            <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors '>
              <Plus className='size-4' />
              Add Education
            </button>
        </div>

        {data.length === 0 ?(
            <div className='text-center py-8 text-gray-500'>
                <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300'/>
                <p>No Education added yet.</p>
                <p className='text-sm'>Click "Add Education" to get started.</p>
            </div>
        ): (
            <div className='space-y-4'>
                {data.map((education, index)=>(
                    <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                        <div className='flex justify-between items-start'>
                            <h4>
                                Education #{index + 1}
                            </h4>
                            <button onClick={()=> removeEducation(index)}
                                className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4'/>
                            </button>
                        </div>

                        <div className='flex flex-col gap-3 w-full'>
                            
                                                    
                                 {/* fields layout */}
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {/* Company */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Institution name</label>
                                    <input
                                    value={education.institution || ""}
                                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                    type="text"
                                    placeholder="institution name"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Degree</label>
                                    <input
                                    value={education.degree || ""}
                                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                    type="text"
                                    placeholder="e.g. BTech"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Field</label>
                                    <input
                                    value={education.field || ""}
                                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                                    type="text"
                                    placeholder="field of study"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">CGPA</label>
                                    <input
                                    value={education.cgpa || ""}
                                    onChange={(e) => updateEducation(index, "cgpa", e.target.value)}
                                    type="text"
                                    placeholder=""
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />
                                </div>


                                {/* Start date */}
                                <div className="flex flex-wrap gap-4 w-full">

                                {/* End date + Current below */}
                                <div className="flex-1 min-w-[150px] flex flex-col">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Graduation Date</label>
                                    <input
                                    value={education.graduation_date || ""}
                                    onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                                    type="month"
                                    disabled={Boolean(education.is_current)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500"
                                    />

                                    <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(education.is_current)}
                                        onChange={(e) => updateEducation(index, "is_current", e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span>Currently Studying here</span>
                                    </label>
                                </div>
                                </div>



                                </div>

                            </div>

                        


                    </div>
                ))}
            </div>        
        )}
    </div>
  )
}
