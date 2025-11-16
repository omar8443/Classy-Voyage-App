import { ai } from '../genkit'
import { z } from 'zod'

const LeadScoreInputSchema = z.object({
  leadName: z.string(),
  interactionType: z.enum(['voice', 'chat']),
  messages: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })),
  flightInquiry: z.object({
    origin: z.string(),
    destination: z.string(),
    class: z.string(),
    budget: z.string().optional(),
  }),
})

const leadScorePrompt = ai.definePrompt({
  name: 'scoreLeadInteraction',
  input: { schema: LeadScoreInputSchema },
  output: { format: 'json', schema: z.object({ score: z.number(), reasoning: z.string() }) },
}, async (input) => {
  const { leadName, interactionType, messages, flightInquiry } = input

  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n')

  return {
    messages: [
      {
        role: 'user',
        content: [
          {
            text: `You are an AI lead scoring system for Classy Voyage, a premium flight booking agency.

Analyze this ${interactionType} interaction with ${leadName} and assign a lead score from 0-100 based on:
- Budget potential (higher class = higher score)
- Engagement level and response quality
- Clarity of travel plans
- Urgency of booking
- Likelihood to convert

Flight Details:
- Route: ${flightInquiry.origin} to ${flightInquiry.destination}
- Class: ${flightInquiry.class}
${flightInquiry.budget ? `- Budget: ${flightInquiry.budget}` : ''}

Conversation:
${conversationText}

Provide a JSON response with:
- score: A number from 0-100
- reasoning: A brief explanation (1-2 sentences)`
          }
        ]
      }
    ]
  }
})

const leadScoreFlow = ai.defineFlow(
  {
    name: 'leadScoreFlow',
    inputSchema: LeadScoreInputSchema,
    outputSchema: z.object({ score: z.number(), reasoning: z.string() }),
  },
  async (input) => {
    const result = await leadScorePrompt(input)
    return result.output as { score: number; reasoning: string }
  }
)

export async function scoreLeadInteraction(input: z.infer<typeof LeadScoreInputSchema>): Promise<{ score: number; reasoning: string }> {
  return await leadScoreFlow(input)
}
