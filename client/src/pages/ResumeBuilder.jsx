import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import api from '../configs/api'
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
  const resumeId = resumeID
  const { token } = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'project', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, {
        headers: { Authorization: token },
      })
      if (data.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (resumeId) loadExistingResume()
  }, [resumeID])

  const changeResumeVisibility = async () => {
    try {
      const newPublic = !resumeData.public
      const updatedResumeData = { ...resumeData, public: newPublic }

      setResumeData(updatedResumeData)

      let payload = structuredClone(updatedResumeData)
      if (typeof resumeData.personal_info.image === 'object') {
        delete payload.personal_info.image
      }

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(payload))
      if (typeof resumeData.personal_info.image === 'object') {
        formData.append('image', resumeData.personal_info.image)
      }

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token },
      })

      setResumeData(data.resume)

      toast.success(newPublic ? 'resume is now public' : 'resume is now private')
    } catch (error) {
      console.error('Error updating visibility:', error?.response?.data || error)
      toast.error(
        error?.response?.data?.message || 'Failed to update visibility'
      )
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeID

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = () => {
    window.print()
  }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)

      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append('removeBackground', 'yes')

      if (typeof resumeData.personal_info.image === 'object') {
        formData.append('image', resumeData.personal_info.image)
      }

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token },
      })

      setResumeData(data.resume)
      return data.message || 'Saved successfully'
    } catch (error) {
      console.error('Error saving resume:', error)
      throw error
    }
  }

  return (
    <div>
      {/* breadcrumbs */}
      <div className='max-w-7xl mx-auto px-4 py-6 '>
        <div className='inline-flex gap-2 items-center text-sm font-medium text-slate-500'>
          <Link to={'/'}>
            <button
              type='button'
              aria-label='Home'
              className='text-slate-500 hover:text-violet-600 transition-all'
            >
              <svg
                width='32'
                height='32'
                viewBox='0 0 32 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z'
                  fill='#7555c1ff'
                  stroke='#475569'
                  strokeWidth='.094'
                />
              </svg>
            </button>
          </Link>

          <svg width='14' height='14' viewBox='0 0 20 20'>
            <path d='m14.4 10.7-6.25 6.25a.94.94 0 1 1-1.33-1.33L12.4 10 6.8 4.4a.94.94 0 1 1 1.33-1.33l6.25 6.25a.94.94 0 0 1 .02 1.36' fill='#CBD5E1' />
          </svg>

          <Link to={'/app'} className='text-slate-500 hover:text-violet-600 transition-all'>
            Dashboard
          </Link>
          <svg width='14' height='14' viewBox='0 0 20 20'>
            <path d='m14.4 10.7-6.25 6.25a.94.94 0 1 1-1.33-1.33L12.4 10 6.8 4.4a.94.94 0 1 1 1.33-1.33l6.25 6.25a.94.94 0 0 1 .02 1.36' fill='#CBD5E1' />
          </svg>
          Resume Builder
        </div>
      </div>

      {/* main layout */}
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-visible'>
            <div className='bg-white rounded-lg shadow-sm border-gray-200 p-6 pt-1'>
              {/* progress bar */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr
                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-violet-400 to-violet-600 border-none transition-all duration-1000'
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={template =>
                      setResumeData(prev => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={color =>
                      setResumeData(prev => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(prev => Math.max(prev - 1, 0))
                      }
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 transition-all'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex(prev =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 transition-all'
                  >
                    next
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
              </div>

              {/* section content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfo
                    data={resumeData.personal_info}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === 'summary' && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === 'project' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>

              {/* save */}
              <button
                onClick={() =>
                  toast.promise(saveResume(), {
                    loading: 'Saving...',
                    success: () => 'Saved successfully',
                    error: err => err?.message || 'Could not save',
                  })
                }
                className='mt-4 bg-violet-700 
  text-white 
  text-sm font-medium
  px-6 py-2 
  rounded-md
  shadow-sm
  hover:bg-violet-800
  hover:shadow-md
  active:scale-95
  transition-all'
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Preview + buttons */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'
                  >
                    <Share2Icon className='size-4' />
                    Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className='flex items-center gap-2 px-4 py-1.5 text-xs font-medium
                              rounded-md
                              bg-slate-200 
                              text-slate-700
                              hover:bg-slate-300
                              transition-all active:scale-95
                            '
                >
                  {resumeData.public ? (
                    <EyeIcon className='size-4' />
                  ) : (
                    <EyeOffIcon className='size-4' />
                  )}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>

                <button
                  onClick={downloadResume}
                  className=' flex items-center gap-2 px-6 py-1.5 text-xs font-medium
  rounded-md
 bg-violet-600 text-white hover:bg-violet-700
  transition-all active:scale-95'
                >
                  <DownloadIcon className='size-4' />
                  Download
                </button>
              </div>
            </div>

            {/* ONLY CHANGE ↓↓↓ */}
            <div className="w-full overflow-x-auto flex justify-center">
              <div className="mx-auto scale-[0.8] sm:scale-100 origin-top">
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
            {/* ONLY CHANGE ↑↑↑ */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
