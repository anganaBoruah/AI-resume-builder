import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/home/Hero'
import Feature from '../components/home/Feature'
import Footer from '../components/home/Footer'
import Login from './Login'

const Home = () => {
  const [authModal, setAuthModal] = useState(null)

  return (
    <div className="bg-violet-50">
      <Hero />
      <Feature />

      {/* CTA */}
      <section id="cta" className="px-6 md:px-16 lg:px-24 xl:px-40 py-24">
        <div className="rounded-3xl bg-linear-to-br from-violet-600 to-fuchsia-500 px-8 py-20 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-violet-100 mb-8 max-w-md mx-auto text-lg">
            Join 50,000+ professionals who upgraded their career with AI.
          </p>
          <button
            onClick={() => setAuthModal('register')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-violet-700 font-semibold rounded-full hover:bg-violet-50 transition shadow-lg"
          >
            Get Started Free <ArrowRight size={16} />
          </button>
          <p className="text-xs text-violet-200 mt-5">No credit card required • Free forever plan</p>
        </div>
      </section>

      <Footer />

      {authModal && <Login defaultState={authModal} onClose={() => setAuthModal(null)} />}
    </div>
  )
}

export default Home
