import React from 'react';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-gray mb-2">Welcome to the MSIG Portal</h1>
      <p className="text-slate-gray/80">Your trusted partner in travel insurance.</p>
      
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