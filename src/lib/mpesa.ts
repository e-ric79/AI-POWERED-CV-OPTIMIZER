import axios from 'axios'

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!
const SHORTCODE = process.env.MPESA_SHORTCODE!
const PASSKEY = process.env.MPESA_PASSKEY!
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!

// Sandbox auth URL
const AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
const STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

export async function getMpesaToken(): Promise<string> {
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
  const res = await axios.get(AUTH_URL, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  return res.data.access_token
}

export async function initiateSTKPush(phone: string, amount: number) {
  const token = await getMpesaToken()
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64')

  // Format phone: 07XX → 2547XX
  const formattedPhone = phone.startsWith('0')
    ? '254' + phone.slice(1)
    : phone

  const res = await axios.post(
    STK_URL,
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: 'CVOptimizerKE',
      TransactionDesc: 'CV Analysis Payment',
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data
}