import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="relative isolate overflow-hidden">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.1%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          ></div>
        </div>
        <div className="relative max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 z-10">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
              EdTech CMS
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A content management system built for educational technology, designed to help you organize and publish your curriculum with ease.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Manage Articles
              </h2>
              <p className="text-gray-600 mb-6">
                Effortlessly create, edit, and organize all your educational content in one centralized location.
              </p>
              <Link
                to="/articles"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-md"
              >
                View Articles
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Content Editor
              </h2>
              <p className="text-gray-600 mb-6">
                Use a powerful and intuitive rich text editor to craft beautiful and engaging educational materials.
              </p>
              <Link
                to="/editor/new"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 font-semibold shadow-md"
              >
                Create New Article
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
