
import React, { useEffect, useState } from 'react';
import { Device } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  devices: Device[];
  selectedDevice: Device | null;
}

const MapView: React.FC<MapViewProps> = ({ devices, selectedDevice }) => {
  // We'll simulate a map grid with markers
  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden rounded-2xl shadow-inner border border-slate-300">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Map Labels Simulation */}
      <div className="absolute top-10 left-1/4 text-slate-400 text-xs font-bold uppercase tracking-widest pointer-events-none">Financial District</div>
      <div className="absolute bottom-1/4 right-1/3 text-slate-400 text-xs font-bold uppercase tracking-widest pointer-events-none">Golden Gate Park</div>
      
      {/* Markers */}
      {devices.map((device) => {
        // Simple mapping from lat/lng to container %
        // San Francisco range: lat 37.7 to 37.8, lng -122.5 to -122.4
        const x = ((device.location.lng + 122.5) / 0.1) * 100;
        const y = 100 - (((device.location.lat - 37.7) / 0.1) * 100);

        const isSelected = selectedDevice?.id === device.id;

        return (
          <div
            key={device.id}
            className="absolute transition-all duration-700 ease-in-out cursor-pointer group"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {isSelected && (
              <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
            )}
            
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 ${
              isSelected ? 'bg-blue-600 border-white scale-125 z-20' : 'bg-white border-slate-200 scale-100 z-10'
            } transition-transform`}>
              <MapPin size={20} className={isSelected ? 'text-white' : 'text-slate-600'} />
            </div>

            {/* Label */}
            <div className={`absolute left-1/2 -top-10 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isSelected ? 'opacity-100' : ''}`}>
              {device.name}
            </div>
          </div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button className="p-3 bg-white text-slate-700 rounded-xl shadow-lg hover:bg-slate-50 border border-slate-200 transition-colors">
          <Navigation size={20} />
        </button>
      </div>

      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">Operational Area</h3>
        <p className="text-xs text-slate-500">San Francisco Metropolitan</p>
      </div>
    </div>
  );
};

export default MapView;
