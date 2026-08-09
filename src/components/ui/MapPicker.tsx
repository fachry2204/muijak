import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  lat: number;
  lng: number;
  address: string;
  onChange: (lat: number, lng: number) => void;
}

// Komponen untuk menangkap event klik dan geser
function LocationMarker({ position, onChange }: { position: L.LatLngExpression, onChange: (lat: number, lng: number) => void }) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker 
      draggable={true} 
      position={position}
      ref={markerRef}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const pos = marker.getLatLng();
            onChange(pos.lat, pos.lng);
          }
        },
      }}
    />
  );
}

// Komponen untuk memindahkan view map ketika koordinat berubah dari props
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16, {animate: false});
    map.invalidateSize({pan: false});
  }, [center, map]);
  return null;
}

// Pastikan tile memenuhi kontainer setelah modal, sidebar, atau form berubah ukuran.
function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const refresh = () => map.invalidateSize({pan: false});
    const timers = [
      window.setTimeout(refresh, 0),
      window.setTimeout(refresh, 150),
      window.setTimeout(refresh, 500),
    ];
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(refresh)
      : null;

    observer?.observe(container);
    window.addEventListener('resize', refresh);

    return () => {
      observer?.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('resize', refresh);
    };
  }, [map]);

  return null;
}

export default function MapPicker({ lat, lng, address, onChange }: MapPickerProps) {
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // Fungsi untuk mencari koordinat dari alamat
    const geocodeAddress = async () => {
      if (!address || address.length < 5) return;
      
      setSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const newLat = parseFloat(data[0].lat);
          const newLng = parseFloat(data[0].lon);
          onChange(newLat, newLng);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setSearching(false);
      }
    };

    // Delay pencarian untuk menghindari spam API (debounce)
    const timeoutId = setTimeout(() => {
      geocodeAddress();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [address]); // onChange is intentionally excluded to prevent loop

  return (
    <div className="relative z-0 mt-4 h-[360px] min-h-[300px] w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
      {searching && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 px-4 py-1.5 rounded-full shadow-md text-sm font-bold text-emerald-700">
          Mencari lokasi otomatis...
        </div>
      )}
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapResizeHandler />
        <MapUpdater center={[lat, lng]} />
        <LocationMarker position={[lat, lng]} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
