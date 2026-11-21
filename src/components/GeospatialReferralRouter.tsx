import React, { useState, useEffect, useRef } from 'react';
import { ASSAM_NEONATAL_FACILITIES, MOCK_REFERRAL_RECORDS } from '../data/assam_newborn_data';
import { FacilityStatus, ReferralRecord } from '../types/newborn';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Anchor, 
  Clock, 
  AlertTriangle, 
  Radio, 
  ExternalLink,
  Shield,
  Layers,
  PhoneCall
} from 'lucide-react';
import L from 'leaflet';

export const GeospatialReferralRouter: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord>(MOCK_REFERRAL_RECORDS[0]);
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'BOAT_AMBULANCE' | 'TERTIARY_NICU'>('ALL');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([26.2006, 92.9376], 7);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add Facility Markers
    ASSAM_NEONATAL_FACILITIES.forEach(f => {
      const isTertiary = f.type === 'NICU_TERTIARY';
      const color = isTertiary ? '#a855f7' : f.type === 'SNCU_DISTRICT' ? '#38bdf8' : '#10b981';

      const circle = L.circleMarker([f.lat, f.lng], {
        radius: isTertiary ? 9 : 7,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
          <strong style="color: #0f766e;">${f.name}</strong><br/>
          <span>Type: <b>${f.type}</b> (${f.district})</span><br/>
          <span>Beds Available: <b>${f.totalBeds - f.occupiedBeds}/${f.totalBeds}</b></span><br/>
          <span>Warmers Free: <b>${f.radiantWarmersTotal - f.radiantWarmersOccupied}</b></span><br/>
          <span>Helpline: ${f.contactNumber}</span>
        </div>
      `);
    });

    // Draw active referral route for Dhubri Char (Alomganj Char -> Dhubri Civil Hospital via Brahmaputra)
    const charOrigin: [number, number] = [26.0684, 90.0412];
    const dhubriHospital: [number, number] = [26.0208, 89.9741];
    const midPoint: [number, number] = [26.0450, 90.0100];

    const boatRoute = L.polyline([charOrigin, midPoint, dhubriHospital], {
      color: '#f43f5e',
      weight: 3.5,
      dashArray: '6, 6',
    }).addTo(map);

    // Marker for Boat Ambulance en route
    const boatMarker = L.circleMarker(midPoint, {
      radius: 8,
      fillColor: '#ef4444',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 1,
    }).addTo(map);

    boatMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 11px;">
        <strong style="color: #dc2626;">Brahmaputra Boat Ambulance (DHUBRI-BOAT-04)</strong><br/>
        <span>Patient: Baby of Anamika Begum</span><br/>
        <span>Status: In Transit (ETA ~24 min)</span><br/>
        <span>Vitals: Temp 35.4°C, SpO2 91%</span>
      </div>
    `).openPopup();

    // Draw Barpeta Route (Chenga -> FAAMCH)
    const chengaOrigin: [number, number] = [26.2412, 91.0741];
    const faamchHosp: [number, number] = [26.3211, 91.0044];
    L.polyline([chengaOrigin, faamchHosp], {
      color: '#06b6d4',
      weight: 3,
    }).addTo(map);

  }, [activeLayer]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-rose-400" />
              108 Emergency Dispatch & Geospatial Routing
            </span>
            <span className="text-xs text-slate-400">Assam Riverine & Road Ambulance Fleet</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Dynamic Inter-Facility Referral Routing & Riverine Telemetry
          </h2>
          <p className="text-sm text-slate-400">
            Intelligent transit optimization bypassing river obstacles, char isolation, and tea-garden transit bottlenecks with live pre-arrival alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveLayer('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeLayer === 'ALL'
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            All Networks
          </button>
          <button
            onClick={() => setActiveLayer('BOAT_AMBULANCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
              activeLayer === 'BOAT_AMBULANCE'
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            Boat Ambulances (Char Fleet)
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map (8 cols) & Live Dispatch Telemetry (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Assam GIS Neonatal Network (NICU / SNCU / NBSU / Boat Docks)
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Tertiary NICU
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> District SNCU
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Block NBSU
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-ping"></span> Active Transit
              </span>
            </div>
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-[520px] bg-slate-950 z-0"
          />
        </div>

        {/* Right Column: Live Referral Telemetry Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                Selected Referral Telemetry
              </h3>
              <span className="text-xs text-rose-300 font-mono font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                {selectedReferral.id}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedReferral.babyMotherName}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedReferral.originFacility}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900/60 text-rose-300 border border-rose-700">
                  {selectedReferral.transportMode.replace('_', ' ')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Assigned Transport ID:</span>
                  <span className="font-mono font-bold text-white">{selectedReferral.transportId}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Destination SNCU:</span>
                  <span className="font-medium text-cyan-300">{selectedReferral.destinationFacilityName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Estimated Transit ETA:</span>
                  <span className="font-mono font-bold text-rose-400">{selectedReferral.etaMinutes} Minutes</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Transit Distance:</span>
                  <span className="font-mono text-slate-200">{selectedReferral.distanceKm} km (River + Road)</span>
                </div>
              </div>

              {/* In-Transit Clinical Vitals Monitor */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Live En-Route Patient Vitals:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Temperature</span>
                    <div className="font-bold font-mono text-rose-400 mt-0.5">
                      {selectedReferral.vitalsEnRoute.temp}°C (Hypothermic)
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Oxygen SpO2</span>
                    <div className="font-bold font-mono text-amber-300 mt-0.5">
                      {selectedReferral.vitalsEnRoute.spo2}%
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Heart Rate</span>
                    <div className="font-bold font-mono text-slate-200 mt-0.5">
                      {selectedReferral.vitalsEnRoute.heartRate} bpm
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Respiratory Rate</span>
                    <div className="font-bold font-mono text-rose-400 mt-0.5">
                      {selectedReferral.vitalsEnRoute.respiratoryRate} bpm
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Admitting Consultant:</span>
                <span className="text-xs font-medium text-slate-200">{selectedReferral.admittingPediatrician}</span>
              </div>
            </div>

            {/* Geographical Char Area Context Note */}
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200 space-y-1">
              <span className="font-bold flex items-center gap-1 text-blue-300">
                <Anchor className="w-3.5 h-3.5" />
                Riverine Char Special Protocol:
              </span>
              <p>
                In remote Brahmaputra sandbar islands (*chars*), 108 riverine boat ambulances are pre-positioned with portable radiant incubators and pulse oximetry to avert transit hypothermia during river crossings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
