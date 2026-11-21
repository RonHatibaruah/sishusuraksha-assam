import React from 'react';
import { 
  HelpCircle, 
  Baby, 
  Building2, 
  Navigation, 
  HeartHandshake, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  Flame,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 rounded-xl text-white shadow-lg shadow-rose-600/30">
              <Baby className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  SishuSuraksha (শিশু-সুৰক্ষা) • Evaluator & User Guide
                </h2>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-mono font-bold">
                  NESFIC-D-26
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                What this application is, why it was engineered for Assam, and step-by-step instructions on how to use every module
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Section 1: What is SishuSuraksha? */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>1. What is SishuSuraksha (শিশু-সুৰক্ষা)?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <b>SishuSuraksha</b> is an enterprise, offline-first clinical decision support, intelligent tri-level referral, and closed-loop neonatal care continuum platform engineered specifically for the <b>Health & Family Welfare Department, Government of Assam</b> and the <b>National Health Mission (NHM) Assam</b> under the <b>North East Seva First Innovation Challenge (NESFIC 2026 — Stream 1 Track: NESFIC-D-26)</b>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block text-[11px] text-rose-300">
                Gap 1: The Three Delays in Acute Neonatal Care
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Replaces delayed paper-based screening with structured offline mobile triage, pre-referral stabilization guidance, and automated 108 road/boat ambulance routing that pre-heats hospital radiant warmers.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block text-[11px] text-emerald-300">
                Gap 2: Post-Discharge HBNC Dropouts
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Connects hospital SNCU discharge records directly to the catchment village ASHA's phone, populating the 7 mandatory home visits (Days 1, 3, 7, 14, 21, 28, 42) with auto-escalation for missed visits.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Step-by-Step Module Guide */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>2. Step-by-Step Module Walkthrough</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Tab 1: Field Triage */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <Baby className="w-4 h-4" />
                  1. Field Triage (ASHA / ANM Mode)
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                  Bedside IMNCI
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <b>How to use:</b> Select any newborn case from the left cohort roster. Adjust the <b>Body Temperature slider</b> or use the <b>60-second breathing tap timer</b>. Check clinical danger signs (chest indrawing, grunting, poor suckling, cord pus). Watch the triage card dynamically classify the infant into <b>RED (Emergency SNCU/NICU Transfer)</b>, <b>YELLOW (Urgent NBSU Evaluation)</b>, or <b>GREEN (Stable HBNC)</b> with step-by-step pre-referral stabilization guidance.
              </p>
            </div>

            {/* Tab 2: Hospital Bed Command */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  2. SNCU / NICU Bed Command
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                  Hospital Telemetry
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <b>How to use:</b> View live occupancy across GMCH, FAAMCH Barpeta, Dhubri Civil Hospital, etc. Track available radiant warmers, phototherapy, and CPAP units. Inspect the <b>Incoming Transfer Queue</b>, acknowledge pre-arrival alerts to mobilize resuscitation teams, and click <b>Confirm Bed Admission</b>.
              </p>
            </div>

            {/* Tab 3: Geospatial Referral Router */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" />
                  3. 108 Emergency Dispatch & Routing
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                  Riverine & Road GIS
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <b>How to use:</b> Explore the interactive Leaflet GIS map of Assam. Toggle <b>Boat Ambulances (Char Fleet)</b> to view Brahmaputra sandbar island evacuation routes (e.g. Alomganj Char to Dhubri Hospital). Inspect real-time en-route vitals (SpO2, Temp, HR) transmitted directly from the boat/ambulance.
              </p>
            </div>

            {/* Tab 4: HBNC 7-Visit Care Continuum */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  4. HBNC 7-Visit Continuum
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                  Facility-to-Home
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <b>How to use:</b> Select a discharged infant to view their post-SNCU timeline. See scheduled visits for Days 1, 3, 7, 14, 21, 28, and 42. Click <b>Record ASHA Visit</b> to log weight gain and temperature, or click <b>Escalate to BPHN</b> on flagged overdue visits to trigger supervisory SMS alerts.
              </p>
            </div>

            {/* Tab 5: Statewide Surveillance & Audit */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  5. Statewide Surveillance & Audit
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                  Executive Radar
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <b>How to use:</b> Review top-line Assam neonatal health indicators (~4.85 lakh annual cohort, 63.7% transit reduction). Inspect the district ranking table highlighting high-burden aspirational districts (Dhubri, Barpeta, Goalpara) vs. stabilized clusters.
              </p>
            </div>

            {/* Tab 6: Vernacular Caregiver Hub */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  6. Vernacular Caregiver Advisory Hub
                </span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                  Assamese & English
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <b>How to use:</b> Test dispatching natural language counseling alerts to parents via Meta WhatsApp Cloud API and C-DAC SMS in <b>Assamese (অসমীয়া)</b> or English covering danger sign warnings, Kangaroo Mother Care, and exclusive breastfeeding.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Governance */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Statutory Governance & Clinical Authority</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            In compliance with the implementation directives of the Health & Family Welfare Department, Government of Assam, all clinical, diagnostic, and referral authorizations remain strictly with registered Medical Officers, Pediatricians, and Authorized Health Personnel. SishuSuraksha functions strictly as an auditable Clinical Decision Support System (CDSS) and emergency logistics coordination network.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Got It • Start Exploring SishuSuraksha
          </button>
        </div>
      </div>
    </div>
  );
};
