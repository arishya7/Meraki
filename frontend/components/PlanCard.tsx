import React from 'react';
import { InsurancePlan } from '../types';
import { MedicalIcon, BaggageIcon, CancellationIcon } from './IconComponents';

interface PlanCardProps {
    plan: InsurancePlan;
    onSelect: (plan: InsurancePlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${plan.highlight ? 'border-primary' : 'border-text-main/20'} relative`}>
      {plan.highlight && (
        <div className="absolute -top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
          Recommended
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
            <h4 className="text-lg font-bold text-text-main">{plan.name}</h4>
            <p className="text-xl font-extrabold text-primary">${plan.price.toFixed(2)}</p>
        </div>
        <p className="text-xs text-text-main/70 mb-4">Total price for all travelers</p>
        
        <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-main/90">
                    <MedicalIcon className="w-4 h-4 text-secondary" />
                    <span>Medical Coverage</span>
                </div>
                <span className="font-semibold text-text-main">{plan.medicalCoverage}</span>
            </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-main/90">
                    <CancellationIcon className="w-4 h-4 text-highlight" />
                    <span>Trip Cancellation</span>
                </div>
                <span className="font-semibold text-text-main">{plan.tripCancellation}</span>
            </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-main/90">
                    <BaggageIcon className="w-4 h-4 text-accent" />
                    <span>Baggage Protection</span>
                </div>
                <span className="font-semibold text-text-main">{plan.baggageProtection}</span>
            </div>
        </div>
      </div>
      <div className="p-3 bg-background/50 rounded-b-xl">
         <button 
            onClick={() => onSelect(plan)}
            className={`w-full font-bold py-2 rounded-lg transition-all ${plan.highlight ? 'bg-primary text-white hover:opacity-90' : 'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-white'}`}
        >
            Select Plan
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
