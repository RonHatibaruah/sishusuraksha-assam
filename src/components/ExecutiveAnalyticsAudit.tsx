import React from 'react';
import { DISTRICT_PERFORMANCE_METRICS } from '../data/assam_newborn_data';
import { 
  BarChart3, 
  TrendingDown, 
  Activity, 
  Award, 
  AlertTriangle, 
  FileSpreadsheet, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Users
} from 'lucide-react';

export const ExecutiveAnalyticsAudit: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              State Mission Command & Clinical Audit
            </span>
            <span className="text-xs text-slate-400">Department of Health & Family Welfare, Govt. of Assam</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Assam Neonatal Care Continuum & NMR Surveillance Command
          </h2>
          <p className="text-sm text-slate-400">
            Real-time executive oversight tracking the three delays, HBNC completion adherence, and clinical referral outcomes statewide.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-1.5 font-bold">
            <TrendingDown className="w-4 h-4" />
            Projected NMR Reduction: -4.8 pts / 1,000
          </span>
        </div>
      </div>

      {/* Statewide Top-Line KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Annual Neonatal Cohort</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ~4,85,000
          </div>
          <div className="text-[11px] text-purple-400 mt-1">Live births registered annually in Assam</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>High-Risk Danger Screenings</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            68,420
          </div>
          <div className="text-[11px] text-rose-400 mt-1">Early flagged at home/sub-centre (14.1%)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Mean Transit Dispatch Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            42.8 Min
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Down from 118 min baseline (-63.7%)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Post-SNCU HBNC Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            83.8%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Target &gt;80% achieved statewide</div>
        </div>
      </div>

      {/* District Performance Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            District-Level Continuum Performance & Aspirational Surveillance
          </h3>
          <span className="text-xs text-slate-400">High-Burden vs. Advanced Clusters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Baseline NMR (per 1,000)</th>
                <th className="py-3 px-4">HBNC 7-Visit Completion Rate</th>
                <th className="py-3 px-4">Avg. Transit-to-Care</th>
                <th className="py-3 px-4">SNCU Beds Active</th>
                <th className="py-3 px-4">Warmers Deployed</th>
                <th className="py-3 px-4">Early Detection %</th>
                <th className="py-3 px-4">Aspirational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {DISTRICT_PERFORMANCE_METRICS.map((row) => {
                const isHighBurden = row.nmrRate > 20.0;
                return (
                  <tr key={row.district} className="hover:bg-slate-950/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {row.district}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {row.nmrRate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.hbncCompletionPct >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${row.hbncCompletionPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-200">{row.hbncCompletionPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {row.avgTransitMinutes} mins
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300">
                      {row.activeSNCUBeds}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-300">
                      {row.totalWarmers}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-300">
                      {row.highRiskRate}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighBurden
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {isHighBurden ? 'High Priority Cluster' : 'Stabilized Zone'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Root Cause Clinical Bottleneck Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5 text-rose-300">
            <AlertTriangle className="w-4 h-4" />
            1st Delay: Care-Seeking at Home
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Mitigated through SishuSuraksha's automated Assamese/English SMS/WhatsApp advisories and ASHA danger-sign checklists, eliminating delay in recognizing lethargy and hypothermia.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5 text-amber-300">
            <Clock className="w-4 h-4" />
            2nd Delay: Transit to Facility
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Addressed via real-time 108 ambulance dispatch and riverine boat ambulance pre-positioning across Brahmaputra *chars*, cutting mean arrival times by 63.7%.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5 text-cyan-300">
            <CheckCircle2 className="w-4 h-4" />
            3rd Delay: Quality Bedside Care
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Eliminated via pre-arrival alert telemetry that primes radiant warmers, phototherapy units, and pediatric consultants prior to the newborn's ambulance touchdown.
          </p>
        </div>
      </div>
    </div>
  );
};
