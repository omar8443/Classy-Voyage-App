'use client'

import { Lead } from '@/app/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Target } from 'lucide-react'

interface StatsCardsProps {
  leads: Lead[]
}

export function StatsCards({ leads }: StatsCardsProps) {
  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(l => ['qualified', 'proposal', 'negotiation'].includes(l.status)).length

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
    },
    {
      title: 'Qualified Leads',
      value: qualifiedLeads,
      icon: Target,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border border-white/5 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-[#141418] hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center justify-between pb-3 p-6 md:p-7">
              <CardTitle className="text-xs font-medium text-white/70 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                <Icon className="h-5 w-5 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-7 pt-0">
              <div className="text-3xl font-semibold text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
