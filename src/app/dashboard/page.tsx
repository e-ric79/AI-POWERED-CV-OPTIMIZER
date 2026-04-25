'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  full_name: string
  email: string
  analyses_used: number
  analyses_paid: number
}

interface Analysis {
  id: string
  job_title: string
  ats_score: number
  match_score: number
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: analysesData } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setProfile(profileData)
      setAnalyses(analysesData || [])
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600'
    if (score >= 45) return 'text-yellow-500'
    return 'text-red-500'
  }

  const scoreBadge = (score: number) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-700'
    if (score >= 45) return 'bg-yellow-50 text-yellow-700'
    return 'bg-red-50 text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const hasFreeAnalysis = (profile?.analyses_used ?? 0) === 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-semibold text-gray-900">CV Optimizer KE</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {profile?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Hey, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {hasFreeAnalysis
              ? 'You have 1 free analysis ready to use.'
              : `You've run ${profile?.analyses_used} ${profile?.analyses_used === 1 ? 'analysis' : 'analyses'} so far.`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total analyses', value: profile?.analyses_used ?? 0, color: 'text-gray-900' },
            { label: 'Free analyses left', value: hasFreeAnalysis ? 1 : 0, color: 'text-emerald-600' },
            { label: 'Paid analyses', value: profile?.analyses_paid ?? 0, color: 'text-gray-900' },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="gradient-emerald rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-green-dark font-semibold text-lg">
              {hasFreeAnalysis ? 'Use your free analysis now' : 'Analyze a new CV'}
            </h2>
            <p className="text-emerald-150 font-bold text-sm mt-1">
              {hasFreeAnalysis
                ? 'Upload your CV and paste a job description to get started.'
                : 'Pay KES 200 via M-Pesa for each additional analysis.'}
            </p>
          </div>
          <Link
            href="/analyze"
            className="shrink-0 bg-white text-emerald-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-soft"
          >
            {hasFreeAnalysis ? 'Start free analysis →' : 'New analysis →'}
          </Link>
        </div>

        {/* History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis history</h2>

          {analyses.length === 0 ? (
            <div className="card border-dashed p-12 text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-500 text-sm font-medium">No analyses yet</p>
              <p className="text-gray-400 text-xs mt-1 mb-5">
                Your CV analysis history will appear here.
              </p>
              <Link href="/analyze" className="btn-primary text-sm px-5 py-2.5">
                Run your first analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((a) => (
                <div key={a.id} className="card p-5 flex items-center justify-between hover:border-emerald-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {a.job_title || 'Untitled role'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(a.created_at).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${scoreBadge(a.ats_score)} text-xs font-semibold px-3 py-1 rounded-full`}>
                      ATS {a.ats_score}%
                    </span>
                    <span className={`${scoreBadge(a.match_score)} text-xs font-semibold px-3 py-1 rounded-full`}>
                      Match {a.match_score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}