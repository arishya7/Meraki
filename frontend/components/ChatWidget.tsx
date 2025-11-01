import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, ScootUserData, UserDataInputRequest, ManualInputDetails, ChatbotResponse, Recommendation } from '../types';
import { getThemeForCountry, defaultTheme, Theme } from '../themes';
import { ChatBubbleIcon, CloseIcon, MSIGLogo } from './IconComponents';
import MessageBubble from './MessageBubble';
import ClaimInsuranceTab from './ClaimInsuranceTab';
import InitialActionsCard from './InitialActionsCard';
import BookingConfirmationCard from './BookingConfirmationCard';
import FlightDetailsCard from './FlightDetailsCard';
import RecommendedPlanCard from './RecommendedPlanCard';
import PaymentConfirmationCard from './PaymentConfirmationCard';
import PaymentMethodCard from './PaymentMethodCard';
import { postUserInputData, postRecommendations, getUserTrackingStatus, getRecentActivity, getFlightSummary, askQuestion } from '../services/api';

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

type FlowState = 'initializing' | 'awaiting_initial_action' | 'awaiting_nric_input' | 'awaiting_manual_input' | 'awaiting_pdf_upload' | 'awaiting_booking_confirmation' | 'reviewing_flight_details' | 'displaying_recommendations' | 'awaiting_plan_selection' | 'confirming_payment' | 'chatting_q_a';

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
  const [selectedPlan, setSelectedPlan] = useState<Recommendation | null>(null);
  const [nricInputValue, setNricInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allowsTracking, setAllowsTracking] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setFlowState('initializing');
      setActiveTab('buy');
      setMessages([]);
      setError(null);
      setNricInputValue('');

      // Check for logged-in user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userName = user.name || 'there';
          
          // Initial personalized greeting
          addMessage({
            sender: Sender.BOT,
            text: `Hi, ${userName}! I'm Haven. Your AI friend who makes sure nothing ruins your adventure.`,
          });

          // Check tracking status and show proactive message if enabled
          const checkTrackingAndShowMessage = async () => {
            try {
              const trackingStatus = await getUserTrackingStatus(user.id);
              setAllowsTracking(trackingStatus.allows_tracking);
              if (trackingStatus.allows_tracking) {
                const activity = await getRecentActivity(user.id);
                setTimeout(() => {
                  addMessage({
                    sender: Sender.BOT,
                    text: activity.message,
                  });
                  // Fetch flight details from backend
                  setTimeout(async () => {
                    try {
                      const flightData = await getFlightSummary(user.nric);

                      // Apply theme based on destination country
                      const destinationCode = flightData.destination;
                      const countryTheme = getThemeForCountry(destinationCode);
                      setTheme(countryTheme);

                      // Convert FlightSummaryResponse to ScootUserData format
                      const scootUserData: ScootUserData = {
                        user_id: user.id,
                        nric: flightData.nric,
                        origin: flightData.origin,
                        destination: flightData.destination,
                        departure_date: flightData.departure_date,
                        return_date: flightData.return_date || flightData.departure_date,
                        num_travelers: flightData.num_travelers,
                        ages: [30], // Default age, will be updated if available
                        trip_type: flightData.trip_type as "round_trip" | "one_way",
                        flexi_flight: flightData.flexi_flight,
                        claims_history: [],
                      };

                      setCurrentScootUserData(scootUserData);

                      setTimeout(() => {
                        addMessage({
                          sender: Sender.BOT,
                          text: "I found your upcoming trip details! Please review and confirm:",
                        });
                        setTimeout(() => {
                          addMessage({
                            sender: Sender.BOT,
                            component: (
                              <FlightDetailsCard
                                flightData={scootUserData}
                                onConfirm={handleFlightDetailsConfirm}
                                onEdit={() => setFlowState('reviewing_flight_details')}
                              />
                            ),
                          });
                          setFlowState('reviewing_flight_details');
                        }, 800);
                      }, 1000);
                    } catch (err) {
                      console.error('Error fetching flight details:', err);
                      // Fallback: show initial actions if flight fetch fails
                      addMessage({
                        sender: Sender.BOT,
                        text: "I couldn't fetch your trip details automatically. How would you like to provide your travel information?",
                      });
                      setTimeout(() => {
                        addMessage({
                          sender: Sender.BOT,
                          component: <InitialActionsCard onAction={handleInitialAction} showNRIC={allowsTracking} />,
                        });
                        setFlowState('awaiting_initial_action');
                      }, 800);
                    }
                  }, 1500);
                }, 1500);
              } else {
                // No tracking, show booking confirmation option and manual entry
                setTimeout(() => {
                  addMessage({
                    sender: Sender.BOT,
                    text: "Got your booking confirmation handy? You can just drop it here and I'll grab the details",
                  });
                  setTimeout(() => {
                    addMessage({
                      sender: Sender.BOT,
                      component: (
                        <div className="space-y-2">
                          <BookingConfirmationCard onUpload={handleBookingConfirmationUpload} />
                          <div className="text-center text-text-main/70 text-sm py-2">or</div>
                          <InitialActionsCard onAction={handleInitialAction} showNRIC={allowsTracking} />
                        </div>
                      ),
                    });
                    setFlowState('awaiting_booking_confirmation');
                  }, 1000);
                }, 1500);
              }
            } catch (error) {
              console.error('Error checking tracking status:', error);
              // Fallback: show actions after greeting
              setTimeout(() => {
                addMessage({
                  sender: Sender.BOT,
                  component: <InitialActionsCard onAction={handleInitialAction} showNRIC={false} />,
                });
                setFlowState('awaiting_initial_action');
              }, 1500);
            }
          };

          checkTrackingAndShowMessage();
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Fallback to default greeting
          addMessage({
            sender: Sender.BOT,
            text: `Hello! I'm Haven, your personal travel insurance assistant from MSIG. How can I help you today?`,
          });
          setTimeout(() => {
            addMessage({
              sender: Sender.BOT,
              component: <InitialActionsCard onAction={handleInitialAction} showNRIC={false} />,
            });
            setFlowState('awaiting_initial_action');
          }, 1500);
        }
      } else {
        // No logged-in user, show default greeting
        addMessage({
          sender: Sender.BOT,
          text: `Hello! I'm Haven, your personal travel insurance assistant from MSIG. How can I help you today?`,
        });

        setTimeout(() => {
          addMessage({
            sender: Sender.BOT,
            component: <InitialActionsCard onAction={handleInitialAction} showNRIC={false} />,
          });
          setFlowState('awaiting_initial_action');
        }, 1500);
      }

    } else {
      // Reset to default theme when closed
      setTimeout(() => setTheme(defaultTheme), 300);
      setCurrentScootUserData(null);
      setRecommendations([]);
      setChatbotSummary('');
    }
  }, [isOpen]);

  const addMessage = (newMessage: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...newMessage, id: prev.length + 1 }]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
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

        // Add a brief introduction message
        addMessage({
            sender: Sender.BOT,
            text: "Perfect! I've found the top 3 insurance plans that match your trip. The first one is our best recommendation based on your profile and travel needs.",
        });

        // Display recommendations using the new enhanced card
        setTimeout(() => {
          addMessage({
              sender: Sender.BOT,
              component: (
                  <div className="space-y-4">
                      {chatbotResponse.recommendations.map((plan, index) => (
                          <RecommendedPlanCard
                              key={plan.id}
                              recommendation={plan}
                              isBestPlan={index === 0}
                              onSelect={handlePlanSelection}
                          />
                      ))}
                  </div>
              ),
          });
          setFlowState('awaiting_plan_selection');
        }, 1000);

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
    setIsLoading(true);
    setError(null);

    try {
      const userData = await postUserInputData({
        input_type: "nric",
        nric_value: nricInputValue,
      });

      // Apply theme based on destination
      const destinationCode = userData.destination;
      const countryTheme = getThemeForCountry(destinationCode);
      setTheme(countryTheme);

      setCurrentScootUserData(userData);
      addMessage({
        sender: Sender.BOT,
        text: "Perfect! I found your trip details. Please review and confirm:",
      });
      addMessage({
        sender: Sender.BOT,
        component: (
          <FlightDetailsCard
            flightData={userData}
            onConfirm={handleFlightDetailsConfirm}
            onEdit={() => setFlowState('reviewing_flight_details')}
          />
        ),
      });
      setFlowState('reviewing_flight_details');
    } catch (err) {
      console.error("Error during NRIC lookup:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      addMessage({
        sender: Sender.BOT,
        text: `Sorry, I couldn't find trip details for that NRIC. ${errorMessage}`,
      });
      setFlowState('awaiting_initial_action');
    } finally {
      setIsLoading(false);
    }
    setNricInputValue(''); // Clear input after submission
  };

  const handleManualDetailsSubmit = async (details: ManualInputDetails) => {
    addMessage({ sender: Sender.USER, text: `Manual details submitted.` });
    setIsLoading(true);
    setError(null);

    try {
      const userData = await postUserInputData({
        input_type: "manual_entry",
        manual_details: details,
      });

      // Apply theme based on destination
      const destinationCode = userData.destination;
      const countryTheme = getThemeForCountry(destinationCode);
      setTheme(countryTheme);

      setCurrentScootUserData(userData);
      addMessage({
        sender: Sender.BOT,
        text: "Thanks! Here's a summary of your trip details. Please review and confirm:",
      });
      addMessage({
        sender: Sender.BOT,
        component: (
          <FlightDetailsCard
            flightData={userData}
            onConfirm={handleFlightDetailsConfirm}
            onEdit={() => setFlowState('reviewing_flight_details')}
          />
        ),
      });
      setFlowState('reviewing_flight_details');
    } catch (err) {
      console.error("Error during manual entry processing:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      addMessage({
        sender: Sender.BOT,
        text: `Sorry, I encountered an error: ${errorMessage} Please try again.`,
      });
      setFlowState('awaiting_initial_action');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFFileSubmit = async (base64Pdf: string) => {
    addMessage({ sender: Sender.USER, text: `PDF uploaded.` });
    setIsLoading(true);
    setError(null);
    try {
      const userData = await postUserInputData({
        input_type: "pdf_upload",
        pdf_base64: base64Pdf,
      });
      
      // Apply theme based on destination (handle country code)
      const destinationCode = userData.destination; // This is likely a country code (e.g., "JP", "TH")
      const countryTheme = getThemeForCountry(destinationCode);
      setTheme(countryTheme);
      
      setCurrentScootUserData(userData);
      addMessage({
        sender: Sender.BOT,
        text: "Great! I've extracted your flight details. Please review them below:",
      });
      addMessage({
        sender: Sender.BOT,
        component: (
          <FlightDetailsCard
            flightData={userData}
            onConfirm={handleFlightDetailsConfirm}
            onEdit={() => setFlowState('reviewing_flight_details')}
          />
        ),
      });
      setFlowState('reviewing_flight_details');
    } catch (err) {
      console.error("Error during PDF processing:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      addMessage({
        sender: Sender.BOT,
        text: `Sorry, I encountered an error: ${errorMessage} Please try again.`,
      });
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          getUserTrackingStatus(user.id).then(status => {
            if (!status.allows_tracking) {
              setFlowState('awaiting_booking_confirmation');
            } else {
              setFlowState('awaiting_initial_action');
            }
          }).catch(() => setFlowState('awaiting_initial_action'));
        } catch {
          setFlowState('awaiting_initial_action');
        }
      } else {
        setFlowState('awaiting_initial_action');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingConfirmationUpload = () => {
    setFlowState('awaiting_pdf_upload');
    addMessage({
      sender: Sender.BOT,
      text: 'Please upload your booking confirmation PDF:',
    });
  };

  const handleFlightDetailsConfirm = async (confirmedData: ScootUserData) => {
    setCurrentScootUserData(confirmedData);
    addMessage({
      sender: Sender.BOT,
      text: "Perfect! Let me find the best travel insurance recommendations for your trip.",
    });

    // Apply theme based on destination (handle country code)
    const destinationCode = confirmedData.destination; // This is likely a country code (e.g., "JP", "TH")
    const countryTheme = getThemeForCountry(destinationCode);
    setTheme(countryTheme);

    await processUserInputAndFetchRecommendations({
      input_type: "manual_entry",
      manual_details: {
        origin: confirmedData.origin,
        destination: confirmedData.destination,
        departure_date: confirmedData.departure_date,
        return_date: confirmedData.return_date || confirmedData.departure_date,
        num_travelers: confirmedData.num_travelers,
        ages: confirmedData.ages,
        trip_type: confirmedData.trip_type,
        flexi_flight: confirmedData.flexi_flight,
      },
    });
  };

  const handlePlanSelection = (plan: Recommendation) => {
    setSelectedPlan(plan);
    addMessage({
      sender: Sender.USER,
      text: `I'd like to select the ${plan.policy_name} plan.`,
    });

    setTimeout(() => {
      addMessage({
        sender: Sender.BOT,
        text: `Great choice! The ${plan.policy_name} is an excellent option for your trip. Let me prepare your payment details.`,
      });

      setTimeout(() => {
        addMessage({
          sender: Sender.BOT,
          text: "Here's a summary of your selected plan:",
        });

        setTimeout(() => {
          addMessage({
            sender: Sender.BOT,
            component: (
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800">{plan.policy_name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Price:</span>
                    <span className="font-bold text-primary">{plan.currency} ${plan.price.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <p className="text-gray-700">{plan.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleProceedToPayment(plan)}
                    className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => {
                      setFlowState('awaiting_plan_selection');
                      addMessage({
                        sender: Sender.BOT,
                        text: "No problem! Feel free to choose a different plan from the options above.",
                      });
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Change Plan
                  </button>
                </div>
              </div>
            ),
          });
          setFlowState('confirming_payment');
        }, 800);
      }, 1000);
    }, 500);
  };

  const handleProceedToPayment = (plan: Recommendation) => {
    addMessage({
      sender: Sender.USER,
      text: "Proceed to payment",
    });

    setTimeout(() => {
      addMessage({
        sender: Sender.BOT,
        text: "Great! Please select your preferred payment method below:",
      });

      setTimeout(() => {
        addMessage({
          sender: Sender.BOT,
          component: (
            <PaymentMethodCard
              plan={plan}
              onPaymentComplete={() => handlePaymentComplete(plan)}
              onCancel={() => {
                setFlowState('confirming_payment');
                addMessage({
                  sender: Sender.BOT,
                  text: "Payment cancelled. Would you like to select a different plan or try again?",
                });
              }}
            />
          ),
        });
        setFlowState('confirming_payment');
      }, 800);
    }, 500);
  };

  const handlePaymentComplete = (plan: Recommendation) => {
    addMessage({
      sender: Sender.BOT,
      text: `Payment successful! Your ${plan.policy_name} insurance has been confirmed.`,
    });

    setTimeout(() => {
      addMessage({
        sender: Sender.BOT,
        text: `You'll receive a confirmation email shortly with your policy details and documents. Your policy number will be sent to your registered email. Have a safe trip!`,
      });
      setFlowState('chatting_q_a');
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userQuestion = inputValue;
    addMessage({ sender: Sender.USER, text: userQuestion });
    setInputValue('');

    // Build context if available
    let context = '';
    if (currentScootUserData) {
      context = `User's trip: ${currentScootUserData.origin} to ${currentScootUserData.destination}, ${currentScootUserData.num_travelers} traveler(s), departing ${currentScootUserData.departure_date}`;
    }
    if (selectedPlan) {
      context += `. Selected insurance: ${selectedPlan.policy_name}`;
    }

    try {
      const response = await askQuestion(userQuestion, context || undefined);

      setTimeout(() => {
        addMessage({
          sender: Sender.BOT,
          text: response.answer
        });
      }, 800);
    } catch (error) {
      console.error('Error asking question:', error);
      setTimeout(() => {
        addMessage({
          sender: Sender.BOT,
          text: "I'm having trouble processing that question right now. Could you try rephrasing it or ask about specific insurance coverage?"
        });
      }, 800);
    }
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
                          flowState === 'awaiting_pdf_upload' ||
                          flowState === 'awaiting_booking_confirmation' ||
                          flowState === 'reviewing_flight_details';

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
                    <PDFUploadInput 
                        onSubmit={handlePDFFileSubmit} 
                        onCancel={() => {
                            // Return to booking confirmation if that's where we came from
                            const userStr = localStorage.getItem('user');
                            if (userStr) {
                                try {
                                    const user = JSON.parse(userStr);
                                    getUserTrackingStatus(user.id).then(status => {
                                        if (!status.allows_tracking) {
                                            setFlowState('awaiting_booking_confirmation');
                                        } else {
                                            setFlowState('awaiting_initial_action');
                                        }
                                    }).catch(() => setFlowState('awaiting_initial_action'));
                                } catch {
                                    setFlowState('awaiting_initial_action');
                                }
                            } else {
                                setFlowState('awaiting_initial_action');
                            }
                        }} 
                    />
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
