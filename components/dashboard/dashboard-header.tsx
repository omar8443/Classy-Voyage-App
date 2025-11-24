'use client'

import { Plane, Search } from 'lucide-react'

interface DashboardHeaderProps {
  onSearchChange: (query: string) => void
}

export function DashboardHeader({ onSearchChange }: DashboardHeaderProps) {
  return (
    <header className="bg-[#0d0d0f]/80 backdrop-blur-sm border-b border-white/5">
      <div className="container mx-auto px-6 py-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <Plane className="h-6 w-6 text-white/80" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-semibold text-white tracking-tight">
                Classy Voyage
              </h1>
              <p className="text-sm text-white/70 uppercase text-xs font-medium tracking-wide">AI Assistant</p>
            </div>
          </div>

          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search leads, phone numbers, destinations..."
              className="w-full pl-11 pr-4 py-2.5 border border-white/5 rounded-xl bg-[#141418] text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/10 transition-all"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
