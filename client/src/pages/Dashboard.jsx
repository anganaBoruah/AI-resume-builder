import React, { useEffect, useState } from 'react'
import { UploadCloud, Plus, Trash2, Pencil, MoreVertical, LoaderCircle, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import pdfToText from 'react-pdftotext'
import toast from 'react-hot-toast'

const ResumeSkeleton = ({ accentColor = '#8b5cf6' }) => (
  <div className="w-full h-full p-5 bg-white flex flex-col gap-1.5">
    <div className="h-[3px] w-full rounded-full mb-3" style={{ backgroundColor: accentColor }} />
    <div className="h-3 w-2/3 bg-slate-200 rounded-md mx-auto" />
    <div className="h-2 w-1/2 bg-slate-100 rounded-md mx-auto mb-3" />
    <div className="h-1.5 w-1/3 rounded-sm mb-2" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
    <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-5/6 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-4/5 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-1/3 rounded-sm mt-2 mb-2" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
    <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-3/4 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-5/6 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-4/5 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-1/3 rounded-sm mt-2 mb-2" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
    <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-5/6 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-2/3 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-1/3 rounded-sm mt-2 mb-2" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
    <div className="h-1.5 w-3/4 bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-full bg-slate-100 rounded-sm" />
    <div className="h-1.5 w-5/6 bg-slate-100 rounded-sm" />
  </div>
)

const STATUS_STYLE = {
  Draft: 'bg-slate-100 text-slate-500',
  'In Progress': 'bg-amber-50 text-amber-600',
  Final: 'bg-emerald-50 text-emerald-600',
}

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth)
  const colors = ["#8b5cf6", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    if (!resume) { toast.error('Please select a PDF file first'); return }
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.put('/api/resumes/update', { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
      setAllResumes(allResumes.map(r => r._id === editResumeId ? { ...r, title } : r))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeID) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this resume?')
      if (confirmed) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeID}`, { headers: { Authorization: token } })
        setAllResumes(prev => prev.filter(r => r._id !== resumeID))
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - d) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatus = (r) => {
    if (r.status) return r.status
    return (r.summary || r.experience?.length > 0) ? 'In Progress' : 'Draft'
  }

  useEffect(() => { loadAllResumes() }, [])

  return (
    <div className="w-full" onClick={() => setOpenMenuId(null)}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">

        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Your resume workspace</p>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <button
              onClick={() => setShowCreateResume(true)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-7 text-left
                shadow-[0_1px_4px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.05)]
                hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_36px_rgba(0,0,0,0.08)]
                hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer"
            >
              <div className="size-12 rounded-2xl bg-emerald-100
                group-hover:bg-emerald-200 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]
                flex items-center justify-center mb-5 transition-all duration-300">
                <Plus size={22} className="text-emerald-600" />
              </div>
              <p className="text-slate-900 font-semibold text-base tracking-tight mb-1.5">Create Resume</p>
              <p className="text-slate-400 text-sm leading-relaxed">Start from scratch with AI-powered editor and templates.</p>
              <ArrowRight size={15} className="absolute bottom-7 right-7 text-slate-200
                group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>

            <button
              onClick={() => setShowUploadResume(true)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-7 text-left
                shadow-[0_1px_4px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.05)]
                hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_36px_rgba(0,0,0,0.08)]
                hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer"
            >
              <div className="size-12 rounded-2xl bg-violet-100
                group-hover:bg-violet-200 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                flex items-center justify-center mb-5 transition-all duration-300">
                <UploadCloud size={22} className="text-violet-600" />
              </div>
              <p className="text-slate-900 font-semibold text-base tracking-tight mb-1.5">Upload Resume</p>
              <p className="text-slate-400 text-sm leading-relaxed">Import your existing PDF or Word file to enhance it with AI.</p>
              <ArrowRight size={15} className="absolute bottom-7 right-7 text-slate-200
                group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>

          </div>
        </section>

        {/* Your Resumes */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Your Resumes</p>
            {allResumes.length > 0 && (
              <span className="text-[11px] text-slate-300 font-medium">— {allResumes.length}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-5">
            {allResumes.map((resume, index) => {
              const accentColor = resume.accent_color || colors[index % colors.length]
              const status = getStatus(resume)
              return (
                <div key={resume._id} className="flex flex-col" style={{ width: '200px' }}>
                  <button
                    onClick={() => navigate(`builder/${resume._id}`)}
                    className="relative w-[200px] h-[280px] rounded-2xl overflow-hidden cursor-pointer
                      shadow-[0_1px_4px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.07)]
                      hover:shadow-[0_2px_8px_rgba(0,0,0,0.07),0_12px_28px_rgba(0,0,0,0.1)]
                      hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLE[status] || STATUS_STYLE.Draft}`}>
                      {status}
                    </div>
                    <ResumeSkeleton accentColor={accentColor} />
                  </button>

                  <div className="flex items-start justify-between mt-2.5 px-0.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 tracking-tight truncate">{resume.title || 'Untitled'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Edited {formatDate(resume.updatedAt)}</p>
                    </div>
                    <div className="relative ml-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === resume._id ? null : resume._id)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {openMenuId === resume._id && (
                        <div className="absolute right-0 top-7 z-20 bg-white/90 backdrop-blur-sm rounded-2xl
                          shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-slate-100 py-1.5 w-32">
                          <button
                            onClick={() => { setEditResumeId(resume._id); setTitle(resume.title); setOpenMenuId(null) }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Pencil size={11} /> Rename
                          </button>
                          <button
                            onClick={() => { deleteResume(resume._id); setOpenMenuId(null) }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* New Resume empty state */}
            <div style={{ width: '200px' }}>
              <button
                onClick={() => setShowCreateResume(true)}
                className="group w-[200px] h-[280px] rounded-2xl bg-slate-50 border border-slate-200
                  hover:bg-white hover:-translate-y-1
                  hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)]
                  transition-all duration-300 flex flex-col items-center justify-center gap-2.5 cursor-pointer"
              >
                <div className="size-12 rounded-full bg-white shadow-sm
                  group-hover:shadow-[0_0_0_8px_rgba(139,92,246,0.08)]
                  flex items-center justify-center transition-all duration-500">
                  <Plus size={20} className="text-slate-400 group-hover:text-violet-500 transition-colors duration-300" />
                </div>
                <p className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors font-medium">New Resume</p>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <div onClick={() => setShowCreateResume(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={createResume} onClick={e => e.stopPropagation()}
            className="relative bg-white/90 backdrop-blur-md w-full max-w-sm rounded-3xl p-8
              shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-white/60">
            <button type="button" onClick={() => { setShowCreateResume(false); setTitle('') }}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Create Resume</h2>
            <p className="text-sm text-slate-400 mb-6">Give your resume a name to get started.</p>
            <input type="text" placeholder="e.g. Software Engineer Resume" value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-slate-200 focus:border-violet-400 focus:ring-3 focus:ring-violet-100 outline-none rounded-xl px-4 py-3 text-sm mb-4 transition-all bg-slate-50/60" required />
            <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold tracking-tight transition">
              Create Resume
            </button>
          </form>
        </div>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <div onClick={() => setShowUploadResume(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={uploadResume} onClick={e => e.stopPropagation()}
            className="relative bg-white/90 backdrop-blur-md w-full max-w-sm rounded-3xl p-8
              shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-white/60">
            <button type="button" onClick={() => { setShowUploadResume(false); setTitle('') }}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Upload Resume</h2>
            <p className="text-sm text-slate-400 mb-6">Import your existing PDF to enhance it with AI.</p>
            <input type="text" placeholder="Give it a title" value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-slate-200 focus:border-violet-400 focus:ring-3 focus:ring-violet-100 outline-none rounded-xl px-4 py-3 text-sm mb-4 transition-all bg-slate-50/60" required />
            <label htmlFor="resume-input" className="block mb-4 cursor-pointer">
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
                ${resume ? 'border-violet-300 bg-violet-50' : 'border-slate-200 hover:border-violet-200 hover:bg-violet-50/30'}`}>
                {resume ? (
                  <p className="text-sm text-violet-700 font-medium">{resume.name}</p>
                ) : (
                  <>
                    <UploadCloud size={26} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-400">Click to upload PDF</p>
                  </>
                )}
              </div>
            </label>
            <input type="file" id="resume-input" accept="application/pdf,.pdf" hidden onChange={e => setResume(e.target.files[0])} />
            <button type="submit" disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl py-3 text-sm font-semibold tracking-tight transition flex items-center justify-center gap-2">
              {isLoading && <LoaderCircle size={15} className="animate-spin" />}
              {isLoading ? 'Uploading...' : 'Upload & Enhance'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <div onClick={() => setEditResumeId('')} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={editTitle} onClick={e => e.stopPropagation()}
            className="relative bg-white/90 backdrop-blur-md w-full max-w-sm rounded-3xl p-8
              shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-white/60">
            <button type="button" onClick={() => { setEditResumeId(''); setTitle('') }}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Rename Resume</h2>
            <p className="text-sm text-slate-400 mb-6">Give your resume a new name.</p>
            <input type="text" placeholder="Resume title" value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-slate-200 focus:border-violet-400 focus:ring-3 focus:ring-violet-100 outline-none rounded-xl px-4 py-3 text-sm mb-4 transition-all bg-slate-50/60" required />
            <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold tracking-tight transition">
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Dashboard
