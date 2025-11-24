import { openai } from '../genkit'
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

export async function scoreLeadInteraction(input: z.infer<typeof LeadScoreInputSchema>): Promise<{ score: number; reasoning: string }> {
  const { leadName, interactionType, messages, flightInquiry } = input

  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n')

  const prompt = `You are an AI lead scoring system for Classy Voyage, a premium flight booking agency.

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
- reasoning: A brief explanation (1-2 sentences)

Respond ONLY with valid JSON in this format: {"score": 85, "reasoning": "..."}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an AI lead scoring system. Always respond with valid JSON only.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const response = completion.choices[0]?.message?.content || '{"score": 0, "reasoning": "Unable to generate score."}'
  
  try {
    const parsed = JSON.parse(response)
    return {
      score: parsed.score || 0,
      reasoning: parsed.reasoning || 'No reasoning provided.'
    }
  } catch (error) {
    console.error('Error parsing lead score response:', error)
    return {
      score: 0,
      reasoning: 'Error processing lead score.'
    }
  }
}
