import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createClient()

    const stk = body?.Body?.stkCallback
    if (!stk) return NextResponse.json({ ok: true })

    const resultCode = stk.ResultCode
    const receipt = stk.CallbackMetadata?.Item?.find(
      (i: any) => i.Name === 'MpesaReceiptNumber'
    )?.Value
    const phone = stk.CallbackMetadata?.Item?.find(
      (i: any) => i.Name === 'PhoneNumber'
    )?.Value?.toString()

    if (resultCode === 0 && phone) {
      // Payment successful — update payment record
      await supabase
        .from('payments')
        .update({ status: 'completed', mpesa_receipt: receipt })
        .eq('phone', phone.replace('254', '0'))
        .eq('status', 'pending')

      // Give user a paid analysis credit
      const { data: payment } = await supabase
        .from('payments')
        .select('user_id')
        .eq('mpesa_receipt', receipt)
        .single()

      if (payment?.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('analyses_paid')
          .eq('id', payment.user_id)
          .single()

        await supabase
          .from('profiles')
          .update({ analyses_paid: (profile?.analyses_paid ?? 0) + 1 })
          .eq('id', payment.user_id)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.json({ ok: true })
  }
}