import React from 'react';
import { IdCardIcon, KeyboardIcon, FileUploadIcon } from './IconComponents';

interface InitialActionsCardProps {
  onAction: (action: 'nric' | 'manual_entry' | 'pdf_upload') => void;
}

const InitialActionsCard: React.FC<InitialActionsCardProps> = ({ onAction }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-text-main/10">
        <div className="p-4 border-b border-text-main/10">
            <h3 className="font-bold text-text-main text-base">How would you like to proceed?</h3>
        </div>
        <div className="p-3 bg-background/50 flex flex-col gap-2">
            <button
                onClick={() => onAction('nric')}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
                <IdCardIcon className="w-5 h-5" />
                NRIC
            </button>
            <button
                onClick={() => onAction('manual_entry')}
                className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
                <KeyboardIcon className="w-5 h-5" />
                Manual Entry
            </button>
            <button
                onClick={() => onAction('pdf_upload')}
                className="w-full bg-text-main/80 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
                <FileUploadIcon className="w-5 h-5" />
                PDF Upload
            </button>
        </div>
    </div>
  );
};

export default InitialActionsCard;
