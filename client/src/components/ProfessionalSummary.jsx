import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
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

      const enhanced = res?.enhancedContent || data
      onChange(enhanced)

      toast.success('Summary enhanced!', { id: 'pro-sum' })
    } catch (error) {
      console.error('AI summary enhance error:', error)
      toast.error('Failed to enhance summary', { id: 'pro-sum' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-seminbold text-gray-900'>
            Professional Summary
          </h3>
          <p className='text-sm text-gray-500'>
            Add summary for your resume here
          </p>
        </div>
        <button
          type='button'
          onClick={handleAiEnhance}
          disabled={!data?.trim() || loading}
          className="
  flex items-center gap-2 px-3 py-1.5 text-xs font-medium
  rounded-md
  bg-indigo-500/10
  text-indigo-700
  border border-indigo-200
  hover:bg-indigo-500/20
  hover:border-indigo-300
  transition-all
"

        >
          <Sparkles className='size-4' />
          {loading ? 'Enhancing...' : 'AI enhance'}
        </button>
      </div>

      <div className='mt-6'>
        <textarea
          value={data || ''}
          onChange={e => onChange(e.target.value)}
          rows={7}
          className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors whitespace-normal break-all [overflow-wrap:anywhere] resize-none'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
        />

        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummary
