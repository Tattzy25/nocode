export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Scoovio</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-4">
              Scoovio is the premier platform for renting mobility scooters and baby strollers, 
              making travel and daily activities more accessible and convenient for everyone.
            </p>
            <p className="text-gray-600 mb-4">
              Founded with the mission to provide easy access to mobility solutions, we connect 
              people who need scooters and strollers with local hosts who have them available.
            </p>
            <p className="text-gray-600">
              Whether you're visiting a theme park, exploring a new city, or need temporary 
              mobility assistance, Scoovio makes it simple to find and rent the equipment you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}