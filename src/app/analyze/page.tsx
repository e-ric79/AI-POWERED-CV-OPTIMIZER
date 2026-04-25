'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

interface AnalysisResult {
  ats_score: number
  match_score: number
  readability_score: number
  missing_keywords: string[]
  found_keywords: string[]
  rewritten_summary: string
  weak_sections: string
  interview_tips: string
}

export default function AnalyzePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [phone, setPhone] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [payMsg, setPayMsg] = useState('')

  const msgs = [
    'Reading your CV...',
    'Comparing with job description...',
    'Calculating ATS score...',
    'Finding missing keywords...',
    'Rewriting your summary...',
    'Preparing interview tips...',
  ]

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0])
  }

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res((reader.result as string).split(',')[1])
      reader.onerror = rej
      reader.readAsDataURL(file)
    })

  const runAnalysis = async (paid = false) => {
    if (!file || !jobDesc) return
    setLoading(true)
    setError('')
    setResult(null)

    let i = 0
    setLoadingMsg(msgs[0])
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length
      setLoadingMsg(msgs[i])
    }, 2500)

    try {
      const base64 = await toBase64(file)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvBase64: base64, jobDescription: jobDesc, jobTitle, paid }),
      })

      const data = await res.json()
      clearInterval(interval)

      if (!res.ok) {
        if (res.status === 402) {
          setShowPayment(true)
          setLoading(false)
          return
        }
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data.result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!phone) return
    setPayLoading(true)
    setPayMsg('')
    try {
      const res = await fetch('/api/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: 200 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')
      setPayMsg('✅ Check your phone for the M-Pesa prompt. Enter your PIN then click below.')
    } catch (err: any) {
      setPayMsg('❌ ' + (err.message || 'Payment failed. Try again.'))
    } finally {
      setPayLoading(false)
    }
  }

  const scoreBadge = (n: number) =>
    n >= 70 ? 'bg-emerald-50 text-emerald-700' : n >= 45 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'

  const scoreColor = (n: number) =>
    n >= 70 ? 'text-emerald-600' : n >= 45 ? 'text-yellow-500' : 'text-red-500'

  const Navbar = () => (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="font-semibold text-gray-900">CV Optimizer KE</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
          ← Dashboard
        </Link>
      </div>
    </nav>
  )

  // Results view
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your CV analysis</h1>
            {jobTitle && <p className="text-gray-500 text-sm mt-1">For: {jobTitle}</p>}
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'ATS Score', value: result.ats_score },
              { label: 'Job Match', value: result.match_score },
              { label: 'Readability', value: result.readability_score },
            ].map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className={`text-3xl font-bold tracking-tight ${scoreColor(s.value)}`}>
                  {s.value}%
                </div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Keywords */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">⚠️ Missing keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((k) => (
                  <span key={k} className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">✅ Keywords found</h3>
              <div className="flex flex-wrap gap-2">
                {result.found_keywords.map((k) => (
                  <span key={k} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detail sections */}
          {[
            { icon: '✍️', title: 'Rewritten professional summary', content: result.rewritten_summary },
            { icon: '🔧', title: 'Sections to improve', content: result.weak_sections },
            { icon: '🎯', title: 'Interview tips for this role', content: result.interview_tips },
          ].map((s) => (
            <div key={s.title} className="card p-6 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{s.icon} {s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{s.content}</p>
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setResult(null); setFile(null); setJobDesc(''); setJobTitle('') }}
              className="btn-secondary flex-1 py-3 text-sm"
            >
              Analyze another CV
            </button>
            <Link href="/dashboard" className="btn-primary flex-1 py-3 text-sm text-center">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Upload view
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analyze your CV</h1>
          <p className="text-gray-500 text-sm mt-1">Upload your CV and paste the job description below.</p>
        </div>

        {/* Payment gate */}
        {showPayment && (
          <div className="card p-6 mb-6 border-emerald-200 bg-emerald-50/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                💳
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Pay KES 200 via M-Pesa</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  You've used your free analysis. Pay to continue.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                M-Pesa phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678"
                className="input-base"
              />
            </div>
            {payMsg && (
              <p className="text-sm text-gray-600 mb-4 bg-white rounded-lg px-4 py-3 border border-gray-100">
                {payMsg}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                disabled={payLoading || !phone}
                className="btn-primary flex-1 py-3 text-sm disabled:opacity-60"
              >
                {payLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending prompt...
                  </span>
                ) : 'Pay KES 200'}
              </button>
              {payMsg.includes('✅') && (
                <button
                  onClick={() => { setShowPayment(false); runAnalysis(true) }}
                  className="btn-outline flex-1 py-3 text-sm"
                >
                  I've paid → Run analysis
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card p-16 text-center">
            <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-gray-500 text-sm font-medium">{loadingMsg}</p>
            <p className="text-gray-300 text-xs mt-2">This takes about 30 seconds</p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Job title */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Job title <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer at Safaricom"
                className="input-base"
              />
            </div>

            {/* Upload */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your CV <span className="text-gray-400 font-normal">(PDF only)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  file
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
                {file ? (
                  <>
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2">⬆️</div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF files only · Max 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Job description */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Job description
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here — from BrighterMonday, LinkedIn, or anywhere else..."
                rows={7}
                className="input-base resize-none"
              />
            </div>

            <button
              onClick={() => runAnalysis()}
              disabled={!file || !jobDesc}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-elevation"
            >
              Analyze my CV →
            </button>

            <p className="text-center text-xs text-gray-400">
              First analysis free · KES 200 per analysis after that via M-Pesa
            </p>
          </div>
        )}
      </div>
    </div>
  )
}