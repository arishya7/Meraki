import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, ScootUserData, UserDataInputRequest, ManualInputDetails, ChatbotResponse, Recommendation } from '../types';
import { getThemeForCountry, defaultTheme, Theme } from '../themes';
import { ChatBubbleIcon, CloseIcon, MSIGLogo } from './IconComponents';
import MessageBubble from './MessageBubble';
import ClaimInsuranceTab from './ClaimInsuranceTab';
import InitialActionsCard from './InitialActionsCard';
import { postUserInputData, postRecommendations } from '../services/api';

// Placeholder components for now, will be created as separate files later
interface ManualInputFormProps {
    onSubmit: (details: ManualInputDetails) => void;
    onCancel: () => void;
}
const ManualInputForm: React.FC<ManualInputFormProps> = ({ onSubmit, onCancel }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [numTravelers, setNumTravelers] = useState(1);
    const [ages, setAges] = useState<string>('30'); // Input as string, parse to array of numbers

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAges = ages.split(',').map(age => parseInt(age.trim())).filter(num => !isNaN(num));
        onSubmit({
            origin,
            destination,
            departure_date: departureDate,
            return_date: returnDate,
            num_travelers: numTravelers,
            ages: parsedAges,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md space-y-3">
            <input type="text" placeholder="Origin (e.g., Singapore)" value={origin} onChange={(e) => setOrigin(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Destination (e.g., Thailand)" value={destination} onChange={(e) => setDestination(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="date" placeholder="Departure Date (YYYY-MM-DD)" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="date" placeholder="Return Date (YYYY-MM-DD)" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="number" placeholder="Number of Travelers" value={numTravelers} onChange={(e) => setNumTravelers(parseInt(e.target.value))} min="1" required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Ages (comma-separated, e.g., 30,28)" value={ages} onChange={(e) => setAges(e.target.value)} className="w-full p-2 border rounded" />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Submit</button>
            </div>
        </form>
    );
};

interface PDFUploadInputProps {
    onSubmit: (base64Pdf: string) => void;
    onCancel: () => void;
}
const PDFUploadInput: React.FC<PDFUploadInputProps> = ({ onSubmit, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]; // Remove data:mime/type;base64,
                onSubmit(base64);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                alert("Failed to read file.");
            };
        } else {
            alert("Please select a PDF file.");
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md space-y-3">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-2 border rounded" />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={!selectedFile} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Upload PDF</button>
            </div>
        </div>
    );
};

type FlowState = 'initializing' | 'awaiting_initial_action' | 'awaiting_nric_input' | 'awaiting_manual_input' | 'awaiting_pdf_upload' | 'displaying_recommendations' | 'chatting_q_a';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [flowState, setFlowState] = useState<FlowState>('initializing');
  const [activeTab, setActiveTab] = useState<'buy' | 'claim'>('buy');
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state variables for input and data
  const [currentScootUserData, setCurrentScootUserData] = useState<ScootUserData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [chatbotSummary, setChatbotSummary] = useState<string>('');
  const [nricInputValue, setNricInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFlowState('initializing');
      setActiveTab('buy');
      setMessages([]);
      setError(null);
      setNricInputValue('');

      // Initial welcome message
      addMessage({
        sender: Sender.BOT,
        text: `Hello! I'm Haven, your personal travel insurance assistant from MSIG. How can I help you today?`,
      });

      // Transition to awaiting initial action after a brief delay
      setTimeout(() => {
        addMessage({
          sender: Sender.BOT,
          component: <InitialActionsCard onAction={handleInitialAction} />,
        });
        setFlowState('awaiting_initial_action');
      }, 1500); // Shorter delay for direct action

    } else {
      // Reset to default theme when closed
      setTimeout(() => setTheme(defaultTheme), 300);
      setCurrentScootUserData(null);
      setRecommendations([]);
      setChatbotSummary('');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (newMessage: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...newMessage, id: prev.length + 1 }]);
  };

  const processUserInputAndFetchRecommendations = async (inputRequest: UserDataInputRequest) => {
    setIsLoading(true);
    setError(null);
    try {
        const userData = await postUserInputData(inputRequest);
        setCurrentScootUserData(userData);
        addMessage({
            sender: Sender.BOT,
            text: `Thanks! I've got your trip details. Let me find some recommendations for you.`,
        });

        const chatbotResponse = await postRecommendations(userData);
        setRecommendations(chatbotResponse.recommendations);
        setChatbotSummary(chatbotResponse.summary);

        addMessage({
            sender: Sender.BOT,
            text: chatbotResponse.summary,
        });
        addMessage({
            sender: Sender.BOT,
            component: (
                <div className="space-y-3">
                    {chatbotResponse.recommendations.map((plan, index) => (
                        <div key={plan.id} className="bg-blue-100 p-3 rounded-lg">
                            <h4 className="font-bold">{plan.policy_name} - {plan.currency} {plan.price.toFixed(2)}</h4>
                            <p className="text-sm">{plan.description}</p>
                            <ul className="list-disc list-inside text-xs">
                                {plan.pros.map((pro, i) => (<li key={i}>Pros: {pro}</li>))}
                                {plan.cons.map((con, i) => (<li key={i}>Cons: {con}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            ),
        });

        setFlowState('chatting_q_a'); // Transition to Q&A after recommendations

    } catch (err) {
        console.error("Error during API call:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        addMessage({
            sender: Sender.BOT,
            text: `Sorry, I encountered an error: ${errorMessage} Please try again or choose a different input method.`,
        });
        setFlowState('awaiting_initial_action'); // Go back to initial action on error
    } finally {
        setIsLoading(false);
    }
  };

  const handleNRICSubmit = async () => {
    if (!nricInputValue) {
        setError("Please enter an NRIC.");
        return;
    }
    addMessage({ sender: Sender.USER, text: `My NRIC is: ${nricInputValue}` });
    await processUserInputAndFetchRecommendations({
        input_type: "nric",
        nric_value: nricInputValue,
    });
    setNricInputValue(''); // Clear input after submission
  };

  const handleManualDetailsSubmit = async (details: ManualInputDetails) => {
    addMessage({ sender: Sender.USER, text: `Manual details submitted.` });
    await processUserInputAndFetchRecommendations({
        input_type: "manual_entry",
        manual_details: details,
    });
    // No need to clear manual details state here as the form handles its own state
    // and will be unmounted. Reset flow state to allow new action.
    setFlowState('chatting_q_a');
  };

  const handlePDFFileSubmit = async (base64Pdf: string) => {
    addMessage({ sender: Sender.USER, text: `PDF uploaded.` });
    await processUserInputAndFetchRecommendations({
        input_type: "pdf_upload",
        pdf_base64: base64Pdf,
    });
    // No need to clear pdfFile state here as the input handles its own state
    // and will be unmounted. Reset flow state to allow new action.
    setFlowState('chatting_q_a');
  };

  const handleInitialAction = (action: 'nric' | 'manual_entry' | 'pdf_upload') => {
    setError(null); // Clear previous errors
    let botMessage = '';
    switch (action) {
        case 'nric':
            botMessage = 'Please enter your NRIC to proceed.';
            setFlowState('awaiting_nric_input');
            break;
        case 'manual_entry':
            botMessage = 'Please provide your trip details:';
            setFlowState('awaiting_manual_input');
            break;
        case 'pdf_upload':
            botMessage = 'Please upload your Scoot itinerary PDF:';
            setFlowState('awaiting_pdf_upload');
            break;
    }
    addMessage({ sender: Sender.BOT, text: botMessage });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    addMessage({ sender: Sender.USER, text: inputValue });
    setInputValue('');
    // Placeholder for future Q&A logic
    setTimeout(() => {
        addMessage({ sender: Sender.BOT, text: "I'm still learning how to answer questions. Please select an option to continue." });
    }, 1000);
  };

  const themeStyle = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-highlight': theme.colors.highlight,
    '--color-background': theme.colors.background,
    '--color-text': theme.colors.text,
  } as React.CSSProperties;

  const mainBgStyle = {
      ...themeStyle,
      backgroundImage: theme.backgroundImage || 'none',
  };

  // Determine if the text input should be disabled
  const isInputDisabled = isLoading ||
                          flowState === 'initializing' ||
                          flowState === 'awaiting_initial_action' ||
                          flowState === 'awaiting_nric_input' ||
                          flowState === 'awaiting_manual_input' ||
                          flowState === 'awaiting_pdf_upload';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-primary text-white rounded-full p-4 shadow-lg hover:opacity-90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 z-50"
        aria-label="Open chat"
        style={{'--color-primary': defaultTheme.colors.primary} as React.CSSProperties}
      >
        <ChatBubbleIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div style={themeStyle} className="fixed bottom-5 right-5 h-[70vh] max-h-[700px] w-full max-w-sm flex flex-col bg-background rounded-2xl shadow-2xl z-50 overflow-hidden border border-text-main/10 text-text-main">
      <header className="p-2 bg-primary text-white">
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
      <main style={mainBgStyle} className="flex-1 overflow-y-auto p-4">
        {activeTab === 'buy' ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} theme={theme} />
            ))}
            {isLoading && (
                <MessageBubble
                    message={{ sender: Sender.BOT, text: "Thinking..." }}
                    theme={theme}
                />
            )}
            {error && (
                <MessageBubble
                    message={{ sender: Sender.BOT, text: `Error: ${error}` }}
                    theme={theme}
                />
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <ClaimInsuranceTab />
        )}
      </main>
      <footer className="p-4 border-t border-text-main/10 bg-background">
        <div className="relative">
            {flowState === 'awaiting_nric_input' && (
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Enter NRIC (e.g., S1234567D)"
                        className="flex-1 pl-4 pr-4 py-2 border border-text-main/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white text-text-main"
                        value={nricInputValue}
                        onChange={(e) => setNricInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleNRICSubmit();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <button 
                        className="p-2 bg-primary text-white rounded-full hover:opacity-90 disabled:bg-text-main/30"
                        onClick={handleNRICSubmit}
                        disabled={isLoading || !nricInputValue.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            )}
            {flowState === 'awaiting_manual_input' && (
                <div className="mb-2">
                    <ManualInputForm onSubmit={handleManualDetailsSubmit} onCancel={() => setFlowState('awaiting_initial_action')} />
                </div>
            )}
            {flowState === 'awaiting_pdf_upload' && (
                <div className="mb-2">
                    <PDFUploadInput onSubmit={handlePDFFileSubmit} onCancel={() => setFlowState('awaiting_initial_action')} />
                </div>
            )}

          <input
            type="text"
            placeholder={isInputDisabled ? "Please select an option or provide input..." : "Ask a question..."}
            className="w-full pl-4 pr-12 py-2 border border-text-main/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:bg-text-main/10 text-text-main"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:opacity-90 disabled:bg-text-main/30" 
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
