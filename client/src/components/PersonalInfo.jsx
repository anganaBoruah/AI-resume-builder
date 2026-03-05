import { BriefcaseBusiness, Globe, Mail, MapPin, Pencil, Phone, User } from 'lucide-react'

const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
)

const inputClass = 'w-full px-2 py-2 border-b border-slate-200 bg-transparent hover:bg-slate-50/70 focus:bg-violet-50/30 focus:border-violet-400 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-300 rounded-t-sm'
const labelClass = 'flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5'
const fieldClass = 'transition-shadow duration-200 focus-within:shadow-[inset_2px_0_0_0_#7C3AED]'

const PersonalInfo = ({ data = {}, onChange, removeBackground = false, setRemoveBackground }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div>
      <h3 className="text-lg font-bold tracking-tight text-slate-900">Personal Information</h3>
      <p className="text-xs text-slate-400 mt-1 mb-6">Basic info for your resume header.</p>

      <div className="space-y-6">
        {/* Image upload */}
        <div>
          <label className="relative inline-block cursor-pointer">
            {data.image ? (
              <img
                src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                alt="user"
                className="w-18 h-18 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <User size={28} className="text-slate-300" />
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <Pencil size={11} className="text-slate-500" />
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => handleChange('image', e.target.files[0])}
            />
          </label>
        </div>

        {/* Remove Background — only when a new file is selected */}
        {typeof data.image === 'object' && (
          <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">Remove Background</p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-55">AI will automatically detect and remove your background.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0 mt-0.5">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground(prev => !prev)}
                checked={removeBackground}
              />
              <div className="relative w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-violet-500 transition-colors duration-200">
                <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4 block" />
              </div>
            </label>
          </div>
        )}

        {/* Full Name */}
        <div className={fieldClass}>
          <label className={labelClass}>
            <User size={11} className="text-slate-400" />
            Full Name <span className="text-red-400 normal-case ml-0.5">*</span>
          </label>
          <input type="text" value={data.full_name || ''} onChange={e => handleChange('full_name', e.target.value)}
            placeholder="Enter your full name" className={inputClass} required />
        </div>

        {/* Email Address */}
        <div className={fieldClass}>
          <label className={labelClass}>
            <Mail size={11} className="text-slate-400" />
            Email Address <span className="text-red-400 normal-case ml-0.5">*</span>
          </label>
          <input type="email" value={data.email || ''} onChange={e => handleChange('email', e.target.value)}
            placeholder="Enter your email address" className={inputClass} required />
        </div>

        {/* Phone + Location — side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}><Phone size={11} className="text-slate-400" />Phone</label>
            <input type="tel" value={data.phone || ''} onChange={e => handleChange('phone', e.target.value)}
              placeholder="Enter phone" className={inputClass} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}><MapPin size={11} className="text-slate-400" />Location</label>
            <input type="text" value={data.location || ''} onChange={e => handleChange('location', e.target.value)}
              placeholder="Enter location" className={inputClass} />
          </div>
        </div>

        {/* Profession */}
        <div className={fieldClass}>
          <label className={labelClass}><BriefcaseBusiness size={11} className="text-slate-400" />Profession</label>
          <input type="text" value={data.profession || ''} onChange={e => handleChange('profession', e.target.value)}
            placeholder="Enter your profession" className={inputClass} />
        </div>

        {/* LinkedIn Profile */}
        <div className={fieldClass}>
          <label className={labelClass}><LinkedInIcon />LinkedIn Profile</label>
          <input type="url" value={data.linkedin || ''} onChange={e => handleChange('linkedin', e.target.value)}
            placeholder="Enter your linkedin profile" className={inputClass} />
        </div>

        {/* Personal Website */}
        <div className={fieldClass}>
          <label className={labelClass}><Globe size={11} className="text-slate-400" />Personal Website</label>
          <input type="url" value={data.website || ''} onChange={e => handleChange('website', e.target.value)}
            placeholder="Enter your personal website" className={inputClass} />
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo
