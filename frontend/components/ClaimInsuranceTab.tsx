import React from 'react';
import { DocumentTextIcon } from './IconComponents';

const ClaimInsuranceTab: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-gray/90 p-4">
            <div className="p-4 bg-mint-green/20 rounded-full mb-4">
                <DocumentTextIcon className="w-10 h-10 text-mint-green" />
            </div>
            <h3 className="text-lg font-bold text-slate-gray mb-2">Insurance Claims Portal</h3>
            <p className="text-sm max-w-xs">
                For security and to access your full policy details, all claims must be submitted through the official MSIG claims portal.
            </p>
            <button
                onClick={() => window.open('https://www.msig.com.sg/claims', '_blank')}
                className="mt-6 w-full max-w-xs bg-mint-green text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
                Go to MSIG Claim Portal
            </button>
            <p className="text-xs text-slate-gray/50 mt-2">You will be redirected to an external website.</p>
        </div>
    );
};

export default ClaimInsuranceTab;