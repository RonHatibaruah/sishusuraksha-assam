import React, { useState } from 'react';
import { MOCK_NEWBORNS } from '../data/assam_newborn_data';
import { NewbornProfile, DangerSignsAssessment, TriageResult, DangerSignSeverity } from '../types/newborn';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Thermometer, 
  Wind, 
  Activity, 
  Send, 
  ShieldAlert, 
  Clock, 
  User, 
  Info, 
  Wifi, 
  WifiOff, 
  RotateCcw,
  Sparkles,
  PhoneCall,
  Flame,
  Baby
} from 'lucide-react';

export const FieldTriageWorklist: React.FC = () => {
  const [selectedNewborn, setSelectedNewborn] = useState<NewbornProfile>(MOCK_NEWBORNS[0]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Clinical assessment state for selected newborn
  const [tempInput, setTempInput] = useState<number>(35.2);
  const [rrInput, setRrInput] = useState<number>(64);
  const [chestIndrawing, setChestIndrawing] = useState<boolean>(true);
  const [grunting, setGrunting] = useState<boolean>(true);
  const [poorFeeding, setPoorFeeding] = useState<boolean>(true);
  const [lethargy, setLethargy] = useState<boolean>(true);
  const [convulsions, setConvulsions] = useState<boolean>(false);
  const [jaundicePalmsSoles, setJaundicePalmsSoles] = useState<boolean>(false);
  const [cordPusRedness, setCordPusRedness] = useState<boolean>(false);
  const [cyanosis, setCyanosis] = useState<boolean>(false);
  const [weightLossExcessive, setWeightLossExcessive] = useState<boolean>(false);

  // Breathing counter helper
  const [tapCounter, setTapCounter] = useState<number>(0);
  const [tapTimerActive, setTapTimerActive] = useState<boolean>(false);
  const [tapSecondsRemaining, setTapSecondsRemaining] = useState<number>(60);

  const startBreathingCounter = () => {
    setTapCounter(0);
    setTapSecondsRemaining(60);
    setTapTimerActive(true);
    const interval = setInterval(() => {
      setTapSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTapTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTapBreath = () => {
    if (tapTimerActive) {
      const next = tapCounter + 1;
      setTapCounter(next);
      setRrInput(next);
    }
  };

  // Compute Triage Severity dynamically based on IMNCI / INAP Clinical Protocols
  const computeTriage = (): TriageResult => {
    const dangerSigns: string[] = [];
    const immediateSteps: string[] = [];

    // RED Criteria
    if (tempInput < 35.5) {
      dangerSigns.push(`Severe Hypothermia (${tempInput}°C)`);
      immediateSteps.push('Initiate continuous skin-to-skin Kangaroo Mother Care (KMC) immediately; cover head with warm cap.');
    } else if (tempInput < 36.0) {
      dangerSigns.push(`Moderate Hypothermia (${tempInput}°C)`);
      immediateSteps.push('Provide immediate warmth under radiant warmer or KMC; recheck temperature after 30 mins.');
    }

    if (tempInput > 37.5) {
      dangerSigns.push(`Fever (${tempInput}°C) - High suspicion of systemic sepsis`);
      immediateSteps.push('Keep baby comfortable; do not over-wrap; notify medical officer for pre-referral antibiotic.');
    }

    if (rrInput >= 60) {
      dangerSigns.push(`Fast Breathing (${rrInput} breaths/min)`);
      immediateSteps.push('Assess for airway obstruction; keep head in sniffing position; prepare for oxygen support.');
    }

    if (chestIndrawing) {
      dangerSigns.push('Severe Lower Chest Indrawing (Respiratory Distress)');
      immediateSteps.push('Maintain open airway; avoid neck hyper-flexion or extension.');
    }

    if (grunting) {
      dangerSigns.push('Expiratory Grunting (Severe Alveolar Collapse)');
      immediateSteps.push('Urgent CPAP / NICU oxygenation required.');
    }

    if (poorFeeding) {
      dangerSigns.push('Inability to feed or poor suckling');
      immediateSteps.push('Prevent hypoglycemia: If conscious, administer expressed breast milk or sugar solution (10% dextrose equivalent) via spoon/paladai.');
    }

    if (lethargy) {
      dangerSigns.push('Lethargic or unconscious / floppy baby');
      immediateSteps.push('Check response to tactile stimulation; maintain lateral position during transit.');
    }

    if (convulsions) {
      dangerSigns.push('Convulsions or fits observed');
      immediateSteps.push('Do NOT put anything in mouth; position on side; immediate tertiary stabilization.');
    }

    if (cyanosis) {
      dangerSigns.push('Central Cyanosis (Blue lips/tongue)');
      immediateSteps.push('Administer high-flow supplemental oxygen immediately.');
    }

    if (jaundicePalmsSoles) {
      dangerSigns.push('Severe Jaundice extending to Palms and Soles');
      immediateSteps.push('High risk of kernicterus / acute bilirubin encephalopathy; needs urgent double phototherapy or exchange transfusion.');
    }

    if (cordPusRedness) {
      dangerSigns.push('Umbilical Cord Sepsis with surrounding skin erythema');
      immediateSteps.push('Keep umbilical cord dry and clean; do not apply cow dung/ash; prepare pre-referral parenteral dose if authorized.');
    }

    if (selectedNewborn.birthWeightGrams < 1800) {
      dangerSigns.push(`Very Low Birth Weight (${selectedNewborn.birthWeightGrams}g)`);
      immediateSteps.push('High vulnerability to hypothermia and hypoglycemia; continuous thermal protection required.');
    }

    // Determine Tri-Level Facility & Severity
    const isCriticalRed = 
      tempInput < 35.5 || 
      rrInput >= 65 || 
      chestIndrawing || 
      grunting || 
      convulsions || 
      cyanosis || 
      lethargy || 
      selectedNewborn.birthWeightGrams < 1800;

    const isUrgentYellow = 
      !isCriticalRed && (
        (tempInput >= 35.5 && tempInput < 36.0) || 
        (rrInput >= 60 && rrInput < 65) || 
        poorFeeding || 
        jaundicePalmsSoles || 
        cordPusRedness || 
        selectedNewborn.birthWeightGrams < 2200
      );

    if (isCriticalRed) {
      return {
        severity: 'RED_CRITICAL',
        score: Math.min(10, dangerSigns.length * 2 + 3),
        recommendedFacility: (convulsions || cyanosis || selectedNewborn.birthWeightGrams < 1500) ? 'NICU_TERTIARY' : 'SNCU_DISTRICT',
        primaryConcern: 'Critical Neonatal Emergency — High Risk of Rapid Deterioration & Mortality',
        detectedDangerSigns: dangerSigns,
        immediatePreReferralSteps: immediateSteps,
        urgencyWindowMinutes: 60,
        requiresSpecializedTransport: true,
      };
    } else if (isUrgentYellow) {
      return {
        severity: 'YELLOW_URGENT',
        score: Math.min(6, dangerSigns.length * 2),
        recommendedFacility: 'NBSU_FRU',
        primaryConcern: 'Urgent Stabilization & Pediatric Evaluation Required',
        detectedDangerSigns: dangerSigns,
        immediatePreReferralSteps: immediateSteps,
        urgencyWindowMinutes: 240,
        requiresSpecializedTransport: false,
      };
    } else {
      return {
        severity: 'GREEN_OBSERVE',
        score: 0,
        recommendedFacility: 'HOME_HBNC',
        primaryConcern: 'No Immediate Danger Signs Detected — Proceed with Scheduled HBNC',
        detectedDangerSigns: ['Vital signs within normal physiological parameters for gestational age.'],
        immediatePreReferralSteps: [
          'Encourage exclusive breastfeeding every 2 hours day and night.',
          'Advise mother on cord care and thermal protection.',
          'Schedule next mandatory HBNC visit on scheduled timeline.'
        ],
        urgencyWindowMinutes: 1440,
        requiresSpecializedTransport: false,
      };
    }
  };

  const triage = computeTriage();

  const handleDispatchReferral = () => {
    const isBoatNeeded = selectedNewborn.isCharArea;
    const mode = isBoatNeeded ? '108 Boat Ambulance (Brahmaputra Patrol)' : '108 Mrityunjoy Road Ambulance';
    setSuccessBanner(
      `🚨 EMERGENCY DISPATCH DISPATCHED! Priority referral lodged for ${selectedNewborn.babyName}. ${mode} assigned with ETA ~18 mins. Pre-arrival alert with vitals transmitted to destination SNCU.`
    );
    setTimeout(() => setSuccessBanner(null), 7000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Baby className="w-3.5 h-3.5 text-rose-400" />
              Frontline Triage (ASHA / ANM Mode)
            </span>
            <span className="text-xs text-slate-400">IMNCI & INAP Clinical Protocol</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Structured Neonatal Danger-Sign Screening & Emergency Triage
          </h2>
          <p className="text-sm text-slate-400">
            Rapid bedside evaluation tool for early detection of newborn hypothermia, sepsis, and asphyxia in community & peripheral facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isOfflineMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
            title="Toggle CRDT Offline Sync Simulation"
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {isOfflineMode ? 'Offline Mode (Local CRDT Queue)' : 'Live Connected (NHM Cloud)'}
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-sm font-medium animate-pulse flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>{successBanner}</div>
        </div>
      )}

      {/* Main Grid: Newborn Selector & Assessment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Newborn Cohort Selector & Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
              <span>Select Active Newborn Cohort</span>
              <span className="text-xs text-slate-500 font-normal">Assam Field Sub-Centres</span>
            </h3>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {MOCK_NEWBORNS.map((nb) => {
                const isSelected = selectedNewborn.id === nb.id;
                return (
                  <button
                    key={nb.id}
                    onClick={() => {
                      setSelectedNewborn(nb);
                      if (nb.id === 'NB-2026-081') {
                        setTempInput(34.8);
                        setRrInput(66);
                        setChestIndrawing(true);
                        setGrunting(true);
                        setPoorFeeding(true);
                        setLethargy(true);
                        setConvulsions(false);
                      } else if (nb.id === 'NB-2026-083') {
                        setTempInput(36.6);
                        setRrInput(52);
                        setChestIndrawing(false);
                        setGrunting(false);
                        setPoorFeeding(false);
                        setLethargy(false);
                        setJaundicePalmsSoles(true);
                      } else {
                        setTempInput(36.8);
                        setRrInput(46);
                        setChestIndrawing(false);
                        setGrunting(false);
                        setPoorFeeding(false);
                        setLethargy(false);
                        setJaundicePalmsSoles(false);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-rose-400">{nb.id}</span>
                      <span className="text-slate-400">Day {nb.ageDays} ({nb.gestationalWeeks}w)</span>
                    </div>
                    <div className="font-medium text-sm mt-0.5 text-white truncate">{nb.babyName}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>{nb.district} • {nb.subCentre}</span>
                      <span className="font-mono text-slate-300">{nb.birthWeightGrams}g</span>
                    </div>
                    {nb.isCharArea && (
                      <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700">
                        Riverine Char Island
                      </span>
                    )}
                    {nb.isTeaGarden && (
                      <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                        Tea Garden Community
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demographic Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5">
            <h4 className="font-semibold text-slate-300 text-sm border-b border-slate-800 pb-2">
              Case Profile Details
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Mother / Father</span>
              <span className="text-slate-200 font-medium">{selectedNewborn.motherName} / {selectedNewborn.fatherName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Delivery Type</span>
              <span className="text-slate-200 font-medium">{selectedNewborn.deliveryType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Birth Weight</span>
              <span className="text-slate-200 font-medium font-mono">{selectedNewborn.birthWeightGrams}g ({selectedNewborn.birthWeightGrams < 1800 ? 'VLBW' : selectedNewborn.birthWeightGrams < 2500 ? 'LBW' : 'Normal'})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Assigned ASHA</span>
              <span className="text-slate-200 font-medium">{selectedNewborn.ashaName} ({selectedNewborn.ashaPhone})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Catchment PHC</span>
              <span className="text-slate-200 font-medium">{selectedNewborn.primaryHealthCentre}</span>
            </div>
          </div>
        </div>

        {/* Center Column: Structured Clinical Danger Sign Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-rose-400" />
                Vitals & Clinical Measurements
              </h3>
              <span className="text-xs text-slate-400">Standardized IMNCI</span>
            </div>

            {/* Vital Measurement Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>Body Temperature</span>
                  <span className={`font-mono text-xs font-bold ${tempInput < 35.5 ? 'text-rose-400' : tempInput < 36.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {tempInput}°C
                  </span>
                </label>
                <input
                  type="range"
                  min="33.0"
                  max="39.5"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => setTempInput(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>33.0°C (Severe Hypo)</span>
                  <span>36.5°C</span>
                  <span>39.5°C (Fever)</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>Respiratory Rate</span>
                  <span className={`font-mono text-xs font-bold ${rrInput >= 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {rrInput} bpm
                  </span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="1"
                  value={rrInput}
                  onChange={(e) => setRrInput(parseInt(e.target.value))}
                  className="w-full mt-2 accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>30</span>
                  <span className="text-rose-400 font-semibold">&gt;=60 (Fast)</span>
                  <span>90</span>
                </div>
              </div>
            </div>

            {/* Breathing Tap Timer */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-cyan-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-cyan-300">60-Second Breathing Tap Counter:</span>
                <span className="text-slate-400 ml-2">
                  {tapTimerActive ? `${tapSecondsRemaining}s left • ${tapCounter} breaths counted` : 'Tap to accurately count neonate breaths'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!tapTimerActive ? (
                  <button
                    onClick={startBreathingCounter}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs"
                  >
                    Start 60s
                  </button>
                ) : (
                  <button
                    onClick={handleTapBreath}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs animate-bounce"
                  >
                    TAP (+1)
                  </button>
                )}
              </div>
            </div>

            {/* Checkbox Danger Signs Checklist */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block mb-1">
                Major Clinical Danger Signs (Select all that apply):
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Severe Lower Chest Indrawing</span>
                <input
                  type="checkbox"
                  checked={chestIndrawing}
                  onChange={(e) => setChestIndrawing(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Expiratory Grunting</span>
                <input
                  type="checkbox"
                  checked={grunting}
                  onChange={(e) => setGrunting(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Unable to suckle or feed / refusal to feed</span>
                <input
                  type="checkbox"
                  checked={poorFeeding}
                  onChange={(e) => setPoorFeeding(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Lethargic, unconscious or reduced movements</span>
                <input
                  type="checkbox"
                  checked={lethargy}
                  onChange={(e) => setLethargy(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Convulsions or fits</span>
                <input
                  type="checkbox"
                  checked={convulsions}
                  onChange={(e) => setConvulsions(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Jaundice extending to palms and soles</span>
                <input
                  type="checkbox"
                  checked={jaundicePalmsSoles}
                  onChange={(e) => setJaundicePalmsSoles(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Umbilical cord redness or draining pus</span>
                <input
                  type="checkbox"
                  checked={cordPusRedness}
                  onChange={(e) => setCordPusRedness(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <span className="text-slate-200">Central Cyanosis (bluish discoloration of lips/tongue)</span>
                <input
                  type="checkbox"
                  checked={cyanosis}
                  onChange={(e) => setCyanosis(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Triage Result & Pre-Referral Stabilization Protocol (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`rounded-xl border p-5 shadow-xl transition-all ${
            triage.severity === 'RED_CRITICAL'
              ? 'bg-rose-950/70 border-rose-500 text-rose-100'
              : triage.severity === 'YELLOW_URGENT'
              ? 'bg-amber-950/70 border-amber-500 text-amber-100'
              : 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                triage.severity === 'RED_CRITICAL'
                  ? 'bg-rose-600 text-white'
                  : triage.severity === 'YELLOW_URGENT'
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {triage.severity === 'RED_CRITICAL' ? 'RED: IMMEDIATE TRANSFER' : triage.severity === 'YELLOW_URGENT' ? 'YELLOW: URGENT EVAL' : 'GREEN: STABLE HBNC'}
              </span>
              <span className="text-xs font-mono font-bold">
                Triage Score: {triage.score}/10
              </span>
            </div>

            <h3 className="text-lg font-bold mt-3 text-white">
              {triage.recommendedFacility === 'NICU_TERTIARY'
                ? 'Tertiary NICU Care'
                : triage.recommendedFacility === 'SNCU_DISTRICT'
                ? 'District Hospital SNCU'
                : triage.recommendedFacility === 'NBSU_FRU'
                ? 'Block CHC / NBSU'
                : 'Community Home Care'}
            </h3>
            <p className="text-xs mt-1 text-slate-300">
              {triage.primaryConcern}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Action Window:</span>
                <span className="font-bold text-white">&lt; {triage.urgencyWindowMinutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Specialized Transport:</span>
                <span className="font-bold text-white">{triage.requiresSpecializedTransport ? '108 Ambulance / Boat' : 'Regular Local'}</span>
              </div>
            </div>

            {/* Pre-Referral Stabilization Guide */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Pre-Referral Actions:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {triage.immediatePreReferralSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Trigger Button */}
            {triage.severity !== 'GREEN_OBSERVE' && (
              <button
                onClick={handleDispatchReferral}
                className="w-full mt-5 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-white text-rose-950 hover:bg-rose-100 flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                Dispatch 108 & Alert SNCU
              </button>
            )}
          </div>

          {/* Clinical Authority Disclaimer Box */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Statutory Clinical Notice:</span> In compliance with Health & Family Welfare guidelines, clinical and referral authorizations remain strictly with registered Medical Officers and Authorized Health Personnel. SishuSuraksha provides algorithmic decision support only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
