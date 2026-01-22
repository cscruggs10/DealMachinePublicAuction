'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Tab = 'events' | 'vehicles' | 'inventory'

interface SaleEvent {
  id: string
  title: string
  startDate: string
  endDate: string
  status: string
  _count?: { vehicles: number }
}

interface Vehicle {
  id: string
  vin: string
  year: number
  make: string
  model: string
  trim: string | null
  status: string
  price: number | null
  finalSalePrice: number | null
  saleEvent: SaleEvent | null
  saleEventId: string | null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('events')
  const [saleEvents, setSaleEvents] = useState<SaleEvent[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
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
    saleEventId: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [decoding, setDecoding] = useState(false)
  const [soldModal, setSoldModal] = useState<{ vehicleId: string; vin: string } | null>(null)
  const [finalPrice, setFinalPrice] = useState('')
  const [relistModal, setRelistModal] = useState<Vehicle | null>(null)
  const [relistEventId, setRelistEventId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editModal, setEditModal] = useState<Vehicle | null>(null)
  const [editForm, setEditForm] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    status: '',
    aiDisclosures: '',
    videoUrl: '',
    price: '',
    saleEventId: '',
  })
  const [editUploading, setEditUploading] = useState(false)

  useEffect(() => {
    fetchSaleEvents()
    fetchVehicles()
  }, [])

  const fetchSaleEvents = async () => {
    try {
      const res = await fetch('/api/sale-events')
      if (res.ok) {
        const data = await res.json()
        setSaleEvents(data)
      }
    } catch (err) {
      console.error('Failed to fetch sale events:', err)
    }
  }

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles')
      if (res.ok) {
        const data = await res.json()
        setVehicles(data)
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err)
    }
  }

  const handleDecodeVin = async () => {
    if (vehicleForm.vin.length !== 17) {
      setMessage({ type: 'error', text: 'VIN must be 17 characters' })
      return
    }

    setDecoding(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/vin-decode?vin=${vehicleForm.vin}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to decode VIN')
      }

      setVehicleForm({
        ...vehicleForm,
        year: data.year.toString(),
        make: data.make,
        model: data.model,
        trim: data.trim || '',
      })
      setMessage({ type: 'success', text: 'VIN decoded successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to decode VIN' })
    } finally {
      setDecoding(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      // Get upload signature from our API
      const signatureRes = await fetch('/api/upload')
      if (!signatureRes.ok) {
        throw new Error('Failed to get upload signature')
      }
      const { signature, timestamp, cloudName, apiKey, folder } = await signatureRes.json()

      // Upload directly to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp.toString())
      formData.append('api_key', apiKey)
      formData.append('folder', folder)
      formData.append('resource_type', 'video')

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!cloudinaryRes.ok) {
        const error = await cloudinaryRes.json()
        throw new Error(error.error?.message || 'Failed to upload video')
      }

      const data = await cloudinaryRes.json()
      setVehicleForm({ ...vehicleForm, videoUrl: data.secure_url })
      setMessage({ type: 'success', text: 'Video uploaded successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to upload video' })
    } finally {
      setUploading(false)
    }
  }

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
      fetchSaleEvents()
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
          saleEventId: vehicleForm.saleEventId || null,
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
        saleEventId: '',
      })
      fetchVehicles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsSold = async () => {
    if (!soldModal || !finalPrice) return

    setLoading(true)
    try {
      const res = await fetch(`/api/vehicles/${soldModal.vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SOLD',
          finalSalePrice: parseFloat(finalPrice),
        }),
      })

      if (!res.ok) throw new Error('Failed to mark as sold')

      setMessage({ type: 'success', text: 'Vehicle marked as sold!' })
      setSoldModal(null)
      setFinalPrice('')
      fetchVehicles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update' })
    } finally {
      setLoading(false)
    }
  }

  const handleRelist = async () => {
    if (!relistModal) return

    setLoading(true)
    try {
      const res = await fetch(`/api/vehicles/${relistModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: relistEventId ? 'ACTIVE' : 'INVENTORY',
          saleEventId: relistEventId || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to relist vehicle')

      setMessage({ type: 'success', text: 'Vehicle relisted successfully!' })
      setRelistModal(null)
      setRelistEventId('')
      fetchVehicles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to relist' })
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (vehicle: Vehicle) => {
    setEditForm({
      year: vehicle.year.toString(),
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim || '',
      status: vehicle.status,
      aiDisclosures: '',
      videoUrl: '',
      price: vehicle.price?.toString() || '',
      saleEventId: vehicle.saleEventId || '',
    })
    // Fetch full vehicle details including aiDisclosures and videoUrl
    fetch(`/api/vehicles/${vehicle.id}`)
      .then((res) => res.json())
      .then((data) => {
        setEditForm((prev) => ({
          ...prev,
          aiDisclosures: data.aiDisclosures || '',
          videoUrl: data.videoUrl || '',
        }))
      })
    setEditModal(vehicle)
  }

  const handleEditVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setEditUploading(true)
    setMessage(null)

    try {
      const signatureRes = await fetch('/api/upload')
      if (!signatureRes.ok) {
        throw new Error('Failed to get upload signature')
      }
      const { signature, timestamp, cloudName, apiKey, folder } = await signatureRes.json()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp.toString())
      formData.append('api_key', apiKey)
      formData.append('folder', folder)
      formData.append('resource_type', 'video')

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!cloudinaryRes.ok) {
        const error = await cloudinaryRes.json()
        throw new Error(error.error?.message || 'Failed to upload video')
      }

      const data = await cloudinaryRes.json()
      setEditForm({ ...editForm, videoUrl: data.secure_url })
      setMessage({ type: 'success', text: 'Video uploaded successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to upload video' })
    } finally {
      setEditUploading(false)
    }
  }

  const handleEditSubmit = async () => {
    if (!editModal) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/vehicles/${editModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: parseInt(editForm.year),
          make: editForm.make,
          model: editForm.model,
          trim: editForm.trim || null,
          status: editForm.status,
          price: editForm.price ? parseFloat(editForm.price) : null,
          aiDisclosures: editForm.aiDisclosures || null,
          videoUrl: editForm.videoUrl || null,
          saleEventId: editForm.saleEventId || null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update vehicle')
      }

      setMessage({ type: 'success', text: 'Vehicle updated successfully!' })
      setEditModal(null)
      fetchVehicles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update vehicle' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-200 text-gray-700',
      INVENTORY: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      SOLD: 'bg-purple-100 text-purple-800',
    }
    return colors[status] || 'bg-gray-200 text-gray-700'
  }

  const futureEvents = saleEvents.filter(
    (e) => e.status === 'UPCOMING' || e.status === 'ACTIVE'
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
            Add Vehicle
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'inventory'
                ? 'bg-deep-blue text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage Inventory
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

              {saleEvents.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-md font-bold text-slate-brand mb-4">Existing Sale Events</h3>
                  <div className="space-y-2">
                    {saleEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()} -{' '}
                            {new Date(event.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {event._count?.vehicles || 0} vehicles
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              event.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : event.status === 'UPCOMING'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={vehicleForm.vin}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, vin: e.target.value.toUpperCase() })
                    }
                    className="flex-1 font-mono"
                    placeholder="17-character VIN"
                    maxLength={17}
                  />
                  <button
                    type="button"
                    onClick={handleDecodeVin}
                    disabled={decoding || vehicleForm.vin.length !== 17}
                    className="btn-secondary disabled:opacity-50 whitespace-nowrap"
                  >
                    {decoding ? 'Decoding...' : 'Decode VIN'}
                  </button>
                </div>
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
                  Assign to Sale Event
                </label>
                <select
                  value={vehicleForm.saleEventId}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, saleEventId: e.target.value })}
                  className="w-full"
                >
                  <option value="">-- No Event (Inventory) --</option>
                  {futureEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({new Date(event.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/webm"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-deep-blue file:text-white file:font-semibold hover:file:bg-blue-900 file:cursor-pointer disabled:opacity-50"
                  />
                  {uploading && (
                    <p className="text-sm text-action-orange">Uploading video...</p>
                  )}
                  {vehicleForm.videoUrl && !uploading && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Video uploaded
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Disclosures
                </label>
                <textarea
                  value={vehicleForm.aiDisclosures}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, aiDisclosures: e.target.value })
                  }
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

          {activeTab === 'inventory' && (
            <div>
              <h2 className="text-lg font-bold text-slate-brand mb-4">Manage Inventory</h2>

              {vehicles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No vehicles in inventory</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Vehicle</th>
                        <th className="text-left p-3">VIN</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Event</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <p className="font-medium">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            {vehicle.trim && (
                              <p className="text-xs text-gray-500">{vehicle.trim}</p>
                            )}
                          </td>
                          <td className="p-3 font-mono text-xs">{vehicle.vin}</td>
                          <td className="p-3">
                            <span
                              className={`text-xs px-2 py-1 rounded ${getStatusBadge(
                                vehicle.status
                              )}`}
                            >
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="p-3 text-xs">
                            {vehicle.saleEvent?.title || (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            {vehicle.status === 'SOLD' && vehicle.finalSalePrice ? (
                              <span className="text-green-600 font-medium">
                                ${Number(vehicle.finalSalePrice).toLocaleString()}
                              </span>
                            ) : vehicle.price ? (
                              `$${Number(vehicle.price).toLocaleString()}`
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1 flex-wrap">
                              <button
                                onClick={() => openEditModal(vehicle)}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                              >
                                Edit
                              </button>
                              {vehicle.status !== 'SOLD' && (
                                <button
                                  onClick={() =>
                                    setSoldModal({ vehicleId: vehicle.id, vin: vehicle.vin })
                                  }
                                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                                >
                                  Mark Sold
                                </button>
                              )}
                              {(vehicle.status === 'INVENTORY' ||
                                vehicle.status === 'DRAFT' ||
                                vehicle.status === 'ACTIVE') && (
                                <button
                                  onClick={() => setRelistModal(vehicle)}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                >
                                  {vehicle.saleEventId ? 'Reassign' : 'Assign Event'}
                                </button>
                              )}
                              {vehicle.status === 'SOLD' && (
                                <button
                                  onClick={() => setRelistModal(vehicle)}
                                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                                >
                                  Relist
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mark as Sold Modal */}
      {soldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-brand mb-4">Mark Vehicle as Sold</h3>
            <p className="text-sm text-gray-600 mb-4">VIN: {soldModal.vin}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Sale Price *
              </label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full"
                placeholder="0.00"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSoldModal(null)
                  setFinalPrice('')
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsSold}
                disabled={!finalPrice || loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Confirm Sale'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relist Modal */}
      {relistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-brand mb-4">
              {relistModal.status === 'SOLD' ? 'Relist Vehicle' : 'Assign to Event'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {relistModal.year} {relistModal.make} {relistModal.model}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Sale Event
              </label>
              <select
                value={relistEventId}
                onChange={(e) => setRelistEventId(e.target.value)}
                className="w-full"
              >
                <option value="">-- Move to Inventory --</option>
                {futureEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} ({new Date(event.startDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRelistModal(null)
                  setRelistEventId('')
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRelist}
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : relistEventId ? 'Assign to Event' : 'Move to Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold text-slate-brand mb-4">Edit Vehicle</h3>
            <p className="text-sm text-gray-600 mb-4 font-mono">{editModal.vin}</p>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    value={editForm.make}
                    onChange={(e) => setEditForm({ ...editForm, make: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                  <input
                    type="text"
                    value={editForm.trim}
                    onChange={(e) => setEditForm({ ...editForm, trim: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="INVENTORY">Inventory</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Event</label>
                <select
                  value={editForm.saleEventId}
                  onChange={(e) => setEditForm({ ...editForm, saleEventId: e.target.value })}
                  className="w-full"
                >
                  <option value="">-- No Event --</option>
                  {futureEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({new Date(event.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/webm"
                    onChange={handleEditVideoUpload}
                    disabled={editUploading}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-deep-blue file:text-white file:font-semibold hover:file:bg-blue-900 file:cursor-pointer disabled:opacity-50"
                  />
                  {editUploading && (
                    <p className="text-sm text-action-orange">Uploading video...</p>
                  )}
                  {editForm.videoUrl && !editUploading && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Video attached
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Disclosures</label>
                <textarea
                  value={editForm.aiDisclosures}
                  onChange={(e) => setEditForm({ ...editForm, aiDisclosures: e.target.value })}
                  className="w-full h-24"
                  placeholder="Enter AI-generated disclosures or condition notes..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={loading || editUploading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
