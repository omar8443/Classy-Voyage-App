# Environment Variables Setup Guide

## Why Your App Breaks After Git Push

When you push to git and deploy, your **environment variables are not included** (they're in `.gitignore` for security). You need to set them in your deployment platform.

## Required Environment Variables

### For Firebase (Required for ElevenLabs webhooks)

1. **FIREBASE_SERVICE_ACCOUNT_KEY**
   - Get your Firebase service account JSON:
     1. Go to [Firebase Console](https://console.firebase.google.com/)
     2. Select your project
     3. Go to Project Settings → Service Accounts
     4. Click "Generate New Private Key"
     5. Download the JSON file
   - Convert the JSON to a string:
     ```bash
     # On Mac/Linux:
     cat path/to/serviceAccountKey.json | jq -c
     
     # Or manually: Copy the entire JSON and remove all newlines/spaces
     ```
   - Set in your deployment platform (Vercel, Netlify, etc.) as a single-line string

### For Production API Calls (Optional)

- **NEXT_PUBLIC_BASE_URL**: Your production URL (e.g., `https://your-app.vercel.app`)
  - If not set, the app will try to auto-detect from Vercel or default to localhost

### For ElevenLabs Webhook Security (Optional, Recommended)

- **ELEVENLABS_WEBHOOK_SECRET**: Secret key for HMAC signature verification
  - Get this from your ElevenLabs dashboard webhook settings

## Setting Environment Variables

### Vercel
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable
4. Redeploy your app

### Netlify
1. Go to Site settings → Environment variables
2. Add each variable
3. Redeploy your site

### Other Platforms
Check your platform's documentation for setting environment variables.

## Testing Locally

Create a `.env.local` file in your project root:

```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ELEVENLABS_WEBHOOK_SECRET=your_secret_here
```

**Important**: Never commit `.env.local` to git (it's already in `.gitignore`).

## Troubleshooting

### Error: "Missing FIREBASE_SERVICE_ACCOUNT_KEY"
- Make sure you've set the environment variable in your deployment platform
- Verify it's a valid JSON string (no newlines, properly escaped)
- Redeploy after adding the variable

### Error: "Invalid FIREBASE_SERVICE_ACCOUNT_KEY"
- Check that the JSON is valid (use a JSON validator)
- Make sure there are no extra spaces or newlines
- The entire JSON should be on a single line

### App works locally but not after deployment
- Environment variables are different between local and production
- Set the same variables in your deployment platform
- Make sure to redeploy after adding variables

