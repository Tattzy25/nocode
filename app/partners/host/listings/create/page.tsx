'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Upload, DollarSign, MapPin, Package } from 'lucide-react'

interface EquipmentForm {
  title: string
  description: string
  type: string
  subtype: string
  daily_price: string
  location: string
  features: string[]
  images: string[]
  specifications: {
    weight_capacity?: string
    dimensions?: string
    age_range?: string
    brand?: string
  }
}

export default function CreateListing() {
  const router = useRouter()
  const [form, setForm] = useState<EquipmentForm>({
    title: '',
    description: '',
    type: '',
    subtype: '',
    daily_price: '',
    location: '',
    features: [],
    images: [],
    specifications: {}
  })
  const [loading, setLoading] = useState(false)

  const equipmentTypes = {
    'mobility-scooter': [
      'Standard',
      'Heavy Duty',
      'Portable/Foldable',
      'All Terrain',
      '3-Wheel',
      '4-Wheel'
    ],
    'wheelchair': [
      'Manual Standard',
      'Lightweight',
      'Transport',
      'Bariatric',
      'Pediatric'
    ],
    'stroller': [
      'Single',
      'Double',
      'Jogger',
      'Umbrella',
      'Travel System',
      'Premium'
    ],
    'walker': [
      'Standard',
      'Rollator',
      'Knee Scooter',
      'Pediatric',
      'Bariatric'
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          daily_price: parseFloat(form.daily_price),
          images: ['/placeholder1.jpg', '/placeholder2.jpg'] // Mock images
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/host/dashboard`)
      } else {
        console.error('Error creating listing')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-600 mt-2">Add your equipment to start earning</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Premium Mobility Scooter - Lightweight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your equipment, its condition, and any special features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Type *
                  </label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value, subtype: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select type</option>
                    {Object.keys(equipmentTypes).map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtype *
                  </label>
                  <select
                    required
                    value={form.subtype}
                    onChange={(e) => setForm({ ...form, subtype: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={!form.type}
                  >
                    <option value="">Select subtype</option>
                    {form.type && equipmentTypes[form.type as keyof typeof equipmentTypes]?.map(subtype => (
                      <option key={subtype} value={subtype}>{subtype}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Location */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Location</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.daily_price}
                    onChange={(e) => setForm({ ...form, daily_price: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Downtown San Francisco"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                'Foldable',
                'Lightweight',
                'Adjustable',
                'Weather-resistant',
                'USB Charging',
                'Storage Basket',
                'Cup Holder',
                'Safety Lights',
                'Comfortable Seat',
                'All-terrain Wheels',
                'Easy Transport',
                'Child Safety'
              ].map((feature) => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Capacity
                </label>
                <input
                  type="text"
                  value={form.specifications.weight_capacity}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, weight_capacity: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 300 lbs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={form.specifications.dimensions}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, dimensions: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder='e.g., 40" x 20" x 35"'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <input
                  type="text"
                  value={form.specifications.age_range}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, age_range: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 2-6 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={form.specifications.brand}
                  onChange={(e) => setForm({
                    ...form,
                    specifications: { ...form.specifications, brand: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Pride Mobility"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}