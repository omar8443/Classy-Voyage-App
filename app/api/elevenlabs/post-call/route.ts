/**
 * ElevenLabs post-call webhook endpoint.
 * 
 * This API route receives webhooks from ElevenLabs when a phone call ends.
 * It processes the webhook payload, saves the call data to Firestore,
 * and returns a success response.
 * 
 * Webhook URL: /api/elevenlabs/post-call
 * 
 * TODO: Add HMAC signature verification using ELEVENLABS_WEBHOOK_SECRET
 * to ensure webhook authenticity. Verification should be performed before
 * processing the payload, ideally using crypto.createHmac('sha256', secret).
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveElevenLabsCallLead } from '@/lib/leads'
import { ElevenLabsWebhookPayload } from '@/types/lead'

export async function POST(request: NextRequest) {
  try {
    console.log('Received ElevenLabs post-call webhook')

    // Read raw body for potential signature verification
    const rawBody = await request.text()
    
    // TODO: Verify HMAC signature here
    // Example:
    // const signature = request.headers.get('x-elevenlabs-signature')
    // const secret = process.env.ELEVENLABS_WEBHOOK_SECRET
    // if (!verifySignature(rawBody, signature, secret)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    // Parse JSON payload
    let payload: ElevenLabsWebhookPayload
    try {
      payload = JSON.parse(rawBody)
    } catch (error) {
      console.error('Failed to parse webhook JSON:', error)
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Log payload in development
    if (process.env.NODE_ENV === 'development') {
      console.dir(payload, { depth: 4 })
    }

    // Save lead to Firestore
    await saveElevenLabsCallLead(payload)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error processing ElevenLabs webhook:', error)
    
    // Return 500 error without exposing internal details
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}

