import React from 'react';

interface MSIGLandingPageProps {
  onGetStarted: () => void;
}

const MSIGLandingPage: React.FC<MSIGLandingPageProps> = ({ onGetStarted }) => {
  const handleGetStarted = () => {
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">MSIG</h1>
          <p className="text-xl text-blue-100">Your trusted partner in travel insurance</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to MSIG Insurance
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Protect your adventures with comprehensive travel insurance coverage. 
            Get personalized recommendations powered by AI, manage your policies, 
            and ensure nothing ruins your journey.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Comprehensive Coverage</h3>
              <p className="text-sm text-gray-600">
                Get protection for medical emergencies, trip cancellations, and more
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Assistant</h3>
              <p className="text-sm text-gray-600">
                Chat with Haven, your personal AI insurance advisor
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy Management</h3>
              <p className="text-sm text-gray-600">
                Manage policies, file claims, and track your coverage all in one place
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>

        {/* Footer */}
        <p className="text-blue-100 text-sm">
          Already have an account? 
          <button 
            onClick={handleGetStarted}
            className="underline ml-1 hover:text-white"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default MSIGLandingPage;
