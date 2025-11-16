'use client'

import { useState, useTransition } from 'react'
import { Lead } from '@/app/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plane,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  TrendingUp,
  Mail,
  Phone as PhoneIcon,
  MapPin
} from 'lucide-react'
import { generateLeadSummary, generateLeadScore } from '@/app/lib/actions'
import { useToast } from '@/components/ui/use-toast'
import { ChatInterface } from './chat-interface'
import { VoiceInterface } from './voice-interface'

interface LeadDetailsSheetProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateLead: (lead: Lead) => void
}

export function LeadDetailsSheet({
  lead,
  open,
  onOpenChange,
  onUpdateLead
}: LeadDetailsSheetProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  if (!lead) return null

  const handleGenerateSummary = () => {
    startTransition(async () => {
      const result = await generateLeadSummary(lead)
      if (result.success && result.data) {
        const updatedLead = { ...lead, aiSummary: result.data }
        onUpdateLead(updatedLead)
        toast({
          title: 'Summary Generated',
          description: 'AI summary has been created successfully.',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to generate summary',
          variant: 'destructive',
        })
      }
    })
  }

  const handleGenerateScore = () => {
    startTransition(async () => {
      const result = await generateLeadScore(lead)
      if (result.success && result.data) {
        const updatedLead = { ...lead, leadScore: result.data.score }
        onUpdateLead(updatedLead)
        toast({
          title: 'Lead Score Generated',
          description: `Score: ${result.data.score}/100 - ${result.data.reasoning}`,
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to generate score',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneIcon className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="capitalize">{lead.status}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {lead.interactionType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {lead.flightInquiry.origin} → {lead.flightInquiry.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-600">
                      {lead.flightInquiry.departureDate}
                      {lead.flightInquiry.returnDate && ` - ${lead.flightInquiry.returnDate}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-amber-500" />
                    <span className="text-gray-600">
                      {lead.flightInquiry.passengers.adults}A
                      {lead.flightInquiry.passengers.children > 0 && ` ${lead.flightInquiry.passengers.children}C`}
                      {lead.flightInquiry.passengers.infants > 0 && ` ${lead.flightInquiry.passengers.infants}I`}
                    </span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {lead.flightInquiry.class}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                AI Insights
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleGenerateSummary}
                  disabled={isPending}
                >
                  Generate Summary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateScore}
                  disabled={isPending}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Score Lead
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.aiSummary && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Summary</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{lead.aiSummary}</p>
                  </div>
                )}
                {lead.leadScore && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Lead Score</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all"
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {lead.leadScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="interaction" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="interaction">
                {lead.interactionType === 'chat' ? 'Chat History' : 'Voice Transcripts'}
              </TabsTrigger>
              <TabsTrigger value="live">
                {lead.interactionType === 'chat' ? 'Live Chat' : 'Live Voice'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interaction" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lead.interactionType === 'chat' ? 'Chat History' : 'Voice Call Transcript'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.interactionType === 'chat' && lead.chatHistory ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {lead.chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : lead.voiceTranscripts ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {lead.voiceTranscripts.map((transcript) => (
                        <div
                          key={transcript.id}
                          className={`flex ${transcript.speaker === 'customer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              transcript.speaker === 'customer'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <PhoneIcon className="h-3 w-3" />
                              <span className="text-xs font-semibold capitalize">
                                {transcript.speaker}
                              </span>
                            </div>
                            <p className="text-sm">{transcript.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {new Date(transcript.timestamp).toLocaleTimeString()} ({transcript.duration}s)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="live">
              {lead.interactionType === 'chat' ? (
                <ChatInterface leadId={lead.id} />
              ) : (
                <VoiceInterface leadId={lead.id} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
