'use client'

import { Lead } from '@/app/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plane, MessageCircle, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LeadTableProps {
  leads: Lead[]
  onSelectLead: (lead: Lead) => void
}

const statusColors: Record<string, string> = {
  new: 'bg-indigo-200/10 text-indigo-400 border-indigo-200/10',
  contacted: 'bg-purple-200/10 text-purple-400 border-purple-200/10',
  qualified: 'bg-emerald-200/10 text-emerald-400 border-emerald-200/10',
  proposal: 'bg-amber-200/10 text-amber-400 border-amber-200/10',
  negotiation: 'bg-orange-200/10 text-orange-400 border-orange-200/10',
  won: 'bg-emerald-200/10 text-emerald-400 border-emerald-200/10',
  lost: 'bg-white/5 text-white/40 border-white/5',
}

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  return (
    <Card className="border border-white/5 shadow-sm rounded-xl overflow-hidden bg-[#141418]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#111113] border-y border-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#141418] divide-y divide-white/5">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-white/5 transition-all duration-200 cursor-pointer group"
                onClick={() => onSelectLead(lead)}
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <div className="font-semibold text-white tracking-tight">{lead.name || 'Unknown caller'}</div>
                    <div className="text-sm text-white/70 mt-0.5">{lead.email || '-'}</div>
                    {lead.aiSummary && (
                      <div className="text-xs text-white/50 mt-1 line-clamp-1 max-w-xs">
                        {lead.aiSummary.length > 60 ? `${lead.aiSummary.substring(0, 60)}...` : lead.aiSummary}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <Plane className="h-4 w-4 text-white/80" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-white">
                        {lead.flightInquiry.origin}
                      </div>
                      <div className="text-white/70 text-xs">
                        to {lead.flightInquiry.destination}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Badge variant="outline" className="capitalize border-white/10 text-white/80 bg-white/5">
                    {lead.flightInquiry.class}
                  </Badge>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    {lead.interactionType === 'chat' ? (
                      <>
                        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                          <MessageCircle className="h-4 w-4 text-white/80" />
                        </div>
                        <span className="text-sm capitalize text-white/80 font-medium">
                          {lead.interactionType}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                          <Phone className="h-4 w-4 text-white/80" />
                        </div>
                        <Badge className="bg-indigo-200/10 text-indigo-400 border-indigo-200/10 rounded-full px-2 py-0.5 text-xs font-medium border">
                          Phone
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Badge className={`${statusColors[lead.status]} rounded-full px-3 py-1 text-xs font-medium border`}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {lead.leadScore ? (
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500/40 to-purple-500/40 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-white min-w-[2rem]">
                        {lead.leadScore}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-white/50">-</span>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/5 hover:text-white text-white/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectLead(lead)
                    }}
                  >
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
