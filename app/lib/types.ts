export type InteractionType = 'voice' | 'chat'

export type FlightClass = 'economy' | 'premium-economy' | 'business' | 'first-class'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface VoiceTranscript {
  id: string
  speaker: 'customer' | 'agent'
  text: string
  timestamp: Date
  duration: number
}

export interface FlightInquiry {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  class: FlightClass
  budget?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: LeadStatus
  interactionType: InteractionType
  chatHistory?: ChatMessage[]
  voiceTranscripts?: VoiceTranscript[]
  flightInquiry: FlightInquiry
  aiSummary?: string
  leadScore?: number
  createdAt: Date
  updatedAt: Date
  notes?: string
}
