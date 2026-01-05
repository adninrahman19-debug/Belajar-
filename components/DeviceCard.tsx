
import React from 'react';
import { Device, DeviceStatus } from '../types';
import { Battery, Wifi, WifiOff, MapPin, Clock } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onSelect: (device: Device) => void;
  isSelected: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSelect, isSelected }) => {
  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.ONLINE: return 'text-emerald-500 bg-emerald-50';
      case DeviceStatus.OFFLINE: return 'text-slate-400 bg-slate-50';
      case DeviceStatus.LOW_BATTERY: return 'text-rose-500 bg-rose-50';
      case DeviceStatus.STATIONARY: return 'text-amber-500 bg-amber-50';
    }
  };

  return (
    <div 
      onClick={() => onSelect(device)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
        isSelected 
        ? 'border-blue-500 bg-blue-50/30 shadow-md ring-1 ring-blue-500' 
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-slate-900">{device.name}</h4>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{device.type}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(device.status)}`}>
          {device.status.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          <span className="text-xs truncate">{device.location.address || 'Locating...'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery size={16} className={`${device.battery < 20 ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className="text-xs font-medium text-slate-700">{device.battery}%</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={16} />
            <span className="text-[10px]">
              {new Date(device.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
        <button className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          View History
        </button>
        <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          Ping Device
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
