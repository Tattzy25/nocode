export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/about" className="text-base text-gray-600 hover:text-gray-900">About Scoovio</a></li>
              <li><a href="/careers" className="text-base text-gray-600 hover:text-gray-900">Careers</a></li>
              <li><a href="/press" className="text-base text-gray-600 hover:text-gray-900">Press</a></li>
              <li><a href="/blog" className="text-base text-gray-600 hover:text-gray-900">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/help" className="text-base text-gray-600 hover:text-gray-900">Help Center</a></li>
              <li><a href="/contact" className="text-base text-gray-600 hover:text-gray-900">Contact us</a></li>
              <li><a href="/safety" className="text-base text-gray-600 hover:text-gray-900">Safety</a></li>
              <li><a href="/accessibility" className="text-base text-gray-600 hover:text-gray-900">Accessibility</a></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Hosting</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/host" className="text-base text-gray-600 hover:text-gray-900">Become a host</a></li>
              <li><a href="/host-resources" className="text-base text-gray-600 hover:text-gray-900">Host resources</a></li>
              <li><a href="/host-community" className="text-base text-gray-600 hover:text-gray-900">Community forum</a></li>
              <li><a href="/host-guarantee" className="text-base text-gray-600 hover:text-gray-900">Host guarantee</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/terms" className="text-base text-gray-600 hover:text-gray-900">Terms of service</a></li>
              <li><a href="/privacy" className="text-base text-gray-600 hover:text-gray-900">Privacy policy</a></li>
              <li><a href="/cookies" className="text-base text-gray-600 hover:text-gray-900">Cookie policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2.014a.828.828 0 01.77 0 11.026 11.026 0 016.857 6.857.828.828 0 010 .77 11.026 11.026 0 01-6.857 6.857.828.828 0 01-.77 0 11.026 11.026 0 01-6.857-6.857.828.828 0 010-.77A11.026 11.026 0 0112.315 2.014zM12 6.828a5.172 5.172 0 100 10.344A5.172 5.172 0 0012 6.828zm0 1.655a3.517 3.517 0 110 7.034 3.517 3.517 0 010-7.034zm5.505-2.755a1.242 1.242 0 100 2.484 1.242 1.242 0 000-2.484z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p className="mt-4 md:mt-0 text-base text-gray-400">
              © 2024 Scoovio, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}