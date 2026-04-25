import { NextRequest, NextResponse } from 'next/server'
import { initiateSTKPush } from '@/lib/mpesa'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { phone, amount } = await req.json()
    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount required' }, { status: 400 })
    }

    const mpesaRes = await initiateSTKPush(phone, amount)

    // Save pending payment
    await supabase.from('payments').insert({
      user_id: user.id,
      phone,
      amount,
      status: 'pending',
    })

    return NextResponse.json({ success: true, data: mpesaRes })
  } catch (err: any) {
    console.error('M-Pesa error:', err)
    return NextResponse.json({ error: err.message || 'Payment failed' }, { status: 500 })
  }
}