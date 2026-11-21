import React, { useState } from 'react';
import { ASSAM_NEONATAL_FACILITIES, MOCK_REFERRAL_RECORDS } from '../data/assam_newborn_data';
import { FacilityStatus, ReferralRecord } from '../types/newborn';
import { 
  Building2, 
  Bed, 
  Activity, 
  Sun, 
  Wind, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Search,
  Filter,
  UserCheck
} from 'lucide-react';

export const FacilityBedCommand: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityStatus[]>(ASSAM_NEONATAL_FACILITIES);
  const [referrals, setReferrals] = useState<ReferralRecord[]>(MOCK_REFERRAL_RECORDS);
  const [selectedFacility, setSelectedFacility] = useState<FacilityStatus>(ASSAM_NEONATAL_FACILITIES[1]); // FAAMCH Barpeta
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredFacilities = facilities.filter(f => 
    districtFilter === 'ALL' || f.district === districtFilter
  );

  const handleAcknowledgeAlert = (refId: string) => {
    setReferrals(prev => prev.map(r => {
      if (r.id === refId) {
        return { ...r, preArrivalAlertAcknowledged: true };
      }
      return r;
    }));
    setActionNotice(`Pre-arrival alert acknowledged for referral ${refId}. Radiant warmer reserved and pediatric team mobilized.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleAssignBed = (refId: string, bedNumber: string) => {
    setReferrals(prev => prev.map(r => {
      if (r.id === refId) {
        return { ...r, bedAssigned: bedNumber, ambulanceStatus: 'ADMITTED' };
      }
      return r;
    }));
    setActionNotice(`Bed ${bedNumber} assigned to incoming newborn (${refId}). Electronic bed status updated.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Facility Command Mode (SNCU / NBSU / NICU)
            </span>
            <span className="text-xs text-slate-400">Assam Statewide Real-Time Bed Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Special Care Newborn Unit Capacity & Incoming Referral Radar
          </h2>
          <p className="text-sm text-slate-400">
            Real-time tracking of radiant warmers, phototherapy, CPAP ventilators, and pre-arrival vitals for emergency admissions.
          </p>
        </div>

        {/* District Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            District:
          </label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Districts (Statewide)</option>
            <option value="Kamrup Metro">Kamrup Metro</option>
            <option value="Barpeta">Barpeta</option>
            <option value="Dhubri">Dhubri</option>
            <option value="Dibrugarh">Dibrugarh</option>
            <option value="Majuli">Majuli</option>
            <option value="Darrang">Darrang</option>
            <option value="Goalpara">Goalpara</option>
            <option value="Cachar">Cachar</option>
          </select>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-600 text-cyan-200 text-sm font-medium flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>{actionNotice}</div>
        </div>
      )}

      {/* Statewide Capacity KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total SNCU/NICU Beds</span>
            <Bed className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {facilities.reduce((acc, f) => acc + (f.totalBeds - f.occupiedBeds), 0)} / {facilities.reduce((acc, f) => acc + f.totalBeds, 0)}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">Available across indexed facilities</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Radiant Warmers Active</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {facilities.reduce((acc, f) => acc + f.radiantWarmersOccupied, 0)} / {facilities.reduce((acc, f) => acc + f.radiantWarmersTotal, 0)}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            {facilities.reduce((acc, f) => acc + (f.radiantWarmersTotal - f.radiantWarmersOccupied), 0)} Warmers free for incoming
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Phototherapy Units Available</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {facilities.reduce((acc, f) => acc + f.phototherapyUnitsAvailable, 0)} Units
          </div>
          <div className="text-[11px] text-blue-400 mt-1">Ready for hyperbilirubinemia cases</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>CPAP / Ventilators Ready</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {facilities.reduce((acc, f) => acc + f.cpapVentilatorsAvailable, 0)} Ready
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">For severe respiratory distress</div>
        </div>
      </div>

      {/* Main Command View: Facility Cards & Live Incoming Transfer Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Facility Inventory Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center justify-between">
            <span>Specialized Newborn Facilities</span>
            <span className="text-xs text-slate-400">{filteredFacilities.length} Centres Active</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map(f => {
              const isSelected = selectedFacility.id === f.id;
              const bedOccupancyPct = Math.round((f.occupiedBeds / f.totalBeds) * 100);
              const isNearCapacity = bedOccupancyPct >= 85;

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFacility(f)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        f.type === 'NICU_TERTIARY'
                          ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                          : f.type === 'SNCU_DISTRICT'
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                          : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                      }`}>
                        {f.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1.5 leading-snug">{f.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {f.district}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                        isNearCapacity ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {bedOccupancyPct}% Occupied
                      </span>
                    </div>
                  </div>

                  {/* Bed Occupancy Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bedOccupancyPct > 90 ? 'bg-rose-500' : bedOccupancyPct > 75 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${bedOccupancyPct}%` }}
                    />
                  </div>

                  {/* Detailed Equipment Gauges */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
                    <div className="text-center p-1.5 rounded bg-slate-900/60 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Warmers Free</div>
                      <div className="font-bold font-mono text-amber-300 mt-0.5">
                        {f.radiantWarmersTotal - f.radiantWarmersOccupied}
                      </div>
                    </div>
                    <div className="text-center p-1.5 rounded bg-slate-900/60 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Phototherapy</div>
                      <div className="font-bold font-mono text-blue-300 mt-0.5">
                        {f.phototherapyUnitsAvailable}
                      </div>
                    </div>
                    <div className="text-center p-1.5 rounded bg-slate-900/60 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">CPAP Ready</div>
                      <div className="font-bold font-mono text-emerald-300 mt-0.5">
                        {f.cpapVentilatorsAvailable}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {f.pediatricianOnDuty ? 'Pediatrician On Duty' : 'Medical Officer On Call'}
                    </span>
                    <span className="font-mono text-slate-300">{f.contactNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Incoming Neonatal Transfers Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
                Incoming Transfer Queue
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                {referrals.filter(r => r.ambulanceStatus !== 'ADMITTED').length} In Transit
              </span>
            </div>

            <div className="space-y-3">
              {referrals.map(ref => {
                return (
                  <div
                    key={ref.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700 font-bold uppercase">
                          {ref.severity.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{ref.babyMotherName}</h4>
                        <p className="text-[11px] text-slate-400">{ref.originFacility}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-rose-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3.5 h-3.5" />
                          {ref.ambulanceStatus === 'ADMITTED' ? 'ARRIVED' : `ETA ${ref.etaMinutes}m`}
                        </div>
                        <span className="text-[10px] text-slate-400">{ref.distanceKm} km away</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                      <span className="font-semibold text-rose-300 block mb-0.5">Primary Clinical Indication:</span>
                      {ref.primaryDiagnosis}
                    </div>

                    {/* In-Transit Live Vitals Telemetry */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] bg-slate-900 p-2 rounded border border-slate-800">
                      <div>
                        <span className="text-slate-400">Temp</span>
                        <div className={`font-mono font-bold ${ref.vitalsEnRoute.temp < 36.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {ref.vitalsEnRoute.temp}°C
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">SpO2</span>
                        <div className={`font-mono font-bold ${ref.vitalsEnRoute.spo2 < 92 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {ref.vitalsEnRoute.spo2}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Heart Rate</span>
                        <div className="font-mono font-bold text-slate-200">
                          {ref.vitalsEnRoute.heartRate} bpm
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Resp Rate</span>
                        <div className={`font-mono font-bold ${ref.vitalsEnRoute.respiratoryRate >= 60 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {ref.vitalsEnRoute.respiratoryRate} bpm
                        </div>
                      </div>
                    </div>

                    {/* Pre-arrival Alert Confirmation & Bed Assignment */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${ref.preArrivalAlertAcknowledged ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>{ref.preArrivalAlertAcknowledged ? 'Team Mobilized' : 'Alert Pending'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!ref.preArrivalAlertAcknowledged ? (
                          <button
                            onClick={() => handleAcknowledgeAlert(ref.id)}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-[11px]"
                          >
                            Acknowledge Alert
                          </button>
                        ) : ref.ambulanceStatus !== 'ADMITTED' ? (
                          <button
                            onClick={() => handleAssignBed(ref.id, 'SNCU-Warmer-04')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px]"
                          >
                            Confirm Bed Admission
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded font-medium text-[11px]">
                            Admitted ({ref.bedAssigned})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
