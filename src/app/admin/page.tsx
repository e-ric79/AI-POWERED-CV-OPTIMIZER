"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  total_users: number;
  total_analyses: number;
  total_payments: number;
  total_revenue: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  analyses_used: number;
  created_at: string;
}

interface Analysis {
  job_title: string;
  ats_score: number;
  match_score: number;
  created_at: string;
}

interface Payment {
  phone: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/admin/stats");
      if (res.status === 403) {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentAnalyses(data.recentAnalyses || []);
      setRecentPayments(data.recentPayments || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/dashboard" className="btn-primary text-sm px-5 py-2.5">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const scoreBadge = (n: number) =>
    n >= 70
      ? "bg-emerald-50 text-emerald-700"
      : n >= 45
        ? "bg-yellow-50 text-yellow-700"
        : "bg-red-50 text-red-600";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5">
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
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              User view
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of all users, analyses and revenue.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total users",
              value: stats?.total_users ?? 0,
              icon: "👥",
              color: "text-blue-600",
            },
            {
              label: "Total analyses",
              value: stats?.total_analyses ?? 0,
              icon: "📄",
              color: "text-emerald-600",
            },
            {
              label: "Completed payments",
              value: stats?.total_payments ?? 0,
              icon: "💳",
              color: "text-purple-600",
            },
            {
              label: "Total revenue (KES)",
              value: stats?.total_revenue ?? 0,
              icon: "💰",
              color: "text-amber-600",
            },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-bold tracking-tight ${s.color}`}>
                {s.label === "Total revenue (KES)"
                  ? `${(s.value as number).toLocaleString()}`
                  : s.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Recent users */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              👥 Recent users
            </h2>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-gray-400">No users yet.</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {u.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-600">
                          {u.analyses_used} analyses
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(u.created_at).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent payments */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              💳 Recent payments
            </h2>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-gray-400">No payments yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {p.phone}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        KES {p.amount}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          p.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent analyses */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            📄 Recent analyses
          </h2>
          {recentAnalyses.length === 0 ? (
            <p className="text-sm text-gray-400">No analyses yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {a.job_title || "Untitled role"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
