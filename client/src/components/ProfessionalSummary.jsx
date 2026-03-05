import { useState } from 'react'
import { Info, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)

  const handleAiEnhance = async () => {
    if (!data?.trim()) return
    try {
      setLoading(true)
      toast.loading('Enhancing summary...', { id: 'pro-sum' })
      const { data: res } = await api.post(
        '/api/ai/enhance-pro-sum',
        { userContent: data },
        { headers: { Authorization: token } }
      )
      onChange(res?.enhancedContent || data)
      toast.success('Summary enhanced!', { id: 'pro-sum' })
    } catch (error) {
      console.error('AI summary enhance error:', error)
      toast.error('Failed to enhance summary', { id: 'pro-sum' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">Professional Summary</h3>
          <p className="text-xs text-slate-400 mt-1">A compelling intro shown at the top of your resume.</p>
        </div>
        <button
          type="button"
          onClick={handleAiEnhance}
          disabled={!data?.trim() || loading}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles size={13} />
          {loading ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      <textarea
        value={data || ''}
        onChange={e => onChange(e.target.value)}
        rows={7}
        className="w-full px-3 py-3 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none placeholder:text-slate-300 text-slate-800"
        placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
      />

      <div className="flex items-start gap-2 px-3 py-2.5 bg-violet-50 border border-violet-100 rounded-lg">
        <Info size={13} className="text-violet-500 shrink-0 mt-0.5" />
        <p className="text-xs text-violet-700 leading-relaxed">
          Keep it concise (3–4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummary
