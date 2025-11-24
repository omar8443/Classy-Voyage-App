import { openai } from '../genkit'
import { z } from 'zod'

const LeadSummaryInputSchema = z.object({
  leadName: z.string(),
  interactionType: z.enum(['voice', 'chat']),
  messages: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })),
  flightInquiry: z.object({
    origin: z.string(),
    destination: z.string(),
    departureDate: z.string(),
    returnDate: z.string().optional(),
    passengers: z.object({
      adults: z.number(),
      children: z.number(),
      infants: z.number(),
    }),
    class: z.string(),
    budget: z.string().optional(),
  }),
})

export async function summarizeLeadInteraction(input: z.infer<typeof LeadSummaryInputSchema>): Promise<string> {
  const { leadName, interactionType, messages, flightInquiry } = input

  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n')

  const prompt = `You are an AI assistant for Classy Voyage, a premium flight booking agency.

Analyze the following ${interactionType} interaction with ${leadName} and provide a concise summary focusing on:
- Customer intent and requirements
- Budget and preferences
- Level of engagement and buying signals
- Recommended next steps

Flight Inquiry Details:
- Route: ${flightInquiry.origin} to ${flightInquiry.destination}
- Dates: ${flightInquiry.departureDate}${flightInquiry.returnDate ? ` - ${flightInquiry.returnDate}` : ''}
- Passengers: ${flightInquiry.passengers.adults} adult(s), ${flightInquiry.passengers.children} child(ren), ${flightInquiry.passengers.infants} infant(s)
- Class: ${flightInquiry.class}
${flightInquiry.budget ? `- Budget: ${flightInquiry.budget}` : ''}

Conversation:
${conversationText}

Provide a professional summary in 2-3 sentences.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an AI assistant that provides concise, professional summaries of customer interactions for a flight booking agency.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || 'Unable to generate summary.'
}
