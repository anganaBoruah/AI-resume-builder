import { Link } from 'react-router-dom'

const LINKS = [
  ['Product', ['Features', 'Templates', 'Pricing', 'Examples']],
  ['Resources', ['Blog', 'Guides', 'Help Center', 'Community']],
  ['Company', ['About', 'Careers', 'Privacy', 'Terms']],
]

const SOCIALS = [
  {
    label: 'LinkedIn',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
  {
    label: 'X (Twitter)',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632z',
    isFill: true,
  },
  {
    label: 'YouTube',
    path: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z M10 15l5-3-5-3z',
  },
  {
    label: 'GitHub',
    path: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4 M9 18c-4.51 2-5-2-7-2',
  },
]

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 text-sm">
    <div className="px-6 md:px-16 lg:px-24 xl:px-40 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <Link to="/"><img src="/logo.svg" alt="logo" className="h-9 w-auto mb-4" /></Link>
        <p className="text-slate-500 text-xs leading-relaxed max-w-48">Resumes that work as hard as you do.</p>
      </div>
      {LINKS.map(([heading, links]) => (
        <div key={heading}>
          <p className="text-white font-medium mb-4">{heading}</p>
          <ul className="space-y-3">
            {links.map(l => <li key={l}><a href="/" className="hover:text-white transition">{l}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-800 px-6 md:px-16 lg:px-24 xl:px-40 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <p>© 2025 makeYourResume. All rights reserved.</p>
      <div className="flex items-center gap-4">
        {SOCIALS.map(({ label, path, isFill }) => (
          <a key={label} href="/" aria-label={label} className="hover:text-white transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFill ? 'currentColor' : 'none'} stroke={isFill ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={path} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
