import { Sparkles, RefreshCw, Layers, Download, Shield, Clock } from 'lucide-react'
import resumeImg from '../../assets/resume.png'

const howItWorks = [
  {
    Icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    title: 'Smart Content Suggestions',
    desc: 'AI analyzes your experience and suggests powerful bullet points that ATS systems love.',
  },
  {
    Icon: RefreshCw,
    gradient: 'from-sky-400 to-blue-500',
    title: 'Real-Time ATS Scoring',
    desc: 'Live score indicator',
    badge: { text: '92/100', color: 'bg-emerald-100 text-emerald-700' },
  },
  {
    Icon: Layers,
    gradient: 'from-violet-500 to-indigo-600',
    title: 'Industry-Specific Templates',
    desc: '50+ templates',
    badge: { text: '+5 new', color: 'bg-orange-100 text-orange-600' },
  },
]

const bentoCards = [
  {
    Icon: Sparkles,
    accentFrom: 'from-violet-500',
    accentTo: 'to-fuchsia-400',
    iconColor: 'text-violet-600',
    title: 'AI Writing Assistant',
    desc: 'Smart suggestions that sound like you, not a robot.',
  },
  {
    Icon: Layers,
    accentFrom: 'from-blue-500',
    accentTo: 'to-cyan-400',
    iconColor: 'text-blue-600',
    title: '50+ Professional Templates',
    desc: 'From minimalist to bold — find your style.',
  },
  {
    Icon: Download,
    accentFrom: 'from-violet-500',
    accentTo: 'to-pink-400',
    iconColor: 'text-violet-600',
    title: 'One-Click Export',
    desc: 'PDF, DOCX, TXT — ready when you are.',
  },
  {
    Icon: Shield,
    accentFrom: 'from-rose-400',
    accentTo: 'to-orange-400',
    iconColor: 'text-rose-500',
    title: 'Privacy First',
    desc: 'Bank-grade encryption. Your data stays yours.',
  },
  {
    Icon: Clock,
    accentFrom: 'from-amber-400',
    accentTo: 'to-yellow-300',
    iconColor: 'text-amber-600',
    title: 'Built in Minutes',
    desc: 'From blank page to job-ready in under 10 minutes.',
  },
]

const BentoCard = ({ Icon, accentFrom, accentTo, iconColor, title, desc }) => (
  <div className="group bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-5 cursor-default h-full
    transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-200"
  >
    <div className={`w-10 h-0.5 rounded-full bg-linear-to-r ${accentFrom} ${accentTo}`} />
    <Icon size={28} className={`${iconColor} transition-transform duration-200 group-hover:scale-110`} />
    <div>
      <p className="font-semibold text-slate-800 text-base mb-1">{title}</p>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
)

const Feature = () => (
  <section id="features" className="px-6 md:px-16 lg:px-24 xl:px-40 scroll-mt-16">

    {/* How It Works */}
    <div className="py-24 flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 min-w-0">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-6">
          <span>💡</span>
          How It Works
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15] mb-10">
          Watch Your Resume<br />Write Itself
        </h2>
        <ul className="space-y-3">
          {howItWorks.map(({ Icon, gradient, title, desc, badge }) => (
            <li key={title} className="group flex items-start gap-4 p-4 rounded-2xl bg-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.06)]
              transition-all duration-200 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-default">
              <div className={`shrink-0 size-12 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-base mb-0.5">{title}</p>
                <p className="text-sm text-slate-500">
                  {desc}
                  {badge && (
                    <span className={`ml-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.text}
                    </span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <img
          src={resumeImg}
          alt="Resume preview"
          className="w-full rounded-2xl shadow-xl object-cover"
        />
      </div>
    </div>

    {/* Bento Grid */}
    <div className="pt-16 pb-36">
      <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-12">
        Everything You Need, Nothing You Don't
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-[auto] gap-5">
        {/* Large card — spans 2 rows on lg */}
        <div className="lg:row-span-2">
          <BentoCard {...bentoCards[0]} />
        </div>
        {bentoCards.slice(1).map(card => (
          <BentoCard key={card.title} {...card} />
        ))}
      </div>
    </div>

  </section>
)

export default Feature
