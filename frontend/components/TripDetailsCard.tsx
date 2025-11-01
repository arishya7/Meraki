
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
    <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-slate-gray/10">
        <div className="p-4 border-b border-slate-gray/10">
            <h3 className="font-bold text-slate-gray text-base">Please confirm your trip details</h3>
        </div>
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-slate-gray/90">
                <TripTypeIcon className="w-5 h-5 text-slate-gray/50"/>
                <span className="font-medium">{details.tripType === 'RT' ? 'Round Trip' : 'Single Trip'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-gray/90">
                <MapPinIcon className="w-5 h-5 text-slate-gray/50"/>
                <span className="font-medium">{details.departureCountry} to {details.arrivalCountry}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-gray/90">
                <CalendarIcon className="w-5 h-5 text-slate-gray/50"/>
                <span>{formatDate(details.departureDate)} - {details.returnDate ? formatDate(details.returnDate) : 'One Way'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-gray/90">
                <UsersIcon className="w-5 h-5 text-slate-gray/50"/>
                <span>{getTravelersText()}</span>
            </div>
        </div>
        <div className="p-3 bg-ivory-white/50 flex gap-2">
            <button
                onClick={onConfirm}
                className="flex-1 bg-deep-sky-blue text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
                Yes, Correct
            </button>
            <button
                onClick={onEdit}
                className="flex-1 bg-slate-gray/20 text-slate-gray font-bold py-2 px-4 rounded-lg hover:bg-slate-gray/30 transition-colors text-sm"
            >
                No, Edit
            </button>
        </div>
    </div>
  );
};

export default TripDetailsCard;
