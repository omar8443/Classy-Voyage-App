# Classy Voyage Setup Guide

## Quick Start

The development server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://10.122.98.179:3000

## Required Setup

### 1. Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
GOOGLE_GENAI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Google AI API key.

### 3. Restart the Development Server

After adding your API key:

```bash
# Stop the current server (Ctrl+C in the terminal)
npm run dev
```

## Features Available

### Dashboard
- ✅ View all flight booking leads
- ✅ Search functionality (name, email, destination)
- ✅ Real-time statistics and metrics
- ✅ Beautiful flight agency aesthetic

### Lead Management
- ✅ Detailed lead information
- ✅ Flight inquiry details
- ✅ Customer contact information
- ✅ Lead status tracking

### AI Features

#### 1. AI Summary Generation
Click "Generate Summary" to create an AI-powered summary of customer interactions.

#### 2. AI Lead Scoring
Click "Score Lead" to automatically calculate lead quality (0-100).

#### 3. Live Chat Agent
- Navigate to any lead
- Click the "Live Chat" tab
- Start chatting with the AI agent
- Powered by Gemini 2.5 Flash for intelligent responses

#### 4. Live Voice Agent
- Navigate to any lead
- Click the "Live Voice" tab
- Click "Start Call" to initiate voice interaction
- Uses Web Speech API for real-time transcription

**Note**: Voice features work best in Chrome, Edge, or Safari.

## Testing the Application

### 1. Browse Mock Data
The app comes with 5 sample leads showing different scenarios:
- Business class to Paris (Chat)
- Urgent Tokyo trip (Voice)
- Family vacation to Orlando (Chat)
- Luxury Dubai anniversary (Voice)
- London conference (Chat)

### 2. Try the Live Chat
1. Click on any lead in the table
2. Go to the "Live Chat" tab
3. Type a message like: "I need help finding a flight to London"
4. The AI will respond with helpful information

### 3. Test Lead Scoring
1. Select a lead
2. Click "Score Lead" in the AI Insights section
3. See the automatically generated score and reasoning

## Project Architecture

```
Classy Voyage/
├── app/                    # Next.js App Router
│   ├── api/chat/          # Chat API endpoint
│   ├── lib/               # Business logic
│   │   ├── actions.ts     # Server actions for AI
│   │   ├── data.ts        # Mock lead data
│   │   └── types.ts       # TypeScript definitions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/
│   ├── dashboard/         # Main application components
│   │   ├── chat-interface.tsx      # Live chat UI
│   │   ├── voice-interface.tsx     # Live voice UI
│   │   ├── dashboard-page.tsx      # Main dashboard
│   │   ├── dashboard-header.tsx    # Header with search
│   │   ├── stats-cards.tsx         # Statistics cards
│   │   ├── lead-table.tsx          # Leads table
│   │   └── lead-details-sheet.tsx  # Lead details modal
│   └── ui/                # Reusable UI components (ShadCN)
│
├── ai/
│   ├── genkit.ts          # Genkit configuration
│   └── flows/             # AI flows
│       ├── lead-summary.ts    # Summary generation
│       └── lead-score.ts      # Lead scoring
│
└── lib/
    └── utils.ts           # Utility functions
```

## Customization

### Changing the Theme
Edit [app/globals.css](app/globals.css) to modify:
- Primary colors (blue/indigo gradient)
- Secondary colors
- Dark mode colors

### Adding More Leads
Edit [app/lib/data.ts](app/lib/data.ts) to add more mock leads or connect to a real database.

### Modifying AI Behavior
Edit [app/api/chat/route.ts](app/api/chat/route.ts) to change:
- AI personality
- Response style
- System prompts

## Browser Requirements

### For Full Functionality:
- **Chrome** (Recommended) - All features work
- **Edge** - All features work
- **Safari** - All features work

### Limited Support:
- **Firefox** - Chat works, voice features limited

## Troubleshooting

### Chat Agent Not Responding
1. Check that `.env` file exists with valid `GOOGLE_GENAI_API_KEY`
2. Restart the development server
3. Check browser console for errors

### Voice Agent Not Working
1. Grant microphone permissions when prompted
2. Use Chrome, Edge, or Safari
3. Check that you're on HTTPS or localhost

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add `GOOGLE_GENAI_API_KEY` in Environment Variables
4. Deploy

### Other Platforms
```bash
npm run build
npm start
```

## Support

For issues or questions:
- Check the [README.md](README.md)
- Open an issue on GitHub
- Review the code documentation

---

Enjoy using Classy Voyage! ✈️
