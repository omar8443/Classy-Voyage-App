import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { Lead } from './lib/types'

async function fetchLeads(): Promise<Lead[]> {
  try {
    // In server components, we can use absolute URLs or relative URLs
    // For production, set NEXT_PUBLIC_BASE_URL environment variable
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    const response = await fetch(`${baseUrl}/api/leads`, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      console.error('Failed to fetch leads:', response.statusText)
      return []
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export default async function Home() {
  const leads = await fetchLeads()
  return <DashboardPage initialLeads={leads} />
}
