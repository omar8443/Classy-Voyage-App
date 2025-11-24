/**
 * Firebase Admin SDK initialization for server-side use only.
 * 
 * This module provides a singleton Firebase Admin instance initialized with
 * a service account key from environment variables. The Firestore database
 * instance is exported for use in API routes and server-side code.
 * 
 * IMPORTANT: This module should NEVER be imported in client components.
 * Only use in API routes, server components, or server actions.
 * 
 * The initialization is lazy - Firebase is only initialized when db is first accessed.
 * This allows the app to start even if FIREBASE_SERVICE_ACCOUNT_KEY is not set,
 * though API routes that use Firebase will fail gracefully with proper error messages.
 */

import * as admin from 'firebase-admin'

let dbInstance: admin.firestore.Firestore | null = null
let initializationError: Error | null = null

/**
 * Initializes Firebase Admin if not already initialized.
 * This is called lazily when db is accessed for the first time.
 */
function initializeFirebase(): admin.firestore.Firestore {
  // Return cached instance if already initialized
  if (dbInstance) {
    return dbInstance
  }

  // Throw cached error if initialization already failed
  if (initializationError) {
    throw initializationError
  }

  // Check if already initialized by Firebase Admin
  if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

    if (!serviceAccountKey) {
      initializationError = new Error(
        'Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable. ' +
        'Please provide a stringified JSON service account key. ' +
        'Set this in your deployment environment variables (e.g., Vercel, Netlify, etc.)'
      )
      throw initializationError
    }

    let serviceAccount: admin.ServiceAccount
    try {
      serviceAccount = JSON.parse(serviceAccountKey)
    } catch (error) {
      initializationError = new Error(
        'Invalid FIREBASE_SERVICE_ACCOUNT_KEY: must be valid JSON. ' +
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      throw initializationError
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    } catch (error) {
      initializationError = new Error(
        `Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      throw initializationError
    }
  }

  // Get Firestore instance
  dbInstance = admin.firestore()
  return dbInstance
}

/**
 * Get Firestore database instance (lazy initialization).
 * 
 * @throws Error if FIREBASE_SERVICE_ACCOUNT_KEY is not set or invalid
 */
function getDb(): admin.firestore.Firestore {
  return initializeFirebase()
}

/**
 * Export db as a Proxy that lazily initializes Firebase.
 * This allows the module to be imported without throwing errors,
 * but will throw when db methods are actually called if Firebase isn't configured.
 */
export const db = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop, receiver) {
    const db = getDb()
    const value = Reflect.get(db, prop, db)
    if (typeof value === 'function') {
      return value.bind(db)
    }
    return value
  },
})

