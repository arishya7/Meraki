import React, { useState, useEffect } from 'react';
import ChatWidget from './components/ChatWidget';
import MSIGLandingPage from './components/MSIGLandingPage';
import LoginPage from './components/LoginPage';

type AppState = 'landing' | 'login' | 'dashboard';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
      setAppState('dashboard');
    }
  }, []);

  const handleGetStarted = () => {
    setAppState('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAppState('dashboard');
  };

  const handleBack = () => {
    setAppState('landing');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAppState('landing');
  };

  if (appState === 'landing') {
    return <MSIGLandingPage onGetStarted={handleGetStarted} />;
  }

  if (appState === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={handleBack} />;
  }

  // Dashboard view
  return (
    <div className="p-8 min-h-screen bg-ivory-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-gray mb-2">Welcome to the MSIG Portal</h1>
          <p className="text-slate-gray/80">Your trusted partner in travel insurance.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-slate-gray">Your Dashboard</h2>
          <p className="text-slate-gray/90">
            This is your main MSIG dashboard. You can manage your policies or purchase new ones.
            Use the Haven chat widget in the corner to get started with a new policy for your latest trip!
          </p>
      </div>

      <ChatWidget />
    </div>
  );
}

export default App;