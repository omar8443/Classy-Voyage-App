import { NextRequest, NextResponse } from 'next/server'
import { ai } from '@/ai/genkit'
import { z } from 'zod'

const chatInputSchema = z.object({
  message: z.string(),
  leadId: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
})

const chatFlow = ai.defineFlow(
  {
    name: 'flightBookingChatAgent',
    inputSchema: chatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { message, history } = input

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
      { role: 'user' as const, content: [{ text: systemPrompt }] },
      ...history.map(h => ({
        role: h.role,
        content: [{ text: h.content }]
      })),
      { role: 'user' as const, content: [{ text: message }] }
    ]

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: { messages },
    })

    return result.text
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, leadId, history } = chatInputSchema.parse(body)

    const response = await chatFlow({
      message,
      leadId,
      history,
    })

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
