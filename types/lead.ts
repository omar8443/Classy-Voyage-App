/**
 * Type definitions for Lead data structures.
 * 
 * This module defines:
 * - FirestoreLead: The structure stored in Firestore
 * - ElevenLabsWebhookPayload: Expected structure from ElevenLabs post-call webhooks
 * - Lead: The structure used in the application (extends FirestoreLead with id)
 */

/**
 * Lead data structure as stored in Firestore.
 * This matches the Firestore document structure for the leads collection.
 * 
 * Note: createdAt can be either a Timestamp (when reading) or FieldValue.serverTimestamp()
 * (when writing), so we use a union type to handle both cases.
 */
export interface FirestoreLead {
  source: 'elevenlabs-phone'
  name: string | null
  email: string | null
  phone: string | null
  departureCity: string | null
  destinationCity: string | null
  travelDates: string | null
  passengers: number | null
  airlinePreference: string | null
  specialRequirements: string | null
  summary: string
  transcript: string
  language: 'en' | 'fr' | null
  createdAt: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue
}

/**
 * Expected payload structure from ElevenLabs post-call webhooks.
 * 
 * This type is intentionally flexible with many optional fields to handle
 * variations in ElevenLabs webhook payloads. The actual structure may vary
 * based on ElevenLabs API version and configuration.
 */
export interface ElevenLabsWebhookPayload {
  // Call metadata
  call_id?: string
  conversation_id?: string
  status?: string
  duration?: number
  
  // Customer information (may be extracted from transcript)
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  
  // Travel details (extracted from conversation)
  departure_city?: string
  destination_city?: string
  travel_dates?: string
  passengers?: number | string
  airline_preference?: string
  special_requirements?: string
  
  // Call content
  transcript?: string
  summary?: string
  language?: 'en' | 'fr' | string
  
  // Additional metadata
  metadata?: Record<string, unknown>
  [key: string]: unknown // Allow for additional fields
}

/**
 * Lead structure used in the application.
 * Extends FirestoreLead with an id field (the Firestore document ID).
 */
export interface Lead extends Omit<FirestoreLead, 'createdAt'> {
  id: string
  createdAt: Date
}

