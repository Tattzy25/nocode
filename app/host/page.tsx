'use client'

import { useState } from 'react'
import { DollarSign, Shield, Users, TrendingUp, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BecomeHostPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const features = [
    {
      icon: DollarSign,
      title: "Earn extra income",
      description: "Make money from your mobility equipment when you're not using it"
    },
    {
      icon: Shield,
      title: "Comprehensive protection",
      description: "$1M liability insurance and 24/7 roadside assistance included"
    },
    {
      icon: Users,
      title: "Join a trusted community",
      description: "Connect with verified guests and build your reputation as a host"
    },
    {
      icon: TrendingUp,
      title: "Grow your business",
      description: "Access tools and insights to maximize your earnings potential"
    }
  ]

  const steps = [
    {
      number: 1,
      title: "Create your listing",
      description: "Add photos and details about your scooter or stroller"
    },
    {
      number: 2,
      title: "Set your price",
      description: "Choose your daily rate and availability"
    },
    {
      number: 3,
      title: "Start earning",
      description: "Accept bookings and begin earning money"
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Los Angeles, CA",
      earnings: "$2,400",
      period: "per month",
      image: "/api/placeholder/60/60",
      quote: "Hosting on Scoovio has been amazing. I earn extra income from my mobility scooter when I'm not using it, and the guests are always respectful."
    },
    {
      name: "David K.",
      location: "San Francisco, CA",
      earnings: "$1,800",
      period: "per month",
      image: "/api/placeholder/60/60",
      quote: "The platform makes it so easy to manage bookings. I love being able to help families with strollers when they travel to SF."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Turn your mobility equipment into income
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                List your mobility scooter or baby stroller and earn up to $1,000 per month. 
                Join thousands of hosts who are already earning with Scoovio.
              </p>
              <Link 
                href="/host/onboarding"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Start hosting today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <p className="text-sm mt-4 text-blue-100">
                No setup fees • Get paid within 3 business days
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-8">
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">$1,247</p>
                <p className="text-blue-100">Average monthly earnings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why host on Scoovio?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to succeed as a mobility equipment host
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start earning in 3 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Calculate your potential earnings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Mobility scooter</option>
                  <option>Baby stroller</option>
                  <option>Both scooter and stroller</option>
                </select>
                
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  Days available per month
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  defaultValue="20"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Your estimated monthly earnings</p>
                <p className="text-4xl font-bold text-primary-600 mb-2">$850</p>
                <p className="text-sm text-gray-500">Based on average daily rates in your area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success stories from our hosts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="text-2xl font-bold text-primary-600">{testimonial.earnings}</p>
                  <p className="text-sm text-gray-600">{testimonial.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start earning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of hosts who are already earning with Scoovio
          </p>
          <Link 
            href="/host/onboarding"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start your listing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          <div className="mt-8 flex justify-center space-x-8 text-sm text-blue-100">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Free to list
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Insurance included
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Get paid quickly
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}