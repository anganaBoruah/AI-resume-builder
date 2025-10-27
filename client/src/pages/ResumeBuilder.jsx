import React, { useState, useEffect } from 'react'
import { dummyResumeData } from '../assets/assets'
import { Link, useParams } from 'react-router-dom'
import { Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkle, Sparkles, User } from 'lucide-react'
import PersonalInfo from '../components/PersonalInfo'
import ResumePreview from '../components/ResumePreview'

const ResumeBuilder = () => {
  const { resumeID } = useParams()

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

  const loadExistingResume = async () => {
    if (!resumeID) return
    const resume = dummyResumeData.find(r => String(r._id) === String(resumeID))
    if (resume) {
      setResumeData(resume)
      document.title = resume.title || 'Resume Builder'
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User},
    { id: "summary", name: "Summary", icon: FileText},
    { id: "experience", name: "Experience", icon: Briefcase},
    { id: "education", name: "Education", icon: GraduationCap},
    { id: "projects", name: "Projects", icon: FolderIcon},
    { id: "skills", name: "Skills", icon: Sparkles},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [resumeID])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6 '>
        <div className="inline-flex gap-2 items-center text-sm font-medium text-slate-500">
          <Link to={'/'} >
            <button type="button" aria-label="Home" className='text-slate-500 hover:text-violet-600 transition-all'>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z" fill="#7555c1ff" stroke="#475569" strokeWidth=".094"/>
              </svg>
            </button>
          </Link>
            
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
              </svg>
            
          <Link to={'/app'} className='text-slate-500 hover:text-violet-600 transition-all'>
            Dashboard
          </Link>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
              </svg>
            Resume Builder
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* form */}
          <div className='relative lg:col-span-5 rounded-lg  overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border-gray-200 p-6 pt-1'>
              {/*progress bar */}
                <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
                  <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-violet-400 to-violet-600 border-none transition-all duration-2000" 
                  style={{width: `${activeSectionIndex * 100/(sections.length-1)}%`}}/>

          
                  {/*section nav*/}
                  <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                    <div></div>
                    <div className='flex items-center'>
                      {activeSectionIndex !== 0 && (
                        <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(prevIndex -1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 transition-all ' disabled={activeSectionIndex === 0}>
                          <ChevronLeft className='w-4 h-4'/> previous
                        </button>
                      )}

                      <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length-1 ? 'opacity-50': ''}`} disabled={activeSectionIndex === sections.length-1}>
                        next <ChevronRight className='w-4 h-4'/> 
                        </button>
                    </div>
                  </div>

                  {/*form content*/}
                  <div className='space-y-6'>
                      {activeSection.id === 'personal' &&(
                        <PersonalInfo data={resumeData.personal_info} 
                        onChange={(data)=>setResumeData(prev=> ({...prev,personal_info:data}))} 
                        removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                      )}

                  </div>
            </div>
          </div>  
          {/* preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div>
                      buttons
            </div>
                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
      </div>
      </div>
   </div> 
  )
}

export default ResumeBuilder