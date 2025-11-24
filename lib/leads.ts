/**
 * Helper functions for managing leads in Firestore.
 * 
 * This module provides server-side functions to save and retrieve leads
 * from the Firestore database. All functions are designed to be used
 * in API routes or server actions only.
 */

import { db } from '../lib/firebaseAdmin'
import { ElevenLabsWebhookPayload, FirestoreLead } from '../types/lead'
import * as admin from 'firebase-admin'

/**
 * Saves a lead from an ElevenLabs post-call webhook to Firestore.
 * 
 * Parses the incoming webhook payload and creates a document in the
 * 'leads' collection with standardized field names. Missing fields
 * are set to null.
 * 
 * @param payload - The webhook payload from ElevenLabs
 * @throws Error if Firestore write fails
 */
export async function saveElevenLabsCallLead(
  payload: ElevenLabsWebhookPayload
): Promise<void> {
  // Log the raw payload for debugging
  console.log('Received ElevenLabs webhook payload:')
  console.dir(payload, { depth: 4 })

  // Parse and normalize the payload into FirestoreLead structure
  const leadData: Omit<FirestoreLead, 'createdAt'> = {
    source: 'elevenlabs-phone',
    name: payload.customer_name || null,
    email: payload.customer_email || null,
    phone: payload.customer_phone || null,
    departureCity: payload.departure_city || null,
    destinationCity: payload.destination_city || null,
    travelDates: payload.travel_dates || null,
    passengers: typeof payload.passengers === 'string' 
      ? parseInt(payload.passengers, 10) || null
      : payload.passengers || null,
    airlinePreference: payload.airline_preference || null,
    specialRequirements: payload.special_requirements || null,
    summary: payload.summary || 'No summary provided',
    transcript: payload.transcript || '',
    language: payload.language === 'en' || payload.language === 'fr' 
      ? payload.language 
      : null,
  }

  // Add server timestamp for createdAt
  const firestoreLead: FirestoreLead = {
    ...leadData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  // Write to Firestore
  try {
    await db.collection('leads').add(firestoreLead)
    console.log('Successfully saved lead to Firestore')
  } catch (error) {
    console.error('Error saving lead to Firestore:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide helpful error message if Firebase is not configured
    if (errorMessage.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
      throw new Error(
        'Firebase is not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable in your deployment settings.'
      )
    }
    
    throw new Error(`Failed to save lead to Firestore: ${errorMessage}`)
  }
}

