import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { mockLeads } from './lib/data'

export default function Home() {
  return <DashboardPage initialLeads={mockLeads} />
}
