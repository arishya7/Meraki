import React from 'react';
import { InsurancePlan } from '../types';
import { MedicalIcon, BaggageIcon, CancellationIcon } from './IconComponents';

interface PlanCardProps {
    plan: InsurancePlan;
    onSelect: (plan: InsurancePlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${plan.highlight ? 'border-mint-green' : 'border-slate-gray/20'} relative`}>
      {plan.highlight && (
        <div className="absolute -top-3 right-3 bg-mint-green text-white text-xs font-bold px-2 py-1 rounded-full">
          Recommended
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
            <h4 className="text-lg font-bold text-slate-gray">{plan.name}</h4>
            <p className="text-xl font-extrabold text-mint-green">${plan.price.toFixed(2)}</p>
        </div>
        <p className="text-xs text-slate-gray/70 mb-4">Total price for all travelers</p>
        
        <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-gray/90">
                    <MedicalIcon className="w-4 h-4 text-deep-sky-blue" />
                    <span>Medical Coverage</span>
                </div>
                <span className="font-semibold text-slate-gray">{plan.medicalCoverage}</span>
            </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-gray/90">
                    <CancellationIcon className="w-4 h-4 text-warm-peach" />
                    <span>Trip Cancellation</span>
                </div>
                <span className="font-semibold text-slate-gray">{plan.tripCancellation}</span>
            </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-gray/90">
                    <BaggageIcon className="w-4 h-4 text-soft-lavender" />
                    <span>Baggage Protection</span>
                </div>
                <span className="font-semibold text-slate-gray">{plan.baggageProtection}</span>
            </div>
        </div>
      </div>
      <div className="p-3 bg-ivory-white/50 rounded-b-xl">
         <button 
            onClick={() => onSelect(plan)}
            className={`w-full font-bold py-2 rounded-lg transition-all ${plan.highlight ? 'bg-mint-green text-white hover:opacity-90' : 'bg-slate-gray/20 text-slate-gray hover:bg-slate-gray/30'}`}
        >
            Select Plan
        </button>
      </div>
    </div>
  );
};

export default PlanCard;