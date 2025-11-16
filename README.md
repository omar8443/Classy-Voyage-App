# Classy Voyage - AI-Powered Flight Booking Platform

A premium flight booking and lead management system powered by AI voice and chat agents.

## Features

- **AI-Powered Chat Agent**: Real-time chat interface powered by Google's Gemini 2.5 Flash
- **AI Voice Agent**: Live voice interaction with speech recognition and transcription
- **Lead Management**: Track and manage flight booking leads with AI-generated insights
- **Lead Scoring**: Automated lead scoring using AI analysis
- **Beautiful UI**: Modern, aesthetic flight agency design with Tailwind CSS and ShadCN UI
- **Real-time Analytics**: Dashboard with key metrics and statistics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI
- **AI**: Google Genkit with Gemini 2.5 Flash
- **Voice**: Web Speech API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google AI API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/omar8443/Classy-Voyage-.git
cd Classy-Voyage-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Google AI API key:
```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard
- View all leads in the main table
- Search leads by name, email, or destination
- Click on any lead to view detailed information

### Lead Details
- View customer information and flight inquiry details
- Generate AI summaries of customer interactions
- Calculate lead scores using AI analysis
- Access chat history or voice transcripts

### Live Chat Agent
- Click "Live Chat" tab to start a conversation
- The AI agent helps with flight bookings and inquiries
- Powered by Gemini 2.5 Flash for intelligent responses

### Live Voice Agent
- Click "Live Voice" tab to initiate a voice call
- Uses Web Speech API for speech recognition
- Real-time transcription of voice conversations

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/          # Chat API endpoint
│   ├── lib/
│   │   ├── actions.ts     # Server actions
│   │   ├── data.ts        # Mock data
│   │   └── types.ts       # TypeScript types
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── dashboard/         # Dashboard components
│   │   ├── chat-interface.tsx
│   │   ├── voice-interface.tsx
│   │   ├── dashboard-page.tsx
│   │   ├── lead-table.tsx
│   │   └── lead-details-sheet.tsx
│   └── ui/                # Reusable UI components
├── ai/
│   ├── genkit.ts          # Genkit configuration
│   └── flows/             # AI flows
│       ├── lead-summary.ts
│       └── lead-score.ts
└── lib/
    └── utils.ts           # Utility functions
```

## Environment Variables

- `GOOGLE_GENAI_API_KEY`: Your Google AI API key for Gemini

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Browser Compatibility

- **Chat Agent**: Works in all modern browsers
- **Voice Agent**: Requires browsers with Web Speech API support (Chrome, Edge, Safari)

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

---

Built with by Classy Voyage Team
