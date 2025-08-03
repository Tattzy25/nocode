export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">How do I rent equipment?</h3>
                  <p className="text-gray-600">Browse available equipment, select your dates, and book instantly.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">What if I need to cancel?</h3>
                  <p className="text-gray-600">You can cancel your booking according to the host's cancellation policy.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">How do I become a host?</h3>
                  <p className="text-gray-600">Click "Become a host" and follow the setup process to list your equipment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}