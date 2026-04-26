"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  full_name: string;
  email: string;
  analyses_used: number;
  analyses_paid: number;
  created_at: string;
}

interface Analysis {
  id: string;
  job_title: string;
  ats_score: number;
  match_score: number;
  readability_score: number;
  result: any;
  paid: boolean;
  created_at: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Verify current user is admin
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!adminProfile?.is_admin) {
        setError("Access denied.");
        setLoading(false);
        return;
      }

      // Fetch target user's profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // Fetch target user's analyses
      const { data: analysesData } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setProfile(profileData);
      setAnalyses(analysesData || []);
      setLoading(false);
    };

    fetchData();
  }, [router, userId]);

  const scoreBadge = (n: number) =>
    n >= 70
      ? "bg-emerald-50 text-emerald-700"
      : n >= 45
        ? "bg-yellow-50 text-yellow-700"
        : "bg-red-50 text-red-600";

  const scoreColor = (n: number) =>
    n >= 70 ? "text-emerald-600" : n >= 45 ? "text-yellow-500" : "text-red-500";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/admin" className="btn-primary text-sm px-5 py-2.5">
            Back to admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="font-semibold text-gray-900">
                CV Optimizer KE
              </span>
            </Link>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
              ADMIN
            </span>
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to admin
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* User info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">👁️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Viewing as admin — {profile?.full_name || "Unknown"} (
              {profile?.email})
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              This is a read-only view of this user's dashboard
            </p>
          </div>
        </div>

        {/* User stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            {profile?.full_name || "Unknown user"}
          </h1>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
          <p className="text-gray-400 text-xs mt-1">
            Joined{" "}
            {new Date(profile?.created_at || "").toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total analyses",
              value: profile?.analyses_used ?? 0,
              color: "text-gray-900",
            },
            {
              label: "Paid analyses",
              value: profile?.analyses_paid ?? 0,
              color: "text-purple-600",
            },
            {
              label: "Free analyses left",
              value: (profile?.analyses_used ?? 0) === 0 ? 1 : 0,
              color: "text-emerald-600",
            },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`text-3xl font-bold tracking-tight ${s.color}`}>
                {s.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Analysis history */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Analysis history ({analyses.length})
          </h2>

          {analyses.length === 0 ? (
            <div className="card border-dashed p-12 text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-500 text-sm">No analyses yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((a) => (
                <div key={a.id}>
                  <div
                    className="card p-5 flex items-center justify-between cursor-pointer hover:border-emerald-200 transition-colors"
                    onClick={() =>
                      setSelectedAnalysis(
                        selectedAnalysis?.id === a.id ? null : a,
                      )
                    }
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {a.job_title || "Untitled role"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(a.created_at).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {a.paid ? "💳 Paid" : "🆓 Free"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreBadge(a.ats_score)}`}
                      >
                        ATS {a.ats_score}%
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreBadge(a.match_score)}`}
                      >
                        Match {a.match_score}%
                      </span>
                      <span className="text-gray-300 text-sm ml-1">
                        {selectedAnalysis?.id === a.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded analysis result */}
                  {selectedAnalysis?.id === a.id && a.result && (
                    <div className="mt-2 space-y-3 pl-2">
                      {/* Scores */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "ATS Score", value: a.result.ats_score },
                          { label: "Job Match", value: a.result.match_score },
                          {
                            label: "Readability",
                            value: a.result.readability_score,
                          },
                        ].map((s) => (
                          <div key={s.label} className="card p-4 text-center">
                            <div
                              className={`text-2xl font-bold ${scoreColor(s.value)}`}
                            >
                              {s.value}%
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {s.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Keywords */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="card p-4">
                          <h3 className="text-xs font-semibold text-gray-700 mb-2">
                            ⚠️ Missing keywords
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {a.result.missing_keywords?.map((k: string) => (
                              <span
                                key={k}
                                className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="card p-4">
                          <h3 className="text-xs font-semibold text-gray-700 mb-2">
                            ✅ Found keywords
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {a.result.found_keywords?.map((k: string) => (
                              <span
                                key={k}
                                className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      {[
                        {
                          icon: "✍️",
                          title: "Rewritten summary",
                          content: a.result.rewritten_summary,
                        },
                        {
                          icon: "🔧",
                          title: "Sections to improve",
                          content: a.result.weak_sections,
                        },
                        {
                          icon: "🎯",
                          title: "Interview tips",
                          content: a.result.interview_tips,
                        },
                      ].map((s) => (
                        <div key={s.title} className="card p-4">
                          <h3 className="text-xs font-semibold text-gray-700 mb-2">
                            {s.icon} {s.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {s.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
