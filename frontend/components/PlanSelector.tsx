
import React from 'react';
import { InsurancePlan } from '../types';
import PlanCard from './PlanCard';

interface PlanSelectorProps {
    plans: InsurancePlan[];
    onSelectPlan: (plan: InsurancePlan) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ plans, onSelectPlan }) => {
    return (
        <div className="space-y-3">
            {plans.map(plan => (
                <PlanCard key={plan.name} plan={plan} onSelect={onSelectPlan} />
            ))}
        </div>
    );
};

export default PlanSelector;