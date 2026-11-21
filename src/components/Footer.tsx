import React from 'react';
import { Baby, ShieldCheck, Heart, AlertCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 text-xs text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Brand & Metadata Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">
                SishuSuraksha • শিশু-সুৰক্ষা
              </div>
              <div className="text-slate-500 text-[11px]">
                Assam Sick Newborn Identification, Triage, Referral & HBNC Continuum Platform
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
            <span>NESFIC-D-26 Stream 1 (Government Track)</span>
            <span>Health and Family Welfare Department, Govt. of Assam</span>
            <span>National Health Mission (NHM) Assam</span>
            <span>India Newborn Action Plan (INAP)</span>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <div>Innovation Applicant: <b>Ron Hatibaruah</b></div>
            <div>North East Seva First Innovation Challenge 2026</div>
          </div>
        </div>

        {/* Mandatory Statutory Clinical Governance & Legal Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>STATUTORY CLINICAL & REGULATORY DISCLAIMER:</span>
          </div>
          <p>
            <b>SishuSuraksha (শিশু-সুৰক্ষা)</b> is an experimental Clinical Decision Support System (CDSS) and emergency care-coordination platform engineered as a prototype for the <b>North East Seva First Innovation Challenge (NESFIC 2026 — Challenge ID: NESFIC-D-26)</b> under the Department of Health and Family Welfare, Government of Assam and National Health Mission (NHM) Assam.
          </p>
          <p>
            <b>Medical Authority Reservation:</b> In strict compliance with statutory medical guidelines and the department’s implementation directives, <u>all clinical, diagnostic, medication, and referral decisions remain solely and exclusively with registered Medical Officers, Pediatricians, and Authorized Health Personnel</u>. The algorithmic danger-sign screening tools, vital counters, and automated referral suggestions are designed solely to assist frontline community health workers (ASHAs/ANMs) in rapid triaging and are <b>not intended to override, replace, or supersede professional clinical evaluation or mandated protocols</b>.
          </p>
          <p className="text-slate-500 text-[10px]">
            Data displayed in the live demonstration represents validated synthetic neonatal cohorts for Assam's geographical terrain. All production operations comply with the Digital Personal Data Protection (DPDP) Act 2023, Ayushman Bharat Digital Mission (ABDM) standards, and ASDC security specifications.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-2 border-t border-slate-900 text-center text-[10px] text-slate-600">
          © 2026 Government of Assam • Department of Health & Family Welfare • National Health Mission (NHM) Assam • All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
