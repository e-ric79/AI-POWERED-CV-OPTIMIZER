'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-semibold text-gray-900">CV Optimizer KE</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-sm px-4 py-2">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Built for the Kenyan job market 🇰🇪
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Get your CV past the{' '}
            <span className="text-emerald-600">ATS filter</span>{' '}
            and into human hands
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your CV, paste the job description — our AI tells you exactly
            what to fix in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Link href="/signup" className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base shadow-elevation">
              Analyze my CV for free →
            </Link>
            <a href="#how-it-works" className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-base">
              See how it works
            </a>
          </div>
          <p className="text-xs text-gray-400">No credit card · First analysis free · M-Pesa accepted</p>
        </div>

        {/* Hero mockup */}
        <div className="max-w-2xl mx-auto mt-16 bg-white rounded-2xl border border-gray-200 shadow-elevation overflow-hidden">
          {/* Browser bar */}
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              {['bg-red-400', 'bg-yellow-400', 'bg-green-400'].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${c}`} />
              ))}
            </div>
            <div className="flex-1 bg-gray-200 rounded-md h-5 flex items-center justify-center">
              <span className="text-xs text-gray-400">cvoptimizer.ke/analyze</span>
            </div>
          </div>
          {/* App UI preview */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'ATS Score', value: '84%', color: 'text-emerald-600' },
                { label: 'Job Match', value: '91%', color: 'text-emerald-600' },
                { label: 'Readability', value: '78%', color: 'text-yellow-500' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-3">
              <div className="text-xs font-semibold text-gray-700 mb-3">⚠️ Missing keywords</div>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'REST APIs', 'Agile', 'Docker', 'TypeScript'].map((k) => (
                  <span key={k} className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-700 mb-3">✅ Keywords found</div>
              <div className="flex flex-wrap gap-2">
                {['Python', 'SQL', 'Git', 'Linux'].map((k) => (
                  <span key={k} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: '75%', label: 'of CVs rejected by ATS before a human sees them' },
            { num: '30s', label: 'to get your full AI-powered CV analysis' },
            { num: 'KES 200', label: 'per analysis' },
          ].map((s) => (
            <div key={s.num}>
              <div className="text-3xl font-bold text-emerald-600 tracking-tight">{s.num}</div>
              <div className="text-xs text-gray-500 mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">How it works</h2>
            <p className="text-gray-500">Three steps. Under a minute.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: '📄', title: 'Upload your CV', desc: 'Upload as PDF. We support all standard CV formats used in Kenya.' },
              { step: '02', icon: '📋', title: 'Paste job description', desc: 'Copy from BrighterMonday, LinkedIn, or anywhere else.' },
              { step: '03', icon: '🎯', title: 'Get your report', desc: 'ATS score, missing keywords, rewritten summary, and interview tips.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-5">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-emerald-600 tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 right-0 translate-x-1/2 text-gray-200 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">What you get</h2>
            <p className="text-gray-500">Everything you need to fix your CV for that specific job.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📊', title: 'ATS Score', desc: 'See exactly how likely your CV is to pass automated screening systems.', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
              { icon: '🔑', title: 'Missing Keywords', desc: "The exact words recruiters scan for that your CV is missing.", bg: 'bg-yellow-50', iconBg: 'bg-yellow-100' },
              { icon: '✍️', title: 'Rewritten Summary', desc: 'Your professional summary rewritten by AI, tailored to the specific role.', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
              { icon: '🎯', title: 'Interview Tips', desc: 'Specific tips based on the job and your CV to help you prepare.', bg: 'bg-pink-50', iconBg: 'bg-pink-100' },
            ].map((item) => (
              <div key={item.title} className={`${item.bg} rounded-2xl p-6 border border-white`}>
                <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-14">Pay only when you need it. No subscriptions.</p>
          <div className="grid sm:grid-cols-2 gap-5 text-left">
            {/* Free */}
            <div className="card p-8">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Free</div>
              <div className="text-4xl font-bold text-gray-900 tracking-tight mb-1">KES 0</div>
              <div className="text-sm text-gray-400 mb-8">First analysis on us</div>
              <ul className="space-y-3 mb-8">
                {['1 free CV analysis', 'ATS score + keywords', 'Rewritten summary', 'Interview tips'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="text-emerald-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-outline w-full text-sm">
                Start free
              </Link>
            </div>
            {/* Paid */}
            <div className="relative card p-8 border-emerald-200 bg-emerald-50/30">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                MOST POPULAR
              </div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Pay per analysis</div>
              <div className="text-4xl font-bold text-gray-900 tracking-tight mb-1">KES 200</div>
              <div className="text-sm text-gray-400 mb-8">Per CV · via M-Pesa</div>
              <ul className="space-y-3 mb-8">
                {['Everything in free', 'Unlimited analyses', 'Priority processing', 'Full history saved'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="text-emerald-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary w-full text-sm">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Stop sending CVs into the void
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Join Kenyan job seekers landing more interviews with AI-optimized CVs.
          </p>
          <Link href="/signup" className="btn-primary px-10 py-4 text-base shadow-elevation">
            Analyze my CV for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">CV</span>
            </div>
            <span className="text-sm text-gray-500">CV Optimizer KE</span>
          </div>
          <p className="text-xs text-gray-400">Built in Kenya 🇰🇪 · {new Date().getFullYear()}</p>
        </div>
      </footer>

    </main>
  )
}