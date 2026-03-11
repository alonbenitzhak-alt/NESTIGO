"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

// City coordinates for our markets
const cityCoords: Record<string, [number, number]> = {
  "Athens, Greece": [37.9838, 23.7275],
  "Thessaloniki, Greece": [40.6401, 22.9444],
  "Limassol, Cyprus": [34.7071, 33.0226],
  "Paphos, Cyprus": [34.7754, 32.4218],
  "Tbilisi, Georgia": [41.7151, 44.8271],
  "Batumi, Georgia": [41.6168, 41.6367],
  "Lisbon, Portugal": [38.7223, -9.1393],
  "Porto, Portugal": [41.1579, -8.6291],
};

interface PropertyMapProps {
  city: string;
  country: string;
  title: string;
}

export default function PropertyMap({ city, country, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const key = `${city}, ${country}`;
    const coords = cityCoords[key] || [37.9838, 23.7275];

    const map = L.map(mapRef.current).setView(coords, 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:#2563eb;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker(coords, { icon }).addTo(map).bindPopup(`<b>${title}</b><br>${city}, ${country}`);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city, country, title]);

  return <div ref={mapRef} className="w-full h-full rounded-2xl" />;
}
