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
          <DialogTitle className="text-2xl font-display font-semibold text-white tracking-tight">
            {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <Card className="border border-white/5 shadow-sm rounded-xl bg-[#141418]">
              <CardContent className="p-6 md:p-7">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <Mail className="h-4 w-4 text-white/80" />
                    </div>
                    <span className="text-white font-medium">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <PhoneIcon className="h-4 w-4 text-white/80" />
                    </div>
                    <span className="text-white font-medium">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 pt-2">
                    <Badge className={`capitalize rounded-full px-3 py-1 text-xs font-medium border ${statusColors[lead.status]}`}>{lead.status}</Badge>
                    <Badge variant="outline" className="capitalize rounded-full px-3 py-1 text-xs font-medium border-white/10 text-white/80 bg-white/5">
                      {lead.interactionType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/5 shadow-sm rounded-xl bg-[#141418]">
              <CardContent className="p-6 md:p-7">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <MapPin className="h-4 w-4 text-white/80" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {lead.flightInquiry.origin} → {lead.flightInquiry.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <Calendar className="h-4 w-4 text-white/80" />
                    </div>
                    <span className="text-white font-medium">
                      {lead.flightInquiry.departureDate}
                      {lead.flightInquiry.returnDate && ` - ${lead.flightInquiry.returnDate}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <Users className="h-4 w-4 text-white/80" />
                    </div>
                    <span className="text-white font-medium">
                      {lead.flightInquiry.passengers.adults}A
                      {lead.flightInquiry.passengers.children > 0 && ` ${lead.flightInquiry.passengers.children}C`}
                      {lead.flightInquiry.passengers.infants > 0 && ` ${lead.flightInquiry.passengers.infants}I`}
                    </span>
                    <Badge variant="outline" className="ml-2 capitalize rounded-full px-3 py-1 text-xs font-medium border-white/10 text-white/80 bg-white/5">
                      {lead.flightInquiry.class}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-white/5 shadow-sm rounded-xl bg-[#141418]">
            <CardHeader className="flex flex-row items-center justify-between p-6 md:p-7 pb-4">
              <CardTitle className="text-lg flex items-center gap-2.5 font-semibold text-white tracking-tight">
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>
                AI Insights
              </CardTitle>
              <div className="flex gap-2.5">
                <Button
                  size="sm"
                  onClick={handleGenerateSummary}
                  disabled={isPending}
                  className="rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all"
                >
                  Generate Summary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateScore}
                  disabled={isPending}
                  className="rounded-lg border-white/10 hover:bg-white/5 text-white/90 transition-all"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Score Lead
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-7 pt-0">
              <div className="space-y-5">
                {lead.aiSummary && (
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-2.5">Summary</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{lead.aiSummary}</p>
                  </div>
                )}
                {lead.leadScore && (
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-3">Lead Score</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500/40 to-purple-500/40 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="text-2xl font-semibold text-white">
                        {lead.leadScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="interaction" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <TabsTrigger value="interaction" className="rounded-lg data-[state=active]:bg-white/5 data-[state=active]:text-white/90 text-white/50 font-medium transition-all">
                {lead.interactionType === 'chat' ? 'Chat History' : 'Voice Transcripts'}
              </TabsTrigger>
              <TabsTrigger value="live" className="rounded-lg data-[state=active]:bg-white/5 data-[state=active]:text-white/90 text-white/50 font-medium transition-all">
                {lead.interactionType === 'chat' ? 'Live Chat' : 'Live Voice'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interaction" className="space-y-4">
              <Card className="border border-white/5 shadow-sm rounded-xl bg-[#141418]">
                <CardHeader className="p-6 md:p-7 pb-4">
                  <CardTitle className="text-lg font-semibold text-white tracking-tight">
                    {lead.interactionType === 'chat' ? 'Chat History' : 'Voice Call Transcript'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-7 pt-0">
                  {lead.interactionType === 'chat' && lead.chatHistory ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {lead.chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3.5 ${
                              message.role === 'user'
                                ? 'bg-indigo-500/20 text-white/90 border border-indigo-500/20'
                                : 'bg-white/5 text-white/70 border border-white/5'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <span className={`text-xs mt-1.5 block ${message.role === 'user' ? 'text-white/50' : 'text-white/40'}`}>
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
                            className={`max-w-[80%] rounded-xl p-3.5 ${
                              transcript.speaker === 'customer'
                                ? 'bg-emerald-500/20 text-white/90 border border-emerald-500/20'
                                : 'bg-white/5 text-white/70 border border-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <PhoneIcon className="h-3 w-3" />
                              <span className="text-xs font-semibold capitalize">
                                {transcript.speaker}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{transcript.text}</p>
                            <span className={`text-xs mt-1.5 block ${transcript.speaker === 'customer' ? 'text-white/50' : 'text-white/40'}`}>
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
