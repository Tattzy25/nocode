import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, MessageCircle, Key, Shield, Star, CheckCircle, Users, Clock, CreditCard, Camera, FileText, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">How Scoovio works</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Rent mobility scooters and baby strollers from trusted hosts in your neighborhood. 
            Safe, convenient, and affordable equipment when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Find equipment near you
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Become a host
            </Button>
          </div>
        </div>
      </section>

      {/* For Guests Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For guests</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the mobility equipment you need in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Search & discover</h3>
              <p className="text-gray-600 mb-6">
                Find the perfect mobility scooter or baby stroller near you. Filter by location, 
                dates, and specific features you need.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />Los Angeles, CA</span>
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Dec 15-20</span>
                </div>
              </div>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Book & connect</h3>
              <p className="text-gray-600 mb-6">
                Message your host, ask questions, and book instantly. All payments are 
                processed securely through our platform.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    JD
                  </div>
                  <span>"Is the scooter available for pickup at 2pm?"</span>
                </div>
              </div>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Pick up & go</h3>
              <p className="text-gray-600 mb-6">
                Meet your host, get a quick walkthrough of the equipment, and you're ready to go. 
                Return it clean and on time.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" />Picked up</span>
                  <span className="text-gray-500">2:15 PM</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Guest Benefits */}
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Why guests choose Scoovio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Protected trips</h4>
                <p className="text-sm text-gray-600">Every booking includes liability protection and 24/7 support</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Trusted hosts</h4>
                <p className="text-sm text-gray-600">All hosts are verified with ratings and reviews from real guests</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Flexible booking</h4>
                <p className="text-sm text-gray-600">Book for hours, days, or weeks. Cancel up to 24 hours before</p>
              </div>
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Easy payments</h4>
                <p className="text-sm text-gray-600">Secure payments with no hidden fees. Pay only when you book</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Hosts Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For hosts</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your unused mobility equipment into income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. List your equipment</h3>
              <p className="text-gray-600 mb-6">
                Take great photos, write a detailed description, and set your availability. 
                Our tools make listing quick and easy.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-left">
                  <div className="font-medium mb-1">Pride Mobility Scooter</div>
                  <div className="text-gray-500">$45/day • Available now</div>
                </div>
              </div>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Connect with guests</h3>
              <p className="text-gray-600 mb-6">
                Approve bookings, chat with guests, and coordinate pickup times. 
                You're in control of who rents your equipment.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    SM
                  </div>
                  <span>"Booking approved! See you at 2pm"</span>
                </div>
              </div>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Get paid</h3>
              <p className="text-gray-600 mb-6">
                Earn money from equipment that would otherwise sit unused. 
                Get paid securely within 24 hours of trip completion.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 font-medium">+$180.00</span>
                  <span className="text-gray-500">4-day rental</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Host Benefits */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8">Why people host on Scoovio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Extra income</h4>
                <p className="text-sm text-gray-600">Hosts earn an average of $200-500 per month from their equipment</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Protection included</h4>
                <p className="text-sm text-gray-600">Every booking includes liability coverage and damage protection</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Easy management</h4>
                <p className="text-sm text-gray-600">Manage bookings, communicate with guests, and track earnings from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety & trust</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to keeping our community safe and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Verified hosts</h3>
              <p className="text-sm text-gray-600">All hosts complete identity verification and equipment safety checks</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Insurance coverage</h3>
              <p className="text-sm text-gray-600">Liability protection and damage coverage included with every booking</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Review system</h3>
              <p className="text-sm text-gray-600">Transparent ratings and reviews help build trust in our community</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">24/7 support</h3>
              <p className="text-sm text-gray-600">Our customer support team is available around the clock to help</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who trust Scoovio for their mobility needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Search className="h-5 w-5 mr-2" />
              Find equipment
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Camera className="h-5 w-5 mr-2" />
              List your equipment
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}