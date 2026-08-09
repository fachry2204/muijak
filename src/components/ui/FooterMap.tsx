"use client";

import { useEffect, useRef, useState } from 'react';

interface FooterMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  label?: string;
}

export default function FooterMap({ 
  address,
  lat, 
  lng, 
  zoom = 15,
  label = "MUI DKI Jakarta"
}: FooterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: lat || -6.1252,
    lng: lng || 106.8738,
  });

  // Geocode address when address or lat/lng prop changes
  useEffect(() => {
    let cancelled = false;

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      setCoords({ lat, lng });
      return;
    }

    if (address && address.trim().length > 3) {
      const timer = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
          .then((res) => res.json())
          .then((data) => {
            if (!cancelled && data && data.length > 0) {
              const newLat = parseFloat(data[0].lat);
              const newLng = parseFloat(data[0].lon);
              if (!isNaN(newLat) && !isNaN(newLng)) {
                setCoords({ lat: newLat, lng: newLng });
              }
            }
          })
          .catch((err) => console.error("Geocoding failed:", err));
      }, 500);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, [address, lat, lng]);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    const resizeTimers: number[] = [];

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const container = mapRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [coords.lat, coords.lng],
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
        doubleClickZoom: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Hitung ulang ukuran ketika tab, sidebar, atau kontainer berubah ukuran.
      const refreshMapSize = () => map.invalidateSize({pan: false});
      requestAnimationFrame(refreshMapSize);
      resizeTimers.push(window.setTimeout(refreshMapSize, 150));
      resizeTimers.push(window.setTimeout(refreshMapSize, 500));

      if (mapRef.current && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(refreshMapSize);
        resizeObserver.observe(mapRef.current);
      }

      const customIcon = L.divIcon({
        className: '',
        html: `
          <div style="width:32px;height:42px;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
            <svg viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16 0 0 7.16 0 16c0 10.53 14.29 24.76 15.27 25.72a1 1 0 0 0 1.46 0C17.71 40.76 32 26.53 32 16 32 7.16 24.84 0 16 0z" fill="#0A6B41"/>
              <circle cx="16" cy="16" r="7" fill="white"/>
              <circle cx="16" cy="16" r="4" fill="#0A6B41"/>
            </svg>
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -46],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Arial,sans-serif;min-width:160px;padding:4px 0;">
          <div style="font-weight:bold;color:#0A6B41;font-size:13px;margin-bottom:4px;">${label}</div>
          <div style="font-size:11px;color:#555;line-height:1.5;">
            ${address || 'Lokasi MUI'}
          </div>
          <a 
            href="https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=${zoom}/${coords.lat}/${coords.lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="display:inline-block;margin-top:8px;font-size:11px;color:#0A6B41;font-weight:bold;"
          >Lihat Peta Penuh ↗</a>
        </div>
      `);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      resizeTimers.forEach((timer) => window.clearTimeout(timer));
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coords, zoom, label, address]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div
        ref={mapRef}
        className="h-full w-full"
        style={{ minHeight: '176px', width: '100%', height: '100%', background: '#e5e3df' }}
      />
    </>
  );
}
