
import React, { useEffect, useRef } from 'react';
import { TrackingData } from '../../types';

interface LiveMapProps {
  trackingData: TrackingData | null;
}

const LiveMap: React.FC<LiveMapProps> = ({ trackingData }) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const containerId = 'map-container';

  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerId, {
        zoomControl: false,
        attributionControl: false
      }).setView([-6.2000, 106.8166], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (trackingData && mapRef.current && L) {
      const pos: [number, number] = [trackingData.lat, trackingData.lng];

      if (!markerRef.current) {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative">
              <div class="absolute -inset-8 border border-cyan-500/20 rounded-full animate-ping"></div>
              <div class="live-marker"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        markerRef.current = L.marker(pos, { icon: customIcon }).addTo(mapRef.current);
        
        circleRef.current = L.circle(pos, {
          radius: trackingData.accuracy,
          color: '#00d4ff',
          weight: 1,
          opacity: 0.3,
          fillColor: '#00d4ff',
          fillOpacity: 0.05
        }).addTo(mapRef.current);

        mapRef.current.setView(pos, 16);
      } else {
        markerRef.current.setLatLng(pos);
        circleRef.current.setLatLng(pos);
        circleRef.current.setRadius(trackingData.accuracy);
      }

      mapRef.current.panTo(pos, { animate: true, duration: 1.5 });
    }
  }, [trackingData]);

  return <div id={containerId} className="w-full h-full shadow-inner bg-[#0a0a0a]" />;
};

export default LiveMap;
