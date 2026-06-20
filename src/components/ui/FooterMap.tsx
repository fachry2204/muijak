"use client";

import { useEffect, useRef } from 'react';

interface FooterMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  label?: string;
}

export default function FooterMap({ 
  lat = -6.1252, 
  lng = 106.8738, 
  zoom = 15,
  label = "MUI DKI Jakarta"
}: FooterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Flag untuk membatalkan async import jika cleanup sudah berjalan lebih dulu
    let cancelled = false;

    // Cleanup instance lama jika ada (dari re-render sebelumnya)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Reset internal Leaflet flag pada container
    const container = mapRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    import('leaflet').then((L) => {
      // Jika cleanup sudah berjalan (React Strict Mode / unmount), batalkan
      if (cancelled || !mapRef.current) return;

      // Fix default icon paths untuk Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
        doubleClickZoom: false,
      });

      mapInstanceRef.current = map;

      // CartoDB Voyager — tampilan bersih mirip Google Maps
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom pin hijau sesuai tema MUI
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

      // Marker dengan popup info
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Arial,sans-serif;min-width:160px;padding:4px 0;">
          <div style="font-weight:bold;color:#0A6B41;font-size:13px;margin-bottom:4px;">${label}</div>
          <div style="font-size:11px;color:#555;line-height:1.5;">
            Jakarta Islamic Center<br/>Koja, Jakarta Utara 14260
          </div>
          <a 
            href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="display:inline-block;margin-top:8px;font-size:11px;color:#0A6B41;font-weight:bold;"
          >Lihat Peta Penuh ↗</a>
        </div>
      `);
    });

    return () => {
      // Set flag sehingga async import yang pending tidak akan melanjutkan init
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom, label]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '176px', background: '#e5e3df' }}
      />
    </>
  );
}
