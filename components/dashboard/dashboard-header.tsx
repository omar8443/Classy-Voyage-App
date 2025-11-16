'use client'

import { Plane, Search } from 'lucide-react'

interface DashboardHeaderProps {
  onSearchChange: (query: string) => void
}

export function DashboardHeader({ onSearchChange }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Classy Voyage
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Flight Booking</p>
            </div>
          </div>

          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads, destinations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
