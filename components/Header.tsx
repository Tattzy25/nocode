'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Scoovio
              </Link>
            </div>

            {/* Hamburger menu button - visible on all screen sizes */}
            <div className="flex items-center space-x-4">
              <SignedIn>
                <div className="hidden sm:block">
                  <UserButton />
                </div>
              </SignedIn>
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          {/* Header in overlay */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-2xl font-bold text-primary-600" onClick={closeMenu}>
                    Scoovio
                  </Link>
                </div>
                <button
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Menu content */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <nav className="space-y-6">
                {/* Main navigation links */}
                <div className="space-y-4">
                  <Link 
                    href="/search" 
                    className="block text-2xl font-medium text-gray-900 hover:text-primary-600 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Find scooters & strollers
                  </Link>
                  <Link 
                    href="/host" 
                    className="block text-2xl font-medium text-gray-900 hover:text-primary-600 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Become a host
                  </Link>
                  <Link 
                    href="/how-it-works" 
                    className="block text-2xl font-medium text-gray-900 hover:text-primary-600 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    How Scoovio works
                  </Link>
                </div>

                {/* Authenticated user links */}
                <SignedIn>
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <Link 
                      href="/dashboard" 
                      className="block text-xl font-medium text-gray-700 hover:text-primary-600 transition-colors py-2"
                      onClick={closeMenu}
                    >
                      My Trips
                    </Link>
                    <Link 
                      href="/host/dashboard" 
                      className="block text-xl font-medium text-gray-700 hover:text-primary-600 transition-colors py-2"
                      onClick={closeMenu}
                    >
                      Host Dashboard
                    </Link>
                  </div>
                </SignedIn>

                {/* Auth buttons */}
                <div className="border-t border-gray-200 pt-6">
                  <SignedOut>
                    <div className="space-y-4">
                      <SignInButton>
                        <button 
                          className="block w-full text-left text-xl font-medium text-gray-700 hover:text-primary-600 transition-colors py-2"
                          onClick={closeMenu}
                        >
                          Log in
                        </button>
                      </SignInButton>
                      <SignUpButton>
                        <button 
                          className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg text-xl font-medium hover:bg-primary-700 transition-colors"
                          onClick={closeMenu}
                        >
                          Sign up
                        </button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="sm:hidden">
                      <UserButton />
                    </div>
                  </SignedIn>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}