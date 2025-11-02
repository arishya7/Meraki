import React from 'react';

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: number;
  sender: Sender;
  text?: string;
  component?: React.ReactNode;
}

// --- Backend Schemas (Copied/Adapted from FastAPI backend) ---

// Represents a single claim record
export interface ClaimData {
  claim_number: string;
  product_category: string;
  product_name: string;
  claim_status: string;
  accident_date: string; // Using string for date for simplicity with JSON serialization
  report_date: string; // Using string for date for simplicity with JSON serialization
  closed_date: string | null; // Using string, can be null
  destination: string;
  claim_type: string;
  cause_of_loss: string;
  loss_type: string;
  gross_incurred: number;
  gross_paid: number;
  gross_reserve: number;
  net_incurred: number;
  net_paid: number;
  net_reserve: number;
}

// Main user data structure from backend
export interface ScootUserData {
  user_id: string;
  nric: string;
  origin: string; // Could be ISO code or full name depending on context
  destination: string; // Could be ISO code or full name depending on context
  departure_date: string; // Using string for date
  return_date: string | null; // Using string, can be null for one-way
  num_travelers: number;
  ages: number[];
  trip_type: "round_trip" | "one_way";
  flexi_flight: boolean;
  claims_history: ClaimData[];
}

// For manual entry of user details
export interface ManualInputDetails {
  origin: string;
  destination: string;
  departure_date: string; // As YYYY-MM-DD string
  return_date: string; // As YYYY-MM-DD string
  num_travelers?: number; // Optional with default in backend
  ages?: number[]; // Optional with default in backend
  trip_type?: "round_trip" | "one_way"; // Optional with default in backend
  flexi_flight?: boolean; // Optional with default in backend
}

// Request body for the /user/input_data API
export interface UserDataInputRequest {
  input_type: "nric" | "pdf_upload" | "manual_entry";
  nric_value?: string;
  pdf_base64?: string;
  manual_details?: ManualInputDetails;
}

// Recommendation object structure
export interface Recommendation {
  id: string;
  policy_name: string;
  description: string;
  pros: string[];
  cons: string[];
  price: number;
  currency: string;
  citations: string[];
  score: number;
}

// Response for the /chat/recommend_plans API
export interface ChatbotResponse {
  message: string;
  recommendations: Recommendation[];
}

// --- Frontend Specific Interfaces (Reconciled with Backend where applicable) ---

// Used for initial user profile display, can be adapted from ScootUserData or UserProfileResponse
export interface UserProfile {
  user_id: string; // Add user_id to match ScootUserData/UserProfileResponse
  nric: string;
  name: string;
  destination_country: string;
  claims_summary: Array<{ claim_number: string; claim_type: string; status: string; net_paid: number }>;
}

// Represents core trip details, subset of ScootUserData or ManualInputDetails
export interface TripDetails {
  destination: string;
  departureDate: string;
  returnDate: string;
  adultsCount: number;
  childrenCount: number;
}

// Represents a summary of flight details (similar to ScootUserData but might be used in a different context)
export interface FlightSummary {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  num_travelers: number;
  trip_type: string;
  flexi_flight: boolean;
}

// Response from backend /flights/summary endpoint
export interface FlightSummaryResponse {
  nric: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  num_travelers: number;
  trip_type: string;
  flexi_flight: boolean;
}

// Placeholder for individual insurance plan details for display purposes
export interface InsurancePlan {
  name: string;
  price: number;
  medicalCoverage: string;
  tripCancellation: string;
  baggageProtection: string;
  highlight?: boolean;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
    background: string;
    text: string;
  };
  backgroundImage?: string;
}
