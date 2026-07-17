'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

const NAIROBI: L.LatLngExpression = [-1.286389, 36.817223];

export default function MapPinPicker({ value, onChange }: { value?: { latitude: number; longitude: number }; onChange: (point: { latitude: number; longitude: number }) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: NAIROBI, zoom: 11, scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    const icon = L.divIcon({ className: '', html: '<span class="delivery-map-pin" aria-hidden="true"></span>', iconSize: [32, 42], iconAnchor: [16, 42] });
    const place = (latlng: L.LatLng) => {
      if (!markerRef.current) {
        markerRef.current = L.marker(latlng, { icon, draggable: true }).addTo(map);
        markerRef.current.on('dragend', () => {
          const next = markerRef.current!.getLatLng();
          onChangeRef.current({ latitude: next.lat, longitude: next.lng });
        });
      } else markerRef.current.setLatLng(latlng);
      onChangeRef.current({ latitude: latlng.lat, longitude: latlng.lng });
    };
    map.on('click', (event) => place(event.latlng));
    setTimeout(() => map.invalidateSize(), 0);
    return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
  }, []);

  useEffect(() => {
    if (!value || !mapRef.current) return;
    const point = L.latLng(value.latitude, value.longitude);
    if (markerRef.current) markerRef.current.setLatLng(point);
  }, [value]);

  return <div><div ref={containerRef} className="h-[360px] w-full overflow-hidden rounded-2xl border border-brand-clay bg-brand-cream-dark" role="application" aria-label="Delivery location map. Click or drag the marker to the exact destination."/><p className="mt-2 text-xs leading-relaxed text-brand-dark-light">Map tiles © OpenStreetMap contributors. The pin is used only to calculate and coordinate this delivery.</p></div>;
}
