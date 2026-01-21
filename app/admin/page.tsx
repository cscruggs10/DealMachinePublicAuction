'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'events' | 'vehicles'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('events')
  const [eventForm, setEventForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    externalLink: '',
    status: 'UPCOMING',
  })
  const [vehicleForm, setVehicleForm] = useState({
    vin: '',
    year: '',
    make: '',
    model: '',
    trim: '',
    status: 'DRAFT',
    aiDisclosures: '',
    videoUrl: '',
    price: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/sale-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create sale event')
      }

      setMessage({ type: 'success', text: 'Sale event created successfully!' })
      setEventForm({
        title: '',
        startDate: '',
        endDate: '',
        externalLink: '',
        status: 'UPCOMING',
      })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vehicleForm,
          year: parseInt(vehicleForm.year),
          price: vehicleForm.price ? parseFloat(vehicleForm.price) : null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create vehicle')
      }

      setMessage({ type: 'success', text: 'Vehicle created successfully!' })
      setVehicleForm({
        vin: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        status: 'DRAFT',
        aiDisclosures: '',
        videoUrl: '',
        price: '',
      })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-brand">Admin Dashboard</h1>
        <Link href="/" className="text-deep-blue hover:text-action-orange text-sm">
          Back to Home
        </Link>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'events'
                ? 'bg-deep-blue text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sale Events
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'vehicles'
                ? 'bg-deep-blue text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Vehicles
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'events' && (
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-brand mb-4">
                Create Sale Event
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full"
                  placeholder="e.g., January 2025 Public Auction"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External Link
                </label>
                <input
                  type="url"
                  value={eventForm.externalLink}
                  onChange={(e) => setEventForm({ ...eventForm, externalLink: e.target.value })}
                  className="w-full"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  className="w-full"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Sale Event'}
              </button>
            </form>
          )}

          {activeTab === 'vehicles' && (
            <form onSubmit={handleVehicleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-brand mb-4">
                Create Vehicle
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIN *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleForm.vin}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value.toUpperCase() })}
                  className="w-full font-mono"
                  placeholder="17-character VIN"
                  maxLength={17}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                    className="w-full"
                    placeholder="2024"
                    min="1900"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                    className="w-full"
                    placeholder="e.g., Toyota"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full"
                    placeholder="e.g., Camry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trim
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.trim}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, trim: e.target.value })}
                    className="w-full"
                    placeholder="e.g., SE"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                    className="w-full"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="INVENTORY">Inventory</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={vehicleForm.price}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                    className="w-full"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <input
                  type="url"
                  value={vehicleForm.videoUrl}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, videoUrl: e.target.value })}
                  className="w-full"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Disclosures
                </label>
                <textarea
                  value={vehicleForm.aiDisclosures}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, aiDisclosures: e.target.value })}
                  className="w-full h-24"
                  placeholder="Enter AI-generated disclosures or condition notes..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Vehicle'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
