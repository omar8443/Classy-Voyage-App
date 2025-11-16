'use server'

import { summarizeLeadInteraction } from '@/ai/flows/lead-summary'
import { scoreLeadInteraction } from '@/ai/flows/lead-score'
import { Lead } from './types'

export async function generateLeadSummary(lead: Lead) {
  try {
    const messages = lead.chatHistory
      ? lead.chatHistory.map(m => ({ role: m.role, content: m.content }))
      : lead.voiceTranscripts
        ? lead.voiceTranscripts.map(t => ({
            role: t.speaker === 'customer' ? 'user' : 'assistant',
            content: t.text
          }))
        : []

    const summary = await summarizeLeadInteraction({
      leadName: lead.name,
      interactionType: lead.interactionType,
      messages,
      flightInquiry: {
        origin: lead.flightInquiry.origin,
        destination: lead.flightInquiry.destination,
        departureDate: lead.flightInquiry.departureDate,
        returnDate: lead.flightInquiry.returnDate,
        passengers: lead.flightInquiry.passengers,
        class: lead.flightInquiry.class,
        budget: lead.flightInquiry.budget,
      },
    })

    return { success: true, data: summary }
  } catch (error) {
    console.error('Error generating summary:', error)
    return { success: false, error: 'Failed to generate summary' }
  }
}

export async function generateLeadScore(lead: Lead) {
  try {
    const messages = lead.chatHistory
      ? lead.chatHistory.map(m => ({ role: m.role, content: m.content }))
      : lead.voiceTranscripts
        ? lead.voiceTranscripts.map(t => ({
            role: t.speaker === 'customer' ? 'user' : 'assistant',
            content: t.text
          }))
        : []

    const result = await scoreLeadInteraction({
      leadName: lead.name,
      interactionType: lead.interactionType,
      messages,
      flightInquiry: {
        origin: lead.flightInquiry.origin,
        destination: lead.flightInquiry.destination,
        class: lead.flightInquiry.class,
        budget: lead.flightInquiry.budget,
      },
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error generating score:', error)
    return { success: false, error: 'Failed to generate lead score' }
  }
}
