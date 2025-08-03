'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, MapPin, Calendar } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Scoovio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Find a scooter/stroller
            </Link>
            <Link href="/host" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Become a host
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              How Scoovio works
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              My Trips
            </Link>
            <Link href="/host/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Host Dashboard
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/search" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                Find a scooter/stroller
              </Link>
              <Link href="/host" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                Become a host
              </Link>
              <Link href="/how-it-works" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                How Scoovio works
              </Link>
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                My Trips
              </Link>
              <Link href="/host/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                Host Dashboard
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">
                  Log in
                </Link>
                <Link href="/signup" className="block px-3 py-2 mt-1 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}