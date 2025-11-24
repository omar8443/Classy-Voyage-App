/**
 * Firebase Admin SDK initialization for server-side use only.
 * 
 * This module provides a singleton Firebase Admin instance initialized with
 * a service account key from environment variables. The Firestore database
 * instance is exported for use in API routes and server-side code.
 * 
 * IMPORTANT: This module should NEVER be imported in client components.
 * Only use in API routes, server components, or server actions.
 */

import * as admin from 'firebase-admin'

// Singleton pattern: reuse existing app if already initialized
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

  if (!serviceAccountKey) {
    throw new Error(
      'Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable. ' +
      'Please provide a stringified JSON service account key.'
    )
  }

  let serviceAccount: admin.ServiceAccount
  try {
    serviceAccount = JSON.parse(serviceAccountKey)
  } catch (error) {
    throw new Error(
      'Invalid FIREBASE_SERVICE_ACCOUNT_KEY: must be valid JSON. ' +
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

// Export Firestore database instance
export const db = admin.firestore()

