import L from 'leaflet';
import { Map as MapIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef } from 'react';
import type { RouteStop } from '../types';

// Interactive Map Sub-Component with Polyline Route & Sequential Stop Markers
export const RouteInteractiveMap: React.FC<{
  depot: { name: string; address: string; latitude: number; longitude: number };
  stops: RouteStop[];
  isDark?: boolean;
}> = ({ depot, stops, isDark }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([depot.latitude, depot.longitude], 10);

    mapInstanceRef.current = map;

    // Basemap tiles
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: '&copy; Esri, OpenStreetMap contributors',
    }).addTo(map);

    // 1. Add Depot Marker
    const depotIcon = L.divIcon({
      className: 'custom-depot-marker',
      html: `<div style="background-color:#991b1b; color:#ffffff; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:6px; border:2px solid #ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.3); display:flex; items-center; gap:4px; white-space:nowrap;">
        🏢 DEPOT: ${depot.name.slice(0, 18)}...
      </div>`,
      iconSize: [120, 28],
      iconAnchor: [60, 14],
    });

    const depotMarker = L.marker([depot.latitude, depot.longitude], { icon: depotIcon }).addTo(map);
    depotMarker.bindPopup(`
      <div style="font-family:sans-serif; padding:4px;">
        <strong style="color:#991b1b; font-size:12px;">🏢 Depot: ${depot.name}</strong>
        <div style="font-size:11px; color:#4b5563; margin-top:2px;">${depot.address}</div>
        <div style="font-size:10px; color:#059669; font-weight:bold; margin-top:4px;">Route Start &amp; End Hub</div>
      </div>
    `);

    // 2. Add Sequential Stop Markers & Build Polyline Points
    const routeLatLngs: [number, number][] = [[depot.latitude, depot.longitude]];

    stops.forEach((stop) => {
      routeLatLngs.push([stop.latitude, stop.longitude]);

      const isChurch = stop.locationType === 'Church';
      const bgColor = isChurch ? '#8b5cf6' : '#f59e0b';
      const iconSymbol = isChurch ? '✝️' : '🏫';

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `<div style="background-color:${bgColor}; color:#ffffff; width:28px; height:28px; border-radius:50%; border:2px solid #ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; font-family:sans-serif;">
          ${stop.stopNumber}
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:sans-serif; padding:4px; max-width:220px;">
          <div style="font-size:10px; font-weight:bold; color:${bgColor}; text-transform:uppercase;">
            Stop #${stop.stopNumber} · ${iconSymbol} ${stop.locationType} Delivery Site
          </div>
          <strong style="font-size:12px; color:#111827; display:block; margin-top:2px;">${stop.locationName}</strong>
          <div style="font-size:11px; color:#4b5563;">${stop.locationAddress}, ${stop.city}</div>
          <div style="margin-top:6px; padding-top:4px; border-top:1px solid #e5e7eb; font-size:11px;">
            <div>🕒 Arrival: <strong>${stop.estimatedArrival} - ${stop.departureTime}</strong></div>
            <div>📊 Poverty Rate: <strong>${stop.surroundingPovertyRate.toFixed(1)}%</strong></div>
            <div>🚨 Food Gap: <span style="color:#dc2626; font-weight:bold;">${stop.surroundingGapType}</span></div>
            <div>🛒 Provisions: <span style="color:#059669;">${stop.keyNeedsSummary}</span></div>
          </div>
        </div>
      `);
    });

    // Close loop back to Depot
    routeLatLngs.push([depot.latitude, depot.longitude]);

    // 3. Draw Route Polyline
    const _routePolyline = L.polyline(routeLatLngs, {
      color: '#a50f15',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(map);

    // 4. Fit map bounds to contain all stops & depot
    if (routeLatLngs.length > 1) {
      map.fitBounds(L.latLngBounds(routeLatLngs), { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [depot, stops, isDark]);

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md text-xs flex items-center gap-2">
        <MapIcon className="w-3.5 h-3.5 text-[#a50f15]" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">Food Truck Driving Circuit Map</span>
        <span className="text-[10px] text-slate-500 font-mono">({stops.length} Church/School Delivery Stops)</span>
      </div>
    </div>
  );
};
