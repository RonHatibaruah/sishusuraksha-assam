import React from 'react';
import { 
  Baby, 
  Building2, 
  Navigation, 
  HeartHandshake, 
  BarChart3, 
  MessageSquare, 
  HelpCircle, 
  ShieldAlert, 
  User,
  Heart
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  onOpenTutorial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRole,
  setSelectedRole,
  onOpenTutorial
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-rose-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            GOVERNMENT OF ASSAM
          </span>
          <span className="text-slate-600">|</span>
          <span>Health and Family Welfare Department ● National Health Mission (NHM) Assam</span>
          <span className="text-slate-600">|</span>
          <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-mono text-[10px] border border-rose-800/60 font-bold">
            NESFIC-D-26 Stream 1
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all font-semibold cursor-pointer"
            title="Open Tutorial Guide: What the application is and how to use it"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Tutorial & User Guide</span>
          </button>
          <span className="text-slate-500 font-mono hidden sm:inline">Dispur, Guwahati</span>
        </div>
      </div>

      {/* Main Brand & Role Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                SishuSuraksha <span className="text-rose-400 font-normal">শিশু-সুৰক্ষা</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PROTOTYPE LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Timely Identification, Referral & Follow-up of Sick Newborns
            </p>
          </div>
        </div>

        {/* Operational Role Switcher & Tutorial Quick-Button */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>How to Use</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 font-medium flex items-center gap-1 hidden sm:flex">
              <User className="w-3.5 h-3.5" />
              Role:
            </span>
            <button
              onClick={() => { setSelectedRole('ASHA'); setActiveTab('triage'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedRole === 'ASHA' ? 'bg-rose-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              ASHA / ANM
            </button>
            <button
              onClick={() => { setSelectedRole('FACILITY'); setActiveTab('beds'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedRole === 'FACILITY' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              SNCU Facility
            </button>
            <button
              onClick={() => { setSelectedRole('ROUTING'); setActiveTab('routing'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedRole === 'ROUTING' ? 'bg-purple-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              108 Dispatch
            </button>
            <button
              onClick={() => { setSelectedRole('EXECUTIVE'); setActiveTab('audit'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedRole === 'EXECUTIVE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              State Mission
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-800/60 flex space-x-1 overflow-x-auto py-1">
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'triage'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Baby className="w-4 h-4" />
          Field Triage (ASHA Screening)
        </button>

        <button
          onClick={() => setActiveTab('beds')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'beds'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          SNCU / NICU Bed Command
        </button>

        <button
          onClick={() => setActiveTab('routing')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'routing'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Navigation className="w-4 h-4" />
          108 Dispatch & Riverine Route
        </button>

        <button
          onClick={() => setActiveTab('hbnc')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hbnc'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          HBNC 7-Visit Continuum
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Statewide Surveillance & Audit
        </button>

        <button
          onClick={() => setActiveTab('advisory')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'advisory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Vernacular Caregiver Hub
        </button>
      </div>
    </header>
  );
};
