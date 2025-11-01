import React, { useState } from 'react';
import { Recommendation } from '../types';

interface RecommendedPlanCardProps {
  recommendation: Recommendation;
  isBestPlan: boolean;
  onSelect: (recommendation: Recommendation) => void;
}

const RecommendedPlanCard: React.FC<RecommendedPlanCardProps> = ({
  recommendation,
  isBestPlan,
  onSelect,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-md border-2 ${
        isBestPlan ? 'border-primary' : 'border-gray-200'
      } relative overflow-hidden transition-all hover:shadow-lg`}
    >
      {isBestPlan && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg transform rotate-12">
          Best Match
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800 pr-8">
            {recommendation.policy_name}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-primary">
              {recommendation.currency} ${recommendation.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Total price</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{recommendation.description}</p>

        {/* Pros Section */}
        {recommendation.pros && recommendation.pros.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Key Benefits
            </h4>
            <ul className="space-y-1">
              {recommendation.pros.slice(0, showDetails ? undefined : 3).map((pro, idx) => (
                <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons Section */}
        {recommendation.cons && recommendation.cons.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Considerations
            </h4>
            <ul className="space-y-1">
              {recommendation.cons.slice(0, showDetails ? undefined : 2).map((con, idx) => (
                <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show More/Less Toggle */}
        {(recommendation.pros.length > 3 || recommendation.cons.length > 2) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-primary font-semibold hover:underline mb-3"
          >
            {showDetails ? 'Show Less' : 'Show More Details'}
          </button>
        )}

        {/* Score Badge (if available) */}
        {recommendation.score > 0 && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-blue-700 font-medium">
              {isBestPlan ? 'Highest match score based on your profile' : `Match score: ${recommendation.score.toFixed(0)}`}
            </span>
          </div>
        )}
      </div>

      {/* Select Button */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => onSelect(recommendation)}
          className={`w-full font-bold py-3 rounded-lg transition-all ${
            isBestPlan
              ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
              : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
          }`}
        >
          Select This Plan
        </button>
      </div>

      {/* Citations (if available) */}
      {showDetails && recommendation.citations && recommendation.citations.length > 0 && (
        <div className="px-5 pb-4">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-800">
              Sources & References
            </summary>
            <ul className="mt-2 space-y-1 ml-4">
              {recommendation.citations.map((citation, idx) => (
                <li key={idx} className="list-disc">
                  {citation}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};

export default RecommendedPlanCard;
