import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  Share2Icon,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import api from '../configs/api'
import UpgradeModal from '../components/UpgradeModal'
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
  const { user, token } = useSelector(state => state.auth)

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
  const [mobileView, setMobileView] = useState('edit')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const isPremium =
    (user?.plan === 'monthly' || user?.plan === 'yearly') &&
    user?.subscriptionStatus === 'active'

  const sections = [
    { id: 'personal',   name: 'Personal Info' },
    { id: 'summary',    name: 'Summary' },
    { id: 'experience', name: 'Experience' },
    { id: 'education',  name: 'Education' },
    { id: 'project',    name: 'Projects' },
    { id: 'skills',     name: 'Skills' },
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
      if (typeof resumeData.personal_info.image === 'object') delete payload.personal_info.image

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(payload))
      if (typeof resumeData.personal_info.image === 'object')
        formData.append('image', resumeData.personal_info.image)

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token },
      })
      setResumeData(data.resume)
      toast.success(newPublic ? 'Resume is now public' : 'Resume is now private')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update visibility')
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeID
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      navigator.clipboard.writeText(resumeUrl)
      toast.success('Link copied to clipboard')
    }
  }

  const downloadResume = () => {
    if (!isPremium) {
      setShowUpgradeModal(true)
      return
    }
    window.print()
  }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)
      if (typeof resumeData.personal_info.image === 'object')
        delete updatedResumeData.personal_info.image

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append('removeBackground', 'yes')
      if (typeof resumeData.personal_info.image === 'object')
        formData.append('image', resumeData.personal_info.image)

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
    <div className="h-[calc(100vh-56px)] flex flex-col overflow-hidden">

      {/* ── Two-panel layout ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar ── */}
        <aside className={`shrink-0 flex-col bg-white border-r border-slate-200 shadow-[2px_0_16px_-4px_rgba(0,0,0,0.1)] print:hidden w-full lg:w-[400px] ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}>

          {/* Section stepper nav */}
          <div className="shrink-0 px-5 pt-4 pb-3 border-b border-slate-100">
            {/* Step circles + connectors */}
            <div className="flex items-center mb-3">
              {sections.map((section, i) => (
                <React.Fragment key={section.id}>
                  <button
                    onClick={() => setActiveSectionIndex(i)}
                    title={section.name}
                    className={`shrink-0 size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                      i < activeSectionIndex
                        ? 'bg-violet-500 text-white'
                        : i === activeSectionIndex
                        ? 'bg-violet-600 text-white shadow-[0_0_0_4px_rgba(124,58,237,0.14)]'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {i < activeSectionIndex ? <Check size={10} /> : i + 1}
                  </button>
                  {i < sections.length - 1 && (
                    <div className={`flex-1 h-px transition-colors duration-300 ${i < activeSectionIndex ? 'bg-violet-300' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Active section label + prev/next arrows */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSectionIndex(prev => Math.max(0, prev - 1))}
                disabled={activeSectionIndex === 0}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <p className="text-sm font-semibold text-slate-800">{activeSection.name}</p>
              <button
                onClick={() => setActiveSectionIndex(prev => Math.min(sections.length - 1, prev + 1))}
                disabled={activeSectionIndex === sections.length - 1}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            {/* Mobile-only: preview toggle */}
            <button
              onClick={() => setMobileView('preview')}
              className="lg:hidden mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <EyeIcon size={12} /> Preview Resume
            </button>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {activeSection.id === 'personal' && (
              <PersonalInfo
                data={resumeData.personal_info}
                onChange={data => setResumeData(prev => ({ ...prev, personal_info: data }))}
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
              />
            )}
            {activeSection.id === 'summary' && (
              <ProfessionalSummary
                data={resumeData.professional_summary}
                onChange={data => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                setResumeData={setResumeData}
              />
            )}
            {activeSection.id === 'experience' && (
              <ExperienceForm
                data={resumeData.experience}
                onChange={data => setResumeData(prev => ({ ...prev, experience: data }))}
              />
            )}
            {activeSection.id === 'education' && (
              <EducationForm
                data={resumeData.education}
                onChange={data => setResumeData(prev => ({ ...prev, education: data }))}
              />
            )}
            {activeSection.id === 'project' && (
              <ProjectForm
                data={resumeData.project}
                onChange={data => setResumeData(prev => ({ ...prev, project: data }))}
              />
            )}
            {activeSection.id === 'skills' && (
              <SkillsForm
                data={resumeData.skills}
                onChange={data => setResumeData(prev => ({ ...prev, skills: data }))}
              />
            )}
          </div>

          {/* Sticky save */}
          <div className="shrink-0 px-5 pb-4 pt-3 border-t border-slate-100 bg-white/90 backdrop-blur-sm">
            <button
              onClick={() =>
                toast.promise(saveResume(), {
                  loading: 'Saving…',
                  success: msg => msg || 'Saved!',
                  error: err => err?.message || 'Could not save',
                })
              }
              className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white rounded-xl py-2 text-sm font-semibold tracking-tight transition-all shadow-sm shadow-violet-500/25"
            >
              Save Changes
            </button>
          </div>
        </aside>

        {/* ── Canvas panel ── */}
        <div className={`flex-1 flex-col min-h-0 bg-slate-100 print:bg-transparent print:block ${mobileView === 'edit' ? 'hidden lg:flex' : 'flex'}`}>

          {/* Canvas toolbar — Template + Accent + actions */}
          <div className="shrink-0 flex items-center gap-2 px-4 lg:px-6 py-2.5 bg-slate-100 border-b border-slate-200/60 print:hidden">
            {/* Mobile: back to edit */}
            <button
              onClick={() => setMobileView('edit')}
              className="lg:hidden shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={13} /> Edit
            </button>

            <TemplateSelector
              selectedTemplate={resumeData.template}
              onChange={template => setResumeData(prev => ({ ...prev, template }))}
            />
            <ColorPicker
              selectedColor={resumeData.accent_color}
              onChange={color => setResumeData(prev => ({ ...prev, accent_color: color }))}
            />

            {/* Actions — pushed right */}
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-lg divide-x divide-slate-200 overflow-hidden text-xs bg-white">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Share2Icon size={12} /> Share
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {resumeData.public ? <EyeIcon size={12} /> : <EyeOffIcon size={12} />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
              </div>
              <button
                onClick={downloadResume}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 hover:-translate-y-0.5 rounded-lg transition-all shadow-sm shadow-violet-500/20"
                title={isPremium ? 'Download Resume' : 'Upgrade to download'}
              >
                <DownloadIcon size={13} />
                {isPremium ? 'Download' : '🔒 Download'}
              </button>
            </div>
          </div>

          {/* Scrollable canvas */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent print:overflow-visible">
          <div className="min-h-full flex justify-center px-3 sm:px-5 pt-5 pb-10 print:p-0">
            <div className="w-full max-w-198.5 self-start">
              <div className="shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_12px_40px_-4px_rgba(0,0,0,0.12)] border border-[#E5E7EB] rounded-sm overflow-hidden">
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
          </div>
          </div>

        </div>

      </div>

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} feature="Resume Downloads" />
      )}
    </div>
  )
}

export default ResumeBuilder
