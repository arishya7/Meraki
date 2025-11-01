import React from 'react';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-gray mb-2">Checkout Page</h1>
      <p className="text-slate-gray/80">This is a mock travel booking checkout page.</p>
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-slate-gray">Your Trip to Tokyo</h2>
          <div className="space-y-2 text-slate-gray/90">
              <p><span className="font-medium text-slate-gray">Dates:</span> 25 Dec 2024 - 05 Jan 2025</p>
              <p><span className="font-medium text-slate-gray">Travelers:</span> 2 Adults</p>
              <p><span className="font-medium text-slate-gray">Total Price:</span> $2,450.00</p>
          </div>
          <button className="mt-6 w-full bg-mint-green text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
              Complete Booking
          </button>
      </div>

      <ChatWidget />
    </div>
  );
}

export default App;
