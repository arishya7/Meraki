import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, TripDetails, InsurancePlan } from '../types';
import { MOCK_TRIP_DETAILS, MOCK_INSURANCE_PLANS } from '../constants';
import { ChatBubbleIcon, CloseIcon, MSIGLogo } from './IconComponents';
import MessageBubble from './MessageBubble';
import TripDetailsCard from './TripDetailsCard';
import PlanSelector from './PlanSelector';
import ClaimInsuranceTab from './ClaimInsuranceTab';
import PaymentConfirmationCard from './PaymentConfirmationCard';

type FlowState = 'confirming_details' | 'editing_details' | 'selecting_plan' | 'confirming_payment' | 'finalized';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [tripDetails, setTripDetails] = useState<TripDetails>(MOCK_TRIP_DETAILS);
  const [flowState, setFlowState] = useState<FlowState>('confirming_details');
  const [activeTab, setActiveTab] = useState<'buy' | 'claim'>('buy');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      const initialTripDetails = MOCK_TRIP_DETAILS;
      setTripDetails(initialTripDetails);
      setActiveTab('buy');
      setSelectedPlan(null);
      setMessages([
        {
          id: 1,
          sender: Sender.BOT,
          text: "Hello! I'm Haven, here to help you get the best travel insurance for your trip.",
        },
        {
          id: 2,
          sender: Sender.BOT,
          component: <TripDetailsCard details={initialTripDetails} onConfirm={handleConfirmDetails} onEdit={handleEditDetails} />,
        }
      ]);
      setFlowState('confirming_details');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (newMessage: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...newMessage, id: prev.length + 1 }]);
  };

  const handleConfirmDetails = () => {
    addMessage({
      sender: Sender.USER,
      text: "Yes, the details are correct."
    });

    setTimeout(() => {
        addMessage({
            sender: Sender.BOT,
            text: "Great! Based on your trip, here are my top recommendations for you."
        });
        addMessage({
            sender: Sender.BOT,
            component: <PlanSelector plans={MOCK_INSURANCE_PLANS} onSelectPlan={handleSelectPlan} />
        });
        addMessage({
            sender: Sender.BOT,
            text: "You can select a plan above, or feel free to ask me any questions you have about coverage."
        });
        setFlowState('selecting_plan');
    }, 1000);
  };

  const handleEditDetails = () => {
     addMessage({
      sender: Sender.USER,
      text: "No, I need to make a change."
    });
     setTimeout(() => {
        addMessage({
            sender: Sender.BOT,
            text: "Of course. Please let me know what needs to be corrected. For example, 'I am going to South Korea instead'."
        });
        setFlowState('editing_details');
     }, 1000);
  };

  const handleSelectPlan = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
    setFlowState('confirming_payment');
    addMessage({
      sender: Sender.USER,
      text: `I'll go with the ${plan.name} plan.`
    });
    setTimeout(() => {
        addMessage({
            sender: Sender.BOT,
            text: `Great choice! You've selected the ${plan.name} plan.`
        });
        addMessage({
            sender: Sender.BOT,
            component: <PaymentConfirmationCard plan={plan} onProceed={handleProceedToPayment} onEdit={handleGoBackToPlans} />
        });
    }, 1000);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;
    addMessage({
        sender: Sender.USER,
        text: `Proceed to Payment.`
    });
    setTimeout(() => {
        addMessage({
            sender: Sender.BOT,
            text: `Excellent! I'm now redirecting you to Stripe to complete the payment for the ${selectedPlan.name} plan.`
        });
         // Here you would trigger the Stripe redirect
        setFlowState('finalized'); // Disable further actions
    }, 1000);
};

  const handleGoBackToPlans = () => {
    addMessage({
        sender: Sender.USER,
        text: "I'd like to change my plan."
    });
    setTimeout(() => {
        addMessage({
            sender: Sender.BOT,
            text: "Of course. Here are the available plans again."
        });
        addMessage({
            sender: Sender.BOT,
            component: <PlanSelector plans={MOCK_INSURANCE_PLANS} onSelectPlan={handleSelectPlan} />
        });
        setFlowState('selecting_plan');
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    addMessage({ sender: Sender.USER, text: inputValue });
    const message = inputValue;
    setInputValue('');

    if (flowState === 'editing_details') {
        handleCorrectionMessage(message);
    } else if (flowState === 'selecting_plan') {
        handleQuestionMessage(message);
    }
  };

  const handleCorrectionMessage = (message: string) => {
    setFlowState('confirming_details'); // Disable input while bot "thinks"
    setTimeout(() => {
        addMessage({ sender: Sender.BOT, text: "Got it. One moment while I update your details..." });
    }, 500);

    setTimeout(() => {
        // For this demo, we'll just simulate a change. A real implementation would parse the user's message.
        const updatedDetails = { ...tripDetails, arrivalCountry: 'KR' };
        setTripDetails(updatedDetails);

        addMessage({
            sender: Sender.BOT,
            text: "Here are the updated details. Please check if everything is correct now."
        });
        addMessage({
            sender: Sender.BOT,
            component: <TripDetailsCard details={updatedDetails} onConfirm={handleConfirmDetails} onEdit={handleEditDetails} />
        });
    }, 2000);
  }

  const handleQuestionMessage = (message: string) => {
      // Simple canned response logic for the demo
      setTimeout(() => {
          addMessage({ sender: Sender.BOT, text: "Thinking..." });
      }, 500);
      
      setTimeout(() => {
          // In a real app, this would be an API call to a GenAI model
          let botResponse = "That's a great question! While I can provide general info, for specific coverage details it's always best to check the full policy document. ";
          if (message.toLowerCase().includes('skiing') || message.toLowerCase().includes('sports')) {
              botResponse += "Our Platinum plan usually has the best coverage for winter sports, but an add-on might be required.";
          } else if (message.toLowerCase().includes('cancel')) {
              botResponse += "All our plans include trip cancellation coverage, but the limits vary. The Platinum plan offers the highest coverage amount.";
          } else {
              botResponse += "Our Gold and Platinum plans generally offer the most comprehensive coverage."
          }

          addMessage({ sender: Sender.BOT, text: botResponse });
      }, 2000);
  }

  const isInputDisabled = !['editing_details', 'selecting_plan'].includes(flowState) || activeTab !== 'buy';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-mint-green text-white rounded-full p-4 shadow-lg hover:opacity-90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-mint-green focus:ring-opacity-50 z-50"
        aria-label="Open chat"
      >
        <ChatBubbleIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 h-[70vh] max-h-[700px] w-full max-w-sm flex flex-col bg-ivory-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-gray/10">
      <header className="p-2 bg-mint-green text-white">
        <div className="flex items-center justify-between px-2 pt-2">
            <h2 className="text-lg font-bold">Haven</h2>
            <div className="flex items-center gap-2">
              <MSIGLogo className="h-7" />
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close chat">
                  <CloseIcon className="h-6 w-6" />
              </button>
            </div>
        </div>
        <div className="mt-2 flex border-b border-white/20">
            <button
                onClick={() => setActiveTab('buy')}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'buy' ? 'border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
            >
                Buy Insurance
            </button>
            <button
                onClick={() => setActiveTab('claim')}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'claim' ? 'border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
            >
                Claim Insurance
            </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 bg-ivory-white">
        {activeTab === 'buy' ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <ClaimInsuranceTab />
        )}
      </main>
      <footer className="p-4 border-t border-slate-gray/10 bg-ivory-white">
        <div className="relative">
          <input
            type="text"
            placeholder={isInputDisabled ? "Select an option to continue..." : "Ask a question..."}
            className="w-full pl-4 pr-12 py-2 border border-slate-gray/30 rounded-full focus:outline-none focus:ring-2 focus:ring-mint-green bg-white disabled:bg-slate-gray/10"
            disabled={isInputDisabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleSendMessage();
                }
            }}
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-mint-green text-white rounded-full hover:opacity-90 disabled:bg-slate-gray/30" 
            disabled={isInputDisabled || !inputValue.trim()}
            onClick={handleSendMessage}
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWidget;