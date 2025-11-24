import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/ai/genkit'
import { z } from 'zod'

const chatInputSchema = z.object({
  message: z.string(),
  leadId: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, leadId, history } = chatInputSchema.parse(body)

    const systemPrompt = `You are an expert AI assistant for Classy Voyage, a premium flight booking agency.

Your role is to:
- Help customers find and book flights
- Provide information about destinations, flight classes, and pricing
- Collect customer requirements (origin, destination, dates, passengers, class preference)
- Offer personalized recommendations based on budget and preferences
- Be professional, friendly, and helpful

Key points:
- Always prioritize customer satisfaction
- Ask clarifying questions when needed
- Suggest premium options when appropriate
- Be knowledgeable about flight classes (economy, premium economy, business, first class)
- Help with date flexibility to find better deals

Current conversation context is provided in the message history.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
