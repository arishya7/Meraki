// FIX: Import React to use React.ReactNode type.
import React from 'react';

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: number;
  text?: string;
  sender: Sender;
  component?: React.ReactNode;
}

export interface TripDetails {
  tripType: 'RT' | 'ST';
  departureDate: string;
  returnDate?: string;
  departureCountry: string;
  arrivalCountry: string;
  adultsCount: number;
  childrenCount: number;
}

export interface InsurancePlan {
  name: string;
  price: number;
  medicalCoverage: string;
  tripCancellation: string;
  baggageProtection: string;
  highlight?: boolean;
}