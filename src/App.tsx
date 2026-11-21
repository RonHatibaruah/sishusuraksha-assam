import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FieldTriageWorklist } from './components/FieldTriageWorklist';
import { FacilityBedCommand } from './components/FacilityBedCommand';
import { GeospatialReferralRouter } from './components/GeospatialReferralRouter';
import { HBNCContinuityTracker } from './components/HBNCContinuityTracker';
import { ExecutiveAnalyticsAudit } from './components/ExecutiveAnalyticsAudit';
import { CaregiverAdvisoryHub } from './components/CaregiverAdvisoryHub';
import { TutorialModal } from './components/TutorialModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('triage');
  const [selectedRole, setSelectedRole] = useState<string>('ASHA');
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'triage' && <FieldTriageWorklist />}
        {activeTab === 'beds' && <FacilityBedCommand />}
        {activeTab === 'routing' && <GeospatialReferralRouter />}
        {activeTab === 'hbnc' && <HBNCContinuityTracker />}
        {activeTab === 'audit' && <ExecutiveAnalyticsAudit />}
        {activeTab === 'advisory' && <CaregiverAdvisoryHub />}
      </main>

      <Footer />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
};

export default App;
