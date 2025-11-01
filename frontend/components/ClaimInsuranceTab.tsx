import React from 'react';
import { HashtagIcon, DocumentTextIcon } from './IconComponents';

const ClaimInsuranceTab: React.FC = () => {
    const handleStartClaim = () => {
        // In a real app, this would collect form data and trigger the claim submission flow.
        alert('Claim process started! (This is a demo)');
    };

    return (
        <div className="flex flex-col h-full text-text-main/90 p-4">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-text-main">Start a New Claim</h3>
                <p className="text-sm mt-1">
                    Please provide your policy details below to begin the claims process.
                </p>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="policyNumber" className="block text-sm font-medium text-text-main mb-1">
                        Policy Number
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <HashtagIcon className="h-5 w-5 text-text-main/40" />
                        </div>
                        <input
                            type="text"
                            id="policyNumber"
                            className="block w-full rounded-md border-text-main/30 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 sm:text-sm text-text-main"
                            placeholder="e.g., SG12345678"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="claimType" className="block text-sm font-medium text-text-main mb-1">
                        Claim Type
                    </label>
                    <div className="relative">
                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <DocumentTextIcon className="h-5 w-5 text-text-main/40" />
                        </div>
                        <select
                            id="claimType"
                            className="block w-full appearance-none rounded-md border-text-main/30 bg-white py-2 pl-10 pr-8 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 sm:text-sm text-text-main"
                        >
                            <option>Medical Expenses</option>
                            <option>Trip Cancellation</option>
                            <option>Baggage Loss/Delay</option>
                            <option>Flight Delay</option>
                            <option>Other</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-main/40">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="button"
                        onClick={handleStartClaim}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Start Claim Process
                    </button>
                </div>
            </form>
            
            <p className="text-xs text-text-main/50 mt-auto text-center">
                For complex claims, you can always contact our support team.
            </p>
        </div>
    );
};

export default ClaimInsuranceTab;