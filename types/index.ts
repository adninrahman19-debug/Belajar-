
export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  LOW_BATTERY = 'low_battery',
  STATIONARY = 'stationary'
}

export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet' | 'iot';
  status: DeviceStatus;
  lastSeen: string;
  battery: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface MovementHistory {
  timestamp: string;
  lat: number;
  lng: number;
}

export interface TechnicalBlueprint {
  title: string;
  code: string;
  description: string;
  language: string;
}

export interface TrackingData {
  sessionId: string;
  lat: number;
  lng: number;
  speed: number | null;
  accuracy: number;
  timestamp: number;
  deviceName?: string;
}
