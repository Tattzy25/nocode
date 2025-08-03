'use client'

import { Search, UserCheck, Calendar, Shield, DollarSign, MessageCircle } from 'lucide-react'

export default function HowItWorksPage() {
  const guestSteps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Find the perfect mobility scooter or baby stroller in your destination city. Filter by type, features, price, and location."
    },
    {
      icon: UserCheck,
      title: "Book with Confidence",
      description: "Reserve your equipment instantly with secure payment. All hosts and equipment are verified for your safety."
    },
    {
      icon: Calendar,
      title: "Pickup & Return",
      description: "Coordinate pickup with your host or choose delivery. Return the equipment at the end of your rental period."
    }
  ]

  const hostSteps = [
    {
      icon: DollarSign,
      title: "List Your Equipment",
      description: "Create a listing for your mobility scooter or baby stroller. Add photos, description, and set your price."
    },
    {
      icon: Calendar,
      title: "Manage Bookings",
      description: "Accept booking requests and coordinate pickup/delivery with guests through our secure messaging system."
    },
    {
      icon: Shield,
      title: "Get Paid Safely",
      description: "Receive payments directly to your bank account. Scoovio handles all transactions securely."
    }
  ]

  const features = [
    {
      icon: Shield,
      title: "Verified Equipment",
      description: "All equipment is verified for safety and quality standards"
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description: "Payments are held securely and released after successful rentals"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated customer support team"
    },
    {
      icon: UserCheck,
      title: "Insurance Coverage",
      description: "Comprehensive insurance coverage for hosts and guests"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How Scoovio Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rent mobility equipment from trusted local hosts or earn money by sharing yours. 
              It's simple, safe, and designed for your convenience.
            </p>
          </div>
        </div>
      </section>

      {/* For Guests Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Guests</h2>
            <p className="text-lg text-gray-600">Find and rent mobility equipment in 3 easy steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guestSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Hosts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Hosts</h2>
            <p className="text-lg text-gray-600">Start earning from your mobility equipment today</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Trust & Safety</h2>
            <p className="text-lg text-gray-600">Features that make Scoovio safe and reliable</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of hosts and guests who trust Scoovio for their mobility needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/search"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Find Equipment to Rent
            </a>
            <a
              href="/host/onboarding"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Start Hosting Today
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}