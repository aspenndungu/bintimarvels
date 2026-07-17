'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Map, Search } from 'lucide-react';
import type { DeliveryLocation } from '@/lib/commerce';

const MapPinPicker = dynamic(() => import('./MapPinPicker'), { ssr: false, loading: () => <div className="h-[360px] animate-pulse rounded-2xl bg-brand-cream-dark" /> });
type Suggestion = { placeId: string; text: string; mainText: string; secondaryText: string };

export default function DeliveryLocationPicker({ value, onChange }: { value: DeliveryLocation | null; onChange: (value: DeliveryLocation | null) => void }) {
  const [mode, setMode] = useState<'search' | 'pin'>('search');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [landmark, setLandmark] = useState('');
  const [destinationType, setDestinationType] = useState<'doorstep' | 'drop_off'>('doorstep');
  const [pin, setPin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    if (!sessionToken || mode !== 'search' || query.trim().length < 3 || value?.source === 'google_place' && value.formattedAddress === query) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true); setError('');
      try {
        const response = await fetch('/api/places/autocomplete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: query, sessionToken }), signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Address search is unavailable.');
        setSuggestions(data.suggestions ?? []);
      } catch (cause) {
        if ((cause as Error).name !== 'AbortError') setError(cause instanceof Error ? cause.message : 'Address search is unavailable.');
      } finally { setSearching(false); }
    }, 450);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [mode, query, sessionToken, value]);

  function switchMode(next: 'search' | 'pin') { setMode(next); onChange(null); setError(''); setSuggestions([]); }

  function updateQuery(next: string) {
    if (!sessionToken) setSessionToken(globalThis.crypto.randomUUID());
    setQuery(next);
    if (next.trim().length < 3) setSuggestions([]);
    onChange(null);
  }

  async function chooseSuggestion(suggestion: Suggestion) {
    setSearching(true); setError('');
    try {
      const response = await fetch('/api/places/details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ placeId: suggestion.placeId, sessionToken }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'That address could not be selected.');
      setQuery(data.place.formattedAddress); setSuggestions([]);
      onChange({ source: 'google_place', ...data.place, sessionToken, landmark, destinationType });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'That address could not be selected.'); }
    finally { setSearching(false); }
  }

  function updateLandmark(next: string) {
    setLandmark(next);
    if (value?.source === 'google_place') onChange({ ...value, landmark: next, destinationType });
    else if (pin && next.trim().length >= 3) onChange({ source: 'map_pin', ...pin, formattedAddress: next.trim(), landmark: next.trim(), destinationType });
    else if (mode === 'pin') onChange(null);
  }

  function updateDestinationType(next: 'doorstep' | 'drop_off') {
    setDestinationType(next);
    if (value) onChange({ ...value, destinationType: next });
  }

  function selectPin(next: { latitude: number; longitude: number }) {
    setPin(next);
    if (landmark.trim().length >= 3) onChange({ source: 'map_pin', ...next, formattedAddress: landmark.trim(), landmark: landmark.trim(), destinationType });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 rounded-2xl bg-brand-cream-dark p-1" role="tablist" aria-label="Choose how to select the delivery location">
        <button type="button" role="tab" aria-selected={mode === 'search'} onClick={() => switchMode('search')} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${mode === 'search' ? 'bg-white text-brand-berry shadow-sm' : 'text-brand-dark-light'}`}><Search className="h-4 w-4"/> Search address</button>
        <button type="button" role="tab" aria-selected={mode === 'pin'} onClick={() => switchMode('pin')} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${mode === 'pin' ? 'bg-white text-brand-berry shadow-sm' : 'text-brand-dark-light'}`}><Map className="h-4 w-4"/> Choose on map</button>
      </div>

      {mode === 'search' ? <div className="relative"><label className="text-sm font-bold text-brand-dark">Delivery address<input value={query} onChange={(event) => updateQuery(event.target.value)} autoComplete="street-address" placeholder="Start typing a building, road or area" className="mt-2 w-full rounded-xl border border-brand-clay bg-white p-3.5 font-normal outline-none focus:border-brand-berry focus:ring-2 focus:ring-brand-berry/20" /></label>{searching && <p className="mt-2 text-xs text-brand-dark-light">Searching…</p>}{suggestions.length > 0 && <div className="absolute z-[1000] mt-2 w-full overflow-hidden rounded-2xl border border-brand-clay bg-white shadow-xl">{suggestions.map(item => <button key={item.placeId} type="button" onClick={() => chooseSuggestion(item)} className="block w-full border-b border-brand-clay px-4 py-3 text-left last:border-0 hover:bg-brand-cream"><strong className="block text-sm text-brand-dark">{item.mainText}</strong><span className="mt-0.5 block text-xs text-brand-dark-light">{item.secondaryText}</span></button>)}<p className="px-4 py-2 text-right text-[11px] font-bold text-brand-dark-light">Powered by Google</p></div>}{value?.source === 'google_place' && <div className="mt-3 rounded-xl border border-[#78a887] bg-[#edf8f0] p-4 text-sm"><strong className="text-[#185b2a]">Address selected</strong><p className="mt-1 text-brand-dark-light">{value.formattedAddress}</p></div>}</div> : <div className="space-y-4"><p className="text-sm leading-relaxed text-brand-dark-light">Tap the exact doorstep or agreed drop-off point. Then add the building, gate or landmark below.</p><MapPinPicker value={pin ?? undefined} onChange={selectPin}/>{pin && <div className="rounded-xl border border-[#78a887] bg-[#edf8f0] p-4 text-sm"><strong className="text-[#185b2a]">Pin selected</strong><p className="mt-1 text-brand-dark-light">Add the building, gate or landmark below so Binti can recognise the destination.</p></div>}</div>}

      <label className="block text-sm font-bold text-brand-dark">Building, gate or landmark {mode === 'search' && <span className="font-normal text-brand-dark-light">(optional)</span>}<input value={landmark} onChange={(event) => updateLandmark(event.target.value)} placeholder="For example: main gate, ABC Plaza" className="mt-2 w-full rounded-xl border border-brand-clay bg-white p-3.5 font-normal outline-none focus:border-brand-berry focus:ring-2 focus:ring-brand-berry/20" /></label>
      <fieldset><legend className="text-sm font-bold text-brand-dark">Deliver to</legend><div className="mt-2 grid gap-3 sm:grid-cols-2">{([['doorstep','My address'],['drop_off','An agreed drop-off point']] as const).map(([id,label]) => <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm font-bold ${destinationType === id ? 'border-brand-berry bg-brand-berry/5' : 'border-brand-clay bg-white'}`}><input type="radio" checked={destinationType === id} onChange={() => updateDestinationType(id)} />{label}</label>)}</div></fieldset>
      {error && <p role="alert" className="rounded-xl bg-[#fff0f0] p-3 text-sm text-[#8d1d1d]">{error}</p>}
    </div>
  );
}
