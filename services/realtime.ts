
import { Device } from "../types";

export interface TrackingData {
  sessionId: string;
  lat: number;
  lng: number;
  speed: number | null;
  accuracy: number;
  timestamp: number;
  deviceName?: string;
}

const channel = new BroadcastChannel('geoguard_sync');

export const streamLocation = (data: TrackingData) => {
  channel.postMessage({ type: 'LOCATION_UPDATE', payload: data });
};

export const onLocationUpdate = (callback: (data: TrackingData) => void) => {
  const handler = (event: MessageEvent) => {
    if (event.data.type === 'LOCATION_UPDATE') {
      callback(event.data.payload);
    }
  };
  channel.addEventListener('message', handler);
  return () => channel.removeEventListener('message', handler);
};

export const requestSession = (sessionId: string) => {
  channel.postMessage({ type: 'SESSION_REQUEST', payload: sessionId });
};

export const onSessionRequest = (callback: (sessionId: string) => void) => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'SESSION_REQUEST') {
        callback(event.data.payload);
      }
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
};
