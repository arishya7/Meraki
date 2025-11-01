import React from 'react';
import { InsurancePlan } from '../types';
import { CreditCardIcon } from './IconComponents';

interface PaymentConfirmationCardProps {
  plan: InsurancePlan;
  onProceed: () => void;
  onEdit: () => void;
}

const PaymentConfirmationCard: React.FC<PaymentConfirmationCardProps> = ({ plan, onProceed, onEdit }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-text-main/10">
        <div className="p-4 border-b border-text-main/10">
            <h3 className="font-bold text-text-main text-base">Confirm Your Selection</h3>
        </div>
        <div className="p-4 space-y-3">
            <p className="text-text-main/90">
                You have selected the <strong>{plan.name}</strong> plan for a total of <strong>${plan.price.toFixed(2)}</strong>.
            </p>
        </div>
        <div className="p-3 bg-background/50 flex gap-2">
            <button
                onClick={onProceed}
                className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
                <CreditCardIcon className="w-5 h-5" />
                Proceed to Payment
            </button>
            <button
                onClick={onEdit}
                className="flex-1 bg-text-main/20 text-text-main font-bold py-2 px-4 rounded-lg hover:bg-text-main/30 transition-colors text-sm"
            >
                Change Plan
            </button>
        </div>
    </div>
  );
};

export default PaymentConfirmationCard;