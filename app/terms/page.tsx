export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-4">
              By using Scoovio, you agree to these terms of service.
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use Scoovio for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-gray-600">
              For complete terms of service, please contact us at legal@scoovio.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}