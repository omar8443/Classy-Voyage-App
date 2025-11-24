/**
 * Leads API endpoint.
 * 
 * This API route fetches leads from Firestore and returns them as JSON.
 * Leads are ordered by creation date (newest first) and limited to 100 results.
 * 
 * GET /api/leads
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'
import { Lead } from '@/app/lib/types'
import { FirestoreLead } from '@/types/lead'

/**
 * Maps a Firestore lead document to the application Lead structure.
 * Transforms the flat Firestore structure into the nested Lead format
 * expected by the dashboard UI.
 */
function mapFirestoreLeadToLead(docId: string, data: FirestoreLead): Lead {
  // Parse travel dates if available (format: "YYYY-MM-DD" or "YYYY-MM-DD to YYYY-MM-DD")
  const travelDates = data.travelDates || ''
  const [departureDate, returnDate] = travelDates.includes(' to ')
    ? travelDates.split(' to ')
    : [travelDates, undefined]

  // Parse passengers (assuming total passengers, defaulting to adults)
  const passengers = data.passengers || 1

  return {
    id: docId,
    name: data.name || 'Unknown caller',
    email: data.email || '',
    phone: data.phone || '',
    status: 'new' as const,
    interactionType: 'voice' as const,
    voiceTranscripts: data.transcript
      ? [
          {
            id: `${docId}-transcript`,
            speaker: 'customer' as const,
            text: data.transcript,
            timestamp: data.createdAt?.toDate() || new Date(),
            duration: 0,
          },
        ]
      : undefined,
    flightInquiry: {
      origin: data.departureCity || 'Unknown',
      destination: data.destinationCity || 'Unknown',
      departureDate: departureDate || '',
      returnDate: returnDate,
      passengers: {
        adults: passengers,
        children: 0,
        infants: 0,
      },
      class: 'economy' as const,
    },
    aiSummary: data.summary || undefined,
    leadScore: undefined,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
    notes: data.specialRequirements || undefined,
  }
}

export async function GET() {
  try {
    // Query leads collection ordered by createdAt descending, limit 100
    const leadsSnapshot = await db
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    // Map Firestore documents to Lead objects
    const leads: Lead[] = leadsSnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreLead
      return mapFirestoreLeadToLead(doc.id, data)
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads from Firestore:', error)
    
    // Check if it's a Firebase initialization error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
      return NextResponse.json(
        {
          error: 'Firebase not configured',
          message: 'Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable in your deployment settings.',
        },
        { status: 503 } // Service Unavailable
      )
    }
    
    return NextResponse.json(
      {
        error: 'Failed to fetch leads',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

