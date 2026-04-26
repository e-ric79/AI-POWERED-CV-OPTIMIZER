export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              CV Optimizer KE
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            API Documentation
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-xl">
            CV Optimizer KE exposes a set of REST API endpoints for CV analysis,
            authentication, and M-Pesa payment processing.
          </p>
          <div className="flex gap-3 mt-6">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              Version 1.0
            </span>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              REST API
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              JSON
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Base URL */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h2>
          <div className="bg-gray-900 rounded-xl px-4 py-3 font-mono text-sm text-emerald-400">
            https://ai-powered-cv-optimizer.vercel.app/api
          </div>
          <p className="text-sm text-gray-500 mt-3">
            All endpoints are relative to this base URL. All requests and
            responses use <strong>JSON</strong>.
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Authentication
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            All protected endpoints require an active Supabase session cookie.
            Authentication is handled via Supabase Auth — users must be signed
            in through the app before making API requests.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-700 font-medium">
              ⚠️ Requests without a valid session will return{" "}
              <code className="bg-amber-100 px-1 rounded">
                401 Unauthorized
              </code>
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Endpoints
        </h2>

        {/* POST /api/analyze */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              POST
            </span>
            <code className="text-sm font-mono text-gray-900">
              /api/analyze
            </code>
            <span className="text-xs text-gray-400 ml-auto">
              🔒 Requires auth
            </span>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-500">
              Analyzes a CV against a job description using Groq AI (Llama 3.3
              70B). Returns ATS score, match score, missing keywords, rewritten
              summary, and interview tips. First analysis is free. Subsequent
              analyses require payment.
            </p>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Request body
              </h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`{
  "cvBase64": "string",      // Base64-encoded PDF file (required)
  "jobDescription": "string", // Full job description text (required)
  "jobTitle": "string",      // Job title for history (optional)
  "paid": "boolean"          // true if user has paid (default: false)
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Success response <span className="text-emerald-600">200</span>
              </h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`{
  "result": {
    "ats_score": 84,
    "match_score": 91,
    "readability_score": 78,
    "missing_keywords": ["React.js", "Docker", "Agile"],
    "found_keywords": ["Python", "SQL", "Git"],
    "rewritten_summary": "Experienced software developer...",
    "weak_sections": "Work experience section lacks quantifiable achievements...",
    "interview_tips": "Prepare to discuss your Python projects..."
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Error responses
              </h3>
              <div className="space-y-2">
                {[
                  {
                    code: "401",
                    label: "Unauthorized",
                    desc: "User is not logged in",
                  },
                  {
                    code: "400",
                    label: "Bad Request",
                    desc: "CV text could not be extracted from PDF",
                  },
                  {
                    code: "402",
                    label: "Payment Required",
                    desc: "Free analysis used, payment needed",
                  },
                  {
                    code: "500",
                    label: "Server Error",
                    desc: "AI analysis failed",
                  },
                ].map((e) => (
                  <div key={e.code} className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded ${
                        e.code === "401" || e.code === "402"
                          ? "bg-yellow-50 text-yellow-700"
                          : e.code === "400"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {e.code}
                    </span>
                    <span className="font-medium text-gray-700">{e.label}</span>
                    <span className="text-gray-400">— {e.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* POST /api/mpesa/initiate */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              POST
            </span>
            <code className="text-sm font-mono text-gray-900">
              /api/mpesa/initiate
            </code>
            <span className="text-xs text-gray-400 ml-auto">
              🔒 Requires auth
            </span>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-500">
              Initiates an M-Pesa STK Push payment request to the user's phone
              via Safaricom Daraja API. The user receives a payment prompt on
              their phone and enters their M-Pesa PIN to complete the
              transaction.
            </p>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Request body
              </h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`{
  "phone": "0712345678",  // Kenyan phone number (required)
  "amount": 200           // Amount in KES (required)
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Success response <span className="text-emerald-600">200</span>
              </h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`{
  "success": true,
  "data": {
    "MerchantRequestID": "29115-34620561-1",
    "CheckoutRequestID": "ws_CO_271012022...",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing",
    "CustomerMessage": "Success. Request accepted for processing"
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Error responses
              </h3>
              <div className="space-y-2">
                {[
                  {
                    code: "401",
                    label: "Unauthorized",
                    desc: "User is not logged in",
                  },
                  {
                    code: "400",
                    label: "Bad Request",
                    desc: "Phone or amount missing",
                  },
                  {
                    code: "500",
                    label: "Server Error",
                    desc: "Safaricom API error",
                  },
                ].map((e) => (
                  <div key={e.code} className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded ${
                        e.code === "401"
                          ? "bg-yellow-50 text-yellow-700"
                          : e.code === "400"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {e.code}
                    </span>
                    <span className="font-medium text-gray-700">{e.label}</span>
                    <span className="text-gray-400">— {e.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* POST /api/mpesa/callback */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              POST
            </span>
            <code className="text-sm font-mono text-gray-900">
              /api/mpesa/callback
            </code>
            <span className="text-xs text-gray-400 ml-auto">
              🌐 Public — Safaricom only
            </span>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-500">
              Webhook endpoint called by Safaricom after payment is completed or
              failed. Updates the payment status in the database and credits the
              user with a paid analysis. This endpoint is public and called
              automatically by Safaricom.
            </p>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Safaricom payload
              </h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`{
  "Body": {
    "stkCallback": {
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 200 },
          { "Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV" },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}`}</pre>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-700 font-medium">
                ℹ️ ResultCode 0 = success. Any other code = payment failed or
                cancelled.
              </p>
            </div>
          </div>
        </div>

        {/* GET /api/admin/stats */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              GET
            </span>
            <code className="text-sm font-mono text-gray-900">
              /api/admin/stats
            </code>
            <span className="text-xs text-gray-400 ml-auto">🔒 Admin only</span>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-500">
              Returns platform-wide statistics including total users, analyses,
              payments, and revenue. Also returns recent users, analyses, and
              payments. Only accessible by users with{" "}
              <code className="bg-gray-100 px-1 rounded text-xs">
                is_admin = true
              </code>
              .
            </p>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Success response <span className="text-emerald-600">200</span>
              </h3>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`{
  "stats": {
    "total_users": 42,
    "total_analyses": 128,
    "total_payments": 35,
    "total_revenue": 7000
  },
  "recentUsers": [...],
  "recentAnalyses": [...],
  "recentPayments": [...],
  "dailyAnalyses": [...]
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Error responses
              </h3>
              <div className="space-y-2">
                {[
                  {
                    code: "401",
                    label: "Unauthorized",
                    desc: "User is not logged in",
                  },
                  {
                    code: "403",
                    label: "Forbidden",
                    desc: "User is not an admin",
                  },
                ].map((e) => (
                  <div key={e.code} className="flex items-center gap-3 text-xs">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-yellow-50 text-yellow-700">
                      {e.code}
                    </span>
                    <span className="font-medium text-gray-700">{e.label}</span>
                    <span className="text-gray-400">— {e.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tech stack
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Framework", value: "Next.js 15 (App Router)" },
              { label: "Language", value: "TypeScript" },
              { label: "AI Model", value: "Llama 3.3 70B via Groq" },
              { label: "Database", value: "Supabase (PostgreSQL)" },
              { label: "Auth", value: "Supabase Auth" },
              { label: "Payments", value: "M-Pesa Daraja API" },
              { label: "Styling", value: "Tailwind CSS v4" },
              { label: "Hosting", value: "Vercel" },
              { label: "CI/CD", value: "GitHub Actions" },
              { label: "Testing", value: "Jest + ts-jest" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 py-2 border-b border-gray-50"
              >
                <span className="text-xs font-semibold text-gray-400 w-28 shrink-0">
                  {s.label}
                </span>
                <span className="text-sm text-gray-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-gray-400">
            CV Optimizer KE · Built in Kenya 🇰🇪 · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
