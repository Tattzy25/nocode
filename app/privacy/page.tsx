export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, make a booking, or contact us.
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services.
            </p>
            <p className="text-gray-600">
              For our complete privacy policy, please contact us at privacy@scoovio.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}