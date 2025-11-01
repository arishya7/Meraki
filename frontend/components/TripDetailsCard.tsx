import React from 'react';
import { TripDetails } from '../types';
import { CalendarIcon, MapPinIcon, UsersIcon, TripTypeIcon } from './IconComponents';

interface TripDetailsCardProps {
  details: TripDetails;
  onConfirm: () => void;
  onEdit: () => void;
}

const TripDetailsCard: React.FC<TripDetailsCardProps> = ({ details, onConfirm, onEdit }) => {
  const getTravelersText = () => {
    let text = `${details.adultsCount} Adult${details.adultsCount !== 1 ? 's' : ''}`;
    if (details.childrenCount > 0) {
      text += `, ${details.childrenCount} Child${details.childrenCount !== 1 ? 'ren' : ''}`;
    }
    return text;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-text-main/10">
        <div className="p-4 border-b border-text-main/10">
            <h3 className="font-bold text-text-main text-base">Please confirm your trip details</h3>
        </div>
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-text-main/90">
                <TripTypeIcon className="w-5 h-5 text-text-main/50"/>
                <span className="font-medium">{details.tripType === 'RT' ? 'Round Trip' : 'Single Trip'}</span>
            </div>
            <div className="flex items-center gap-3 text-text-main/90">
                <MapPinIcon className="w-5 h-5 text-text-main/50"/>
                <span className="font-medium">{details.departureCountry} to {details.arrivalCountry}</span>
            </div>
            <div className="flex items-center gap-3 text-text-main/90">
                <CalendarIcon className="w-5 h-5 text-text-main/50"/>
                <span>{formatDate(details.departureDate)} - {details.returnDate ? formatDate(details.returnDate) : 'One Way'}</span>
            </div>
            <div className="flex items-center gap-3 text-text-main/90">
                <UsersIcon className="w-5 h-5 text-text-main/50"/>
                <span>{getTravelersText()}</span>
            </div>
        </div>
        <div className="p-3 bg-background/50 flex gap-2">
            <button
                onClick={onConfirm}
                className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
                Yes, Correct
            </button>
            <button
                onClick={onEdit}
                className="flex-1 bg-text-main/20 text-text-main font-bold py-2 px-4 rounded-lg hover:bg-text-main/30 transition-colors text-sm"
            >
                No, Edit
            </button>
        </div>
    </div>
  );
};

export default TripDetailsCard;
