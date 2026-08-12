import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Custom Leaflet Green Sprout Pin Icon
const greenIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `<div style="background-color: #15803d; border: 2px solid #22c55e; width: 24px; height: 24px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(34,197,94,0.5);">
    <div style="background-color: #ffffff; width: 8px; height: 8px; borderRadius: 50%;"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export interface MapMarkerItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'FARM' | 'FIELD';
  details?: string;
}

interface FarmLocationMapProps {
  markers: MapMarkerItem[];
  defaultCenter?: [number, number];
  zoom?: number;
}

export const FarmLocationMap: React.FC<FarmLocationMapProps> = ({
  markers,
  defaultCenter = [30.7333, 76.7794], // Default Punjab Ag region
  zoom = 12,
}) => {
  const validMarkers = markers.filter((m) => m.latitude && m.longitude);

  if (validMarkers.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-3 font-sans">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <MapPin className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-200">No Location Coordinates Available</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Specify valid latitude and longitude coordinates during farm or field creation to render
          Leaflet map markers.
        </p>
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-400 font-mono text-[10px]"
        >
          REAL COORDINATE MARKERS ONLY
        </Badge>
      </div>
    );
  }

  const center: [number, number] =
    validMarkers.length > 0 ? [validMarkers[0].latitude, validMarkers[0].longitude] : defaultCenter;

  return (
    <div className="rounded-2xl border border-dhara-surfaceBorder overflow-hidden shadow-xl bg-dhara-slate relative">
      <div className="h-[340px] w-full z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validMarkers.map((m) => (
            <Marker key={m.id} position={[m.latitude, m.longitude]} icon={greenIcon}>
              <Popup>
                <div className="p-1 space-y-1 font-sans text-xs text-slate-900">
                  <div className="font-bold">{m.name}</div>
                  <div className="text-[11px] text-slate-600">Type: {m.type}</div>
                  {m.details && <div className="text-[11px] text-slate-500">{m.details}</div>}
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                    {m.latitude.toFixed(4)}°, {m.longitude.toFixed(4)}°
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-3 bg-dhara-dark/95 border-t border-dhara-surfaceBorder flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span>Active Location Markers ({validMarkers.length})</span>
        </div>
        <div className="text-[10px] text-slate-500 flex items-center space-x-1">
          <AlertCircle className="h-3 w-3 text-cyan-400" />
          <span>Geospatial polygon boundary support scheduled for future phase</span>
        </div>
      </div>
    </div>
  );
};
