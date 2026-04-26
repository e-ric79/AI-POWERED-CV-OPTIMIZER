import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get stats
    const { data: stats } = await supabase
      .from("admin_stats")
      .select("*")
      .single();

    // Get recent users
    const { data: recentUsers } = await supabase
      .from("profiles")
      .select("id, full_name, email, analyses_used, analyses_paid, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // Get recent analyses
    const { data: recentAnalyses } = await supabase
      .from("analyses")
      .select("job_title, ats_score, match_score, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // Get recent payments
    const { data: recentPayments } = await supabase
      .from("payments")
      .select("phone, amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // Get analyses per day (last 7 days)
    const { data: dailyAnalyses } = await supabase
      .from("analyses")
      .select("created_at")
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("created_at", { ascending: true });

    return NextResponse.json({
      stats,
      recentUsers,
      recentAnalyses,
      recentPayments,
      dailyAnalyses,
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
