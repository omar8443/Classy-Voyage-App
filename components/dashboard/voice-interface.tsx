'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mic, MicOff, PhoneOff } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface VoiceInterfaceProps {
  leadId: string
}

export function VoiceInterface({ leadId }: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([])
  const { toast } = useToast()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1]
        if (result.isFinal) {
          setTranscript(prev => [...prev, {
            speaker: 'Customer',
            text: result[0].transcript
          }])
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        toast({
          title: 'Recognition Error',
          description: 'There was an error with speech recognition',
          variant: 'destructive',
        })
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [toast])

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Audio data available:', event.data)
        }
      }

      setIsConnected(true)
      toast({
        title: 'Call Started',
        description: 'Voice call initiated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      })
    }
  }

  const endCall = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
    setIsConnected(false)
    setIsRecording(false)
    toast({
      title: 'Call Ended',
      description: 'Voice call has been disconnected',
    })
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in this browser',
        variant: 'destructive',
      })
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
      mediaRecorderRef.current?.start()
    }
  }

  return (
    <Card className="border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-green-600" />
          Live Voice Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          {!isConnected ? (
            <Button
              size="lg"
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700"
            >
              <Phone className="mr-2 h-5 w-5" />
              Start Call
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant={isRecording ? 'destructive' : 'default'}
                onClick={toggleRecording}
                className={!isRecording ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {isRecording ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={endCall}
              >
                <PhoneOff className="mr-2 h-5 w-5" />
                End Call
              </Button>
            </>
          )}
        </div>

        {isConnected && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Live Transcript</h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
              {transcript.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">
                  {isRecording ? 'Listening...' : 'Start recording to see transcript'}
                </p>
              ) : (
                transcript.map((item, index) => (
                  <div key={index} className="bg-white p-2 rounded shadow-sm">
                    <span className="font-semibold text-xs text-green-600">{item.speaker}:</span>
                    <p className="text-sm text-gray-800 mt-1">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a live voice agent interface. Click "Start Call" to initiate a voice connection.
            The AI agent will interact with the customer in real-time using speech recognition and text-to-speech.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
