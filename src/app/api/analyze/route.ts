import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'
import { extractText } from 'unpdf'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { cvBase64, jobDescription, jobTitle, paid } = await req.json()

    // Check usage
    const { data: profile } = await supabase
      .from('profiles')
      .select('analyses_used, analyses_paid')
      .eq('id', user.id)
      .single()

    const used = profile?.analyses_used ?? 0
    const paidCount = profile?.analyses_paid ?? 0

    if (used >= 1 && !paid && paidCount === 0) {
      return NextResponse.json({ error: 'Payment required' }, { status: 402 })
    }

    // Extract text from PDF
    const pdfBuffer = new Uint8Array(Buffer.from(cvBase64, 'base64'))
    const { text: cvText } = await extractText(pdfBuffer, { mergePages: true })

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({
        error: 'Could not extract text from your PDF. Make sure it is not a scanned image.'
      }, { status: 400 })
    }

    const prompt = `You are an expert CV coach and ATS specialist for the Kenyan job market.

Analyze this CV against the job description. Return ONLY a valid JSON object, no markdown, no backticks, no extra text.

{
  "ats_score": <number 0-100>,
  "match_score": <number 0-100>,
  "readability_score": <number 0-100>,
  "missing_keywords": [<6-10 important keywords from job description missing in CV>],
  "found_keywords": [<5-8 keywords found in both CV and job description>],
  "rewritten_summary": "<rewrite the candidate's actual summary using their real experience, tailored to match the job description's language and requirements. Do not invent experience they don't have>",
  "weak_sections": "<specific feedback on 2-3 weak areas and exactly how to fix them>",
  "interview_tips": "<3-4 tailored interview tips based on the role and CV>"
}

CV:
${cvText}

Job Description:
${jobDescription}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const text = completion.choices[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    // Save to DB
    const { error: insertError } = await supabase.from('analyses').insert({
      user_id: user.id,
      job_title: jobTitle || 'Untitled role',
      ats_score: analysis.ats_score,
      match_score: analysis.match_score,
      result: analysis,
      paid: paid || false,
    })

    if (insertError) {
      console.error('Insert error:', insertError)
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ analyses_used: used + 1 })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
    }

    return NextResponse.json({ result: analysis })

  } catch (err: any) {
    console.error('Analysis error:', err)
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 })
  }
}