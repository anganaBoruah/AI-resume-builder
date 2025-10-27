import React, { useEffect, useState } from 'react'
import {FilePenLineIcon, PencilIcon, PlusCircleIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon} from 'lucide-react'
import {dummyResumeData} from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]  
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')

    const navigate = useNavigate()

    const loadAllResumes = async () =>{
      setAllResumes(dummyResumeData)
    }

    const createResume = async (event) =>{
      event.preventDefault()
      setShowCreateResume(false)
      navigate(`builder/res123`)
    }

    const uploadResume = async (event) => {
      event.preventDefault()
      setShowUploadResume(false)
      navigate(`builder/res123`)
    }

    const editTitle =async(event)=> {
      event.preventDefault()
    }

    const deleteResume =async(resumeID)=> {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if(confirm){
        setAllResumes(prev=> prev.filter(resume => resume._id !== resumeID))
      }
    }

    useEffect(()=>{
      loadAllResumes()
    },[])
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-white via-violet-50 to-violet-10'>
        <div className='max-w-7xl mx-auto px-4 py-8 '>
          <p className= 'text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'> Welcome, John Doe</p>
          
          <div className='flex gap-4'>
              <button onClick={()=> setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-violet-600 hover:shadow-lg shadow-[0_0_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300 cursor-pointer'>
                <PlusCircleIcon className= 'size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full' />
                <p className= 'text-sm group-hover:text-violet-600 transition-all duration-300'>Create Resume</p>
              </button>
              <button onClick={()=> setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-violet-600 hover:shadow-lg shadow-[0_0_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300 cursor-pointer'>
                <UploadCloudIcon className= 'size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-violet-400 to-violet-600 text-white rounded-full' />
                <p className= 'text-sm group-hover:text-violet-600 transition-all duration-300'>Create Resume</p>
              </button>
          </div> 

          <hr className= 'border-slate-300 my-6 sm:w-[305px]'/>         
        
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume,index)=>{
            const baseColor = colors[index % colors.length];
            return(
              <button key={index} onClick={()=> navigate(`builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group border-dashed hover:shadow-lg shadow-[0_0_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer' 
                  style= {{background: `linear-gradient(80deg, ${baseColor}10, ${baseColor}30)`, borderColor: baseColor + '40'}}>
                  <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" style={{color: baseColor}}/>
                  <p className='text-sm group-hover:scale-105 transition-all px-2 text-center' style={{color: baseColor}}>{resume.title}</p>
                  <p className= 'absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{ color: baseColor + '90'}}>
                    Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div onClick={e=> e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                      <TrashIcon onClick={()=>deleteResume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
                      <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
                  </div>
                  </button>
            )
          })}
          </div>
          
          {showCreateResume && (
            <div onClick={()=> setShowCreateResume(false)} 
              className='fixed inset-0 bg-black/50 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                
                <form  onSubmit={createResume} onClick={e => e.stopPropagation()}  className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow-[0px_0px_10px_0px] shadow-black/20">
                <h2 className='text-2xl font-semibold mb-6 text-center text-gray-700'>Create Resume</h2>
                <input type="text" placeholder='Enter Resume Title' value={title} onChange={e => setTitle(e.target.value)} className='w-full border mt-1 border-gray-500/30 focus:border-violet-600 outline-none rounded py-2.5 px-4' required />
                
                <button type="submit" className='w-full my-3 bg-violet-700 hover:bg-violet-600 active:scale-95 transition py-2.5 rounded text-white'>Create Resume</button>
                <XIcon className='absolute top-4 right-4 text-slate-200 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowCreateResume(false); setTitle('')}}/>
                </form>
                </div>
              
          )}

          {showUploadResume && (
            <div onClick={()=> setShowUploadResume(false)} 
              className='fixed inset-0 bg-black/50 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                
                <form  onSubmit={uploadResume} onClick={e => e.stopPropagation()}  className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow-[0px_0px_10px_0px] shadow-black/20">
                <h2 className='text-2xl font-semibold mb-6 text-center text-gray-700'>Upload Resume</h2>
                <input type="text" placeholder='Enter Resume Title' value={title} onChange={e => setTitle(e.target.value)} className='w-full border mt-1 border-gray-500/30 focus:border-violet-600 outline-none rounded py-2.5 px-4' required />
                  <div>
                    <label htmlFor='resume-input' className='block text-sm text-slate-600'>
                      Select Resume File 
                      <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-30 py-10 my-4 hover:border-violet-500 hover:text-violet-600 cursor-pointer transition-colors'>
                          {resume ?(
                            <p className='text-violet-700'>{resume.name}</p>
                           ) :(
                            <>
                              
                                <UploadCloud className="size-14 stroke-1" />
                                <p className="text-sm text-gray-500">Upload resume</p>
                              
                              
                            </>
                           )
                          }
                      </div>
                    </label>
                    <input type='file' id='resume-input' accept='pdf' hidden onChange={(e)=> setResume(e.target.files[0])}/>
                  </div>
                <button type="submit" className='w-full my-3 bg-violet-700 hover:bg-violet-600 active:scale-95 transition py-2.5 rounded text-white'>Upload Resume</button>
                <XIcon className='absolute top-4 right-4 text-slate-200 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowUploadResume(false); setTitle('')}}/>
                </form>
                </div>
              
          )}
          
          {editResumeId && (
            <div onClick={()=> setEditResumeId('')} 
              className='fixed inset-0 bg-black/50 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                
                <form  onSubmit={editTitle} onClick={e => e.stopPropagation()}  className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow-[0px_0px_10px_0px] shadow-black/20">
                <h2 className='text-2xl font-semibold mb-6 text-center text-gray-700'>Edit Resume Title</h2>
                <input type="text" placeholder='Enter Resume Title' value={title} onChange={e => setTitle(e.target.value)} className='w-full border mt-1 border-gray-500/30 focus:border-violet-600 outline-none rounded py-2.5 px-4' required />
                
                <button type="submit" className='w-full my-3 bg-violet-700 hover:bg-violet-600 active:scale-95 transition py-2.5 rounded text-white'>Update</button>
                <XIcon className='absolute top-4 right-4 text-slate-200 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setEditResumeId(''); setTitle('')}}/>
                </form>
                </div>
              
          )}
        </div>
    </div>
  )
}

export default Dashboard