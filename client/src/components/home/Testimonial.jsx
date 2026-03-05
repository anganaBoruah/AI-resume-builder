import Title from './Title'

const reviews = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    text: 'Got 3 interview calls in my first week after rebuilding my resume here. The ATS scoring alone is worth everything.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    text: "I've tried 5 resume builders. This is the only one that actually understands what hiring managers want to see.",
  },
  {
    name: 'Priya Sharma',
    role: 'UX Designer at Figma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    text: 'The AI rewrote my bullet points and made them 10x stronger — without losing my voice. Genuinely impressive.',
  },
]

const Stars = () => (
  <div className="flex gap-0.5" aria-label="5 stars">
    {Array(5).fill(0).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed" aria-hidden="true">
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
    ))}
  </div>
)

const Testimonial = () => (
  <section id="testimonials" className="px-6 md:px-16 lg:px-24 xl:px-40 py-24 bg-slate-50 scroll-mt-16">
    <div className="text-center mb-14">
      <Title
        title="Real People. Real Results."
        description="Join thousands who stopped getting ghosted and started getting interviews."
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.map(({ name, role, avatar, text }) => (
        <figure key={name} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Stars />
          <blockquote className="text-slate-600 text-sm leading-relaxed flex-1">"{text}"</blockquote>
          <figcaption className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <img src={avatar} alt={name} className="size-9 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{name}</p>
              <p className="text-xs text-slate-400">{role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
)

export default Testimonial
