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
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-purple-100 text-purple-700 border-purple-200',
  qualified: 'bg-green-100 text-green-700 border-green-200',
  proposal: 'bg-amber-100 text-amber-700 border-amber-200',
  negotiation: 'bg-orange-100 text-orange-700 border-orange-200',
  won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  lost: 'bg-gray-100 text-gray-700 border-gray-200',
}

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  return (
    <Card className="border-none shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                onClick={() => onSelectLead(lead)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {lead.flightInquiry.origin}
                      </div>
                      <div className="text-gray-500">
                        to {lead.flightInquiry.destination}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="capitalize">
                    {lead.flightInquiry.class}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {lead.interactionType === 'chat' ? (
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Phone className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm capitalize text-gray-600">
                      {lead.interactionType}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={statusColors[lead.status]}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.leadScore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {lead.leadScore}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="ghost"
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
