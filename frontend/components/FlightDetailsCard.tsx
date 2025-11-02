import React, { useState } from 'react';
import { ScootUserData } from '../types';

interface FlightDetailsCardProps {
  flightData: ScootUserData;
  onConfirm: (data: ScootUserData) => void;
  onEdit: () => void;
}

const FlightDetailsCard: React.FC<FlightDetailsCardProps> = ({ flightData, onConfirm, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(flightData);

  const handleSave = () => {
    setIsEditing(false);
    onConfirm(editedData);
  };

  const handleCancel = () => {
    setEditedData(flightData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-text-main/10 p-4">
        <h3 className="font-bold text-text-main text-base mb-4">Edit Flight Details</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Origin</label>
            <input
              type="text"
              value={editedData.origin}
              onChange={(e) => setEditedData({ ...editedData, origin: e.target.value })}
              className="w-full px-3 py-2 border border-text-main/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Destination</label>
            <input
              type="text"
              value={editedData.destination}
              onChange={(e) => setEditedData({ ...editedData, destination: e.target.value })}
              className="w-full px-3 py-2 border border-text-main/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Departure Date</label>
            <input
              type="date"
              value={editedData.departure_date}
              onChange={(e) => setEditedData({ ...editedData, departure_date: e.target.value })}
              className="w-full px-3 py-2 border border-text-main/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {editedData.return_date && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Return Date</label>
              <input
                type="date"
                value={editedData.return_date || ''}
                onChange={(e) => setEditedData({ ...editedData, return_date: e.target.value || null })}
                className="w-full px-3 py-2 border border-text-main/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Number of Travelers</label>
            <input
              type="number"
              min="1"
              value={editedData.num_travelers}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string while typing, otherwise parse to number
                setEditedData({
                  ...editedData,
                  num_travelers: value === '' ? '' as any : Math.max(1, parseInt(value) || 1)
                });
              }}
              onBlur={(e) => {
                // Ensure we have a valid number when user leaves the field
                const value = parseInt(e.target.value);
                if (!value || value < 1) {
                  setEditedData({ ...editedData, num_travelers: 1 });
                }
              }}
              className="w-full px-3 py-2 border border-text-main/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Trip Type</label>
            <select
              value={editedData.trip_type}
              onChange={(e) => setEditedData({ ...editedData, trip_type: e.target.value as 'round_trip' | 'one_way' })}
              className="w-full px-3 py-2 border border-text-main/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="round_trip">Round Trip</option>
              <option value="one_way">One Way</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden text-sm shadow-sm border border-text-main/10">
      <div className="p-4 border-b border-text-main/10">
        <h3 className="font-bold text-text-main text-base">Flight Details</h3>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-text-main/70">Origin:</span>
          <span className="font-semibold text-text-main">{flightData.origin}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-main/70">Destination:</span>
          <span className="font-semibold text-text-main">{flightData.destination}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-main/70">Departure Date:</span>
          <span className="font-semibold text-text-main">{new Date(flightData.departure_date).toLocaleDateString()}</span>
        </div>
        {flightData.return_date && (
          <div className="flex justify-between">
            <span className="text-text-main/70">Return Date:</span>
            <span className="font-semibold text-text-main">{new Date(flightData.return_date).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-text-main/70">Travelers:</span>
          <span className="font-semibold text-text-main">{flightData.num_travelers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-main/70">Trip Type:</span>
          <span className="font-semibold text-text-main">{flightData.trip_type === 'round_trip' ? 'Round Trip' : 'One Way'}</span>
        </div>
      </div>
      <div className="p-3 bg-background/50 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onConfirm(flightData)}
          className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Looks Good!
        </button>
      </div>
    </div>
  );
};

export default FlightDetailsCard;
