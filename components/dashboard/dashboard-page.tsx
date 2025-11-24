'use client'

import { useState } from 'react'
import { Lead } from '@/app/lib/types'
import { LeadTable } from './lead-table'
import { LeadDetailsSheet } from './lead-details-sheet'
import { DashboardHeader } from './dashboard-header'
import { StatsCards } from './stats-cards'

interface DashboardPageProps {
  initialLeads: Lead[]
}

export function DashboardPage({ initialLeads }: DashboardPageProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.flightInquiry.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.flightInquiry.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l))
    setSelectedLead(updatedLead)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f]">
      <DashboardHeader onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-10">
        <StatsCards leads={leads} />

        <div className="mt-10">
          <LeadTable
            leads={filteredLeads}
            onSelectLead={setSelectedLead}
          />
        </div>
      </main>

      <LeadDetailsSheet
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        onUpdateLead={handleUpdateLead}
      />
    </div>
  )
}
