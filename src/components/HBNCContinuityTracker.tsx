import React, { useState } from 'react';
import { MOCK_NEWBORNS, MOCK_HBNC_SCHEDULES } from '../data/assam_newborn_data';
import { NewbornProfile, HBNCVisit } from '../types/newborn';
import { 
  HeartHandshake, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  TrendingUp, 
  Scale, 
  ShieldAlert, 
  FileCheck,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export const HBNCContinuityTracker: React.FC = () => {
  const [selectedNewbornId, setSelectedNewbornId] = useState<string>('NB-2026-084');
  const [schedules, setSchedules] = useState(MOCK_HBNC_SCHEDULES);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const selectedBaby = MOCK_NEWBORNS.find(b => b.id === selectedNewbornId) || MOCK_NEWBORNS[3];
  const currentVisits = schedules[selectedNewbornId] || [];

  const handleCompleteVisit = (visitDay: number) => {
    setSchedules(prev => {
      const updated = { ...prev };
      if (updated[selectedNewbornId]) {
        updated[selectedNewbornId] = updated[selectedNewbornId].map(v => {
          if (v.visitDay === visitDay) {
            return {
              ...v,
              status: 'COMPLETED',
              completedDate: new Date().toISOString().split('T')[0],
              weightGrams: (v.weightGrams || selectedBaby.birthWeightGrams) + 120,
              feedingStatus: 'EXCLUSIVE_BREASTFEEDING',
              temperatureCelsius: 36.6,
              respiratoryRate: 44,
              dangerSignsDetected: false,
              ashaNotes: 'Completed visit. Good latching, normal temperature, cord clean.'
            };
          }
          return v;
        });
      }
      return updated;
    });

    setActionAlert(`Day ${visitDay} HBNC visit confirmed and recorded by ASHA. Data synced with NHM Child Tracking Portal.`);
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleEscalateMissedVisit = (visitDay: number) => {
    setActionAlert(`URGENT: Escalation SMS & automated call dispatched to Block Public Health Nurse (BPHN) for missed Day ${visitDay} visit.`);
    setTimeout(() => setActionAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              Facility-to-Home Closed Loop (HBNC Continuum)
            </span>
            <span className="text-xs text-slate-400">7 Mandated Home-Based Newborn Care Visits</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Post-Discharge Follow-up, Weight Velocity & Missed-Visit Escalation
          </h2>
          <p className="text-sm text-slate-400">
            Eliminates post-discharge rebound mortality by binding hospital discharge records directly to the catchment ASHA's home visit roster.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Mandated Days: <b className="text-emerald-400">1, 3, 7, 14, 21, 28, 42</b>
          </span>
        </div>
      </div>

      {actionAlert && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-sm font-medium flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>{actionAlert}</div>
        </div>
      )}

      {/* Main Grid: Newborn Selector (4 cols) & 7-Visit Care Journey (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Newborn Cohort Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
              <span>Active HBNC Cohort</span>
              <span className="text-xs text-slate-500">Post-Discharge Cases</span>
            </h3>

            <div className="space-y-2">
              {MOCK_NEWBORNS.slice(2, 6).map(nb => {
                const isSelected = selectedNewbornId === nb.id;
                const schedule = schedules[nb.id] || [];
                const completedCount = schedule.filter(v => v.status === 'COMPLETED').length;
                const hasMissed = schedule.some(v => v.status === 'MISSED_OVERDUE');

                return (
                  <button
                    key={nb.id}
                    onClick={() => setSelectedNewbornId(nb.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-400">{nb.id}</span>
                      <span className="text-slate-400">Age: {nb.ageDays} Days</span>
                    </div>
                    <div className="font-medium text-sm mt-0.5 text-white">{nb.babyName}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>{nb.village} ({nb.district})</span>
                      <span className="font-mono text-emerald-300">{completedCount}/7 Visits</span>
                    </div>
                    {hasMissed && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] bg-rose-900/60 text-rose-300 border border-rose-700 font-bold">
                        ⚠️ Missed Visit Detected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Child Clinical Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5">
            <h4 className="font-semibold text-slate-300 text-sm border-b border-slate-800 pb-2">
              Growth & Nutrition Baseline
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Birth Weight</span>
              <span className="text-slate-200 font-mono font-bold">{selectedBaby.birthWeightGrams}g</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Current Weight</span>
              <span className="text-emerald-400 font-mono font-bold">{selectedBaby.currentWeightGrams}g</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Weight Velocity</span>
              <span className="text-emerald-300 font-mono font-bold">+28.5 g/day (Optimal)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Catchment ASHA</span>
              <span className="text-slate-200">{selectedBaby.ashaName} ({selectedBaby.ashaPhone})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Sub-Centre / PHC</span>
              <span className="text-slate-200">{selectedBaby.subCentre}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 7-Visit Interactive Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  HBNC Care Journey: {selectedBaby.babyName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mother: {selectedBaby.motherName} • Contact: {selectedBaby.contactNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                  {currentVisits.filter(v => v.status === 'COMPLETED').length} of 7 Completed
                </span>
              </div>
            </div>

            {/* Visit Timeline Grid */}
            <div className="space-y-3">
              {currentVisits.map((visit) => {
                const isCompleted = visit.status === 'COMPLETED';
                const isMissed = visit.status === 'MISSED_OVERDUE';
                const isScheduled = visit.status === 'SCHEDULED' || visit.status === 'PENDING';

                return (
                  <div
                    key={visit.visitDay}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-950/80 border-emerald-900/60 text-slate-200'
                        : isMissed
                        ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isMissed
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          D{visit.visitDay}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">
                              Day {visit.visitDay} Home Visit
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              isCompleted
                                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                                : isMissed
                                ? 'bg-rose-900/80 text-rose-300 border border-rose-700'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {visit.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Due Date: <b>{visit.dueDate}</b> {visit.completedDate && `• Completed on: ${visit.completedDate}`}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        {isCompleted && (
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified
                          </span>
                        )}

                        {isMissed && (
                          <button
                            onClick={() => handleEscalateMissedVisit(visit.visitDay)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-md"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Escalate to BPHN
                          </button>
                        )}

                        {isScheduled && (
                          <button
                            onClick={() => handleCompleteVisit(visit.visitDay)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Record ASHA Visit
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Completed Clinical Findings Summary */}
                    {isCompleted && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 text-[10px]">Weight:</span>
                          <div className="font-mono font-bold text-slate-100">{visit.weightGrams}g</div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 text-[10px]">Temperature:</span>
                          <div className="font-mono font-bold text-slate-100">{visit.temperatureCelsius}°C</div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 text-[10px]">Feeding:</span>
                          <div className="font-semibold text-emerald-400">Exclusive Breast</div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 text-[10px]">Danger Signs:</span>
                          <div className="font-semibold text-slate-300">None Detected</div>
                        </div>
                      </div>
                    )}

                    {visit.ashaNotes && (
                      <p className="mt-2 text-xs text-slate-400 italic bg-slate-900/40 p-2 rounded">
                        "<b>ASHA Observation:</b> {visit.ashaNotes}"
                      </p>
                    )}
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
