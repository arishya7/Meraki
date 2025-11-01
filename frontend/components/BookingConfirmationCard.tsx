import React from 'react';
import { FileUploadIcon } from './IconComponents';

interface BookingConfirmationCardProps {
  onUpload: () => void;
}

const BookingConfirmationCard: React.FC<BookingConfirmationCardProps> = ({ onUpload }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-text-main/10">
      <div className="p-4 border-b border-text-main/10">
        <h3 className="font-bold text-text-main text-base">Got your booking confirmation handy?</h3>
      </div>
      <div className="p-3 bg-background/50">
        <p className="text-text-main/80 mb-3 text-sm">
          You can just drop it here and I'll grab the details
        </p>
        <button
          onClick={onUpload}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
        >
          <FileUploadIcon className="w-5 h-5" />
          Upload Booking Confirmation
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationCard;
