export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600 mb-4">
                We're here to help! Reach out to us with any questions or concerns.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@scoovio.com</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">1-800-SCOOVIO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}