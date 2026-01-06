
import { TrackingData } from "../types";

const channel = new BroadcastChannel('shdw_sync');

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
