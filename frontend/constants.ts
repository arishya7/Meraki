
import { TripDetails, InsurancePlan } from './types';

export const MOCK_TRIP_DETAILS: TripDetails = {
  tripType: 'RT',
  departureDate: '2024-12-25',
  returnDate: '2025-01-05',
  departureCountry: 'SG',
  arrivalCountry: 'JP',
  adultsCount: 2,
  childrenCount: 0,
};

export const MOCK_INSURANCE_PLANS: InsurancePlan[] = [
  {
    name: 'TravelEasy Silver',
    price: 45.50,
    medicalCoverage: '$150,000',
    tripCancellation: '$2,000',
    baggageProtection: '$750',
  },
  {
    name: 'TravelEasy Gold',
    price: 72.80,
    medicalCoverage: '$500,000',
    tripCancellation: '$5,000',
    baggageProtection: '$1,500',
    highlight: true,
  },
  {
    name: 'TravelEasy Platinum',
    price: 99.90,
    medicalCoverage: '$1,000,000',
    tripCancellation: '$10,000',
    baggageProtection: '$2,500',
  },
];