import React, { useState, useEffect } from 'react'
import { dummyResumeData } from '../assets/assets'
import { Link, useParams } from 'react-router-dom'
import { Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkle, Sparkles, User } from 'lucide-react'
import PersonalInfo from '../components/PersonalInfo'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummary from '../components/ProfessionalSummary'
import ExperienceForm from '../components/ExperienceForm'
import { EducationForm } from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'

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
    { id: "project", name: "Projects", icon: FolderIcon},
    { id: "skills", name: "Skills", icon: Sparkles},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [resumeID])


  const changeResumeVisibility = async () => {
    setResumeData({...resumeData, public: !resumeData.public})
  }

  const handleShare = () =>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeID;

    if(navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume", })
    }else{
      alert('Shared not supported on this browser.')
    }
  }

  const downloadResume = ()=>{
    window.print();
  }

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
          <div className='relative lg:col-span-5 rounded-lg  overflow-visible'>
            <div className='bg-white rounded-lg shadow-sm border-gray-200 p-6 pt-1'>
              {/*progress bar */}
                <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
                  <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-violet-400 to-violet-600 border-none transition-all duration-2000" 
                  style={{width: `${activeSectionIndex * 100/(sections.length-1)}%`}}/>

          
                  {/*section nav*/}
                  <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                    <div className='flex items-center gap-2'>
                      <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=> setResumeData(prev => ({...prev, template}))}/>

                       <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=> setResumeData(prev => ({...prev, accent_color: color}))}/>
                    </div>
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

                      {activeSection.id === 'summary' && (
                      <ProfessionalSummary data={resumeData.professional_summary} 
                      onChange={(data)=> setResumeData(prev=> ({...prev, professional_summary: data}))} setResumeData={setResumeData}/>
                    )}

                    {activeSection.id === 'experience' && (
                      <ExperienceForm data={resumeData.experience} 
                      onChange={(data)=> setResumeData(prev=> ({...prev, experience: data}))} setResumeData={setResumeData}/>
                    )}

                    {activeSection.id === 'education' && (
                      <EducationForm data={resumeData.education} 
                      onChange={(data)=> setResumeData(prev=> ({...prev, education: data}))} setResumeData={setResumeData}/>
                    )}

                    {activeSection.id === 'project' && (
                      <ProjectForm data={resumeData.project} 
                      onChange={(data)=> setResumeData(prev=> ({...prev, project: data}))} setResumeData={setResumeData}/>
                    )}

                    {activeSection.id === 'skills' && (
                      <SkillsForm data={resumeData.skills} 
                      onChange={(data)=> setResumeData(prev=> ({...prev, skills: data}))} setResumeData={setResumeData}/>
                    )}

                  </div>
                  <button className='bg-gradient-to-br from-violet-100 to-violet-200 ring-violet-300 text-violet-600 hovrt:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                    Save Changes
                  </button>
            </div>
          </div>  
          {/* preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public &&(
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4'/> Share
                  </button>
                )}
                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'>
                    {resumeData.public ? <EyeIcon className='size-4' /> :
                    <EyeOffIcon className='size-4' />
                    }
                    {resumeData.public ? 'Public' : 'Private'}
                  </button>
                  <button onClick={downloadResume} className='flex items-center p-2 px-6 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                    <DownloadIcon className='size-4' /> Download
                  </button>
              </div>
                      
            </div>
                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
      </div>
      </div>
   </div> 
  )
}

export default ResumeBuilder