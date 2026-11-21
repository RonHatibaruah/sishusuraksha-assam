import React, { useState } from 'react';
import { MOCK_CAREGIVER_ADVISORIES, MOCK_NEWBORNS } from '../data/assam_newborn_data';
import { CaregiverAdvisory } from '../types/newborn';
import { 
  MessageSquare, 
  Send, 
  PhoneCall, 
  CheckCheck, 
  Volume2, 
  Globe, 
  Sparkles,
  ShieldCheck,
  Heart
} from 'lucide-react';

export const CaregiverAdvisoryHub: React.FC = () => {
  const [advisories, setAdvisories] = useState<CaregiverAdvisory[]>(MOCK_CAREGIVER_ADVISORIES);
  const [selectedLanguage, setSelectedLanguage] = useState<'ASSAMESE' | 'ENGLISH'>('ASSAMESE');
  const [customPhone, setCustomPhone] = useState('+91-98642-11409');
  const [customTopic, setCustomTopic] = useState<'DANGER_SIGNS' | 'KMC_WARMTH' | 'EXCLUSIVE_BREASTFEEDING'>('DANGER_SIGNS');
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  const handleSendAdvisory = () => {
    const newAdv: CaregiverAdvisory = {
      id: `ADV-${Date.now()}`,
      newbornId: 'NB-2026-081',
      recipientPhone: customPhone,
      channel: 'WHATSAPP',
      language: selectedLanguage,
      topic: customTopic,
      messageText: customTopic === 'DANGER_SIGNS'
        ? 'DANGER ALERT: If your baby develops low temperature, refusal to suckle, or rapid breathing, call 108 or your ASHA immediately.'
        : customTopic === 'KMC_WARMTH'
        ? 'Thermal Care: Keep baby warm with skin-to-skin Kangaroo Mother Care. Do not bathe baby in cold water.'
        : 'Nutrition: Feed only mother’s breast milk. Do not give honey, water, or animal milk.',
      messageAssamese: customTopic === 'DANGER_SIGNS'
        ? 'সতৰ্কবাৰ্তা: যদি কেঁচুৱাৰ গা ঠাণ্ডা পৰে, গাখীৰ খোৱা বন্ধ কৰে বা উশাহ খৰ হয়, পলম নকৰি ১০৮ বা আশাক ফোন কৰক।'
        : customTopic === 'KMC_WARMTH'
        ? 'কেংগাৰু মাদাৰ কেয়াৰ: কেঁচুৱাটোক মাতৃৰ বুকুত ছালৰ সৈতে ছাল লগাই উম দিয়ক। ঠাণ্ডা পানীৰে গা ধুৱাব নালাগে।'
        : 'পৰিপুষ্টি: নৱজাতকক কেৱল মাতৃদুগ্ধই খুৱাওক। পানী, মৌ বা অন্য গাখীৰ কেতিয়াও নিদিব।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryStatus: 'DELIVERED',
    };

    setAdvisories([newAdv, ...advisories]);
    setSendSuccess(`Vernacular advisory dispatched via Meta WhatsApp Cloud API to ${customPhone} in ${selectedLanguage}.`);
    setTimeout(() => setSendSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              Vernacular Caregiver Advisory Engine
            </span>
            <span className="text-xs text-slate-400">Assamese (অসমীয়া) & English Multi-Channel Gateway</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Automated Family Counseling, Danger-Sign Warnings & KMC Reminders
          </h2>
          <p className="text-sm text-slate-400">
            Delivers actionable maternal and newborn counseling directly into parents' phones via WhatsApp Cloud API, C-DAC SMS, and IVRS voice calls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedLanguage(selectedLanguage === 'ASSAMESE' ? 'ENGLISH' : 'ASSAMESE')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            Language: {selectedLanguage === 'ASSAMESE' ? 'অসমীয়া (Assamese)' : 'English'}
          </button>
        </div>
      </div>

      {sendSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-sm font-medium flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>{sendSuccess}</div>
        </div>
      )}

      {/* Main Grid: Advisory Dispatch Simulator (5 cols) & Live Message Feed (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dispatch Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Dispatch Vernacular Advisory
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Parent Mobile Number:</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Advisory Topic:</label>
                <select
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="DANGER_SIGNS">Danger Sign Red-Flag Warning (Hypothermia/Sepsis)</option>
                  <option value="KMC_WARMTH">Kangaroo Mother Care (Thermal Support)</option>
                  <option value="EXCLUSIVE_BREASTFEEDING">Exclusive Breastfeeding & Latching</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Delivery Channel:</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-slate-950 border border-emerald-500 text-emerald-300 font-bold text-center">
                    WhatsApp
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 text-center">
                    Bulk SMS
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 text-center">
                    IVRS Voice
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendAdvisory}
                className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                Dispatch Natural Language Advisory
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Dialect & Literacy Adaptation:
            </h4>
            <p className="text-slate-400 leading-relaxed">
              For low-literacy communities in tea garden lines and riverine *chars*, advisories are supplemented with 30-second automated voice audio clips in standard Assamese, Bengali, and Bodo dialects.
            </p>
          </div>
        </div>

        {/* Right Column: Live Message Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">
                Live Caregiver Message Activity Feed
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {advisories.length} Messages Logged
              </span>
            </div>

            <div className="space-y-3">
              {advisories.map(adv => {
                return (
                  <div
                    key={adv.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {adv.channel}
                        </span>
                        <span className="font-mono text-slate-300">{adv.recipientPhone}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{adv.timestamp}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {adv.messageAssamese}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-2 pt-2 border-t border-slate-800/60 leading-relaxed">
                        <b>EN Translation:</b> {adv.messageText}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Topic: <b>{adv.topic.replace('_', ' ')}</b></span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCheck className="w-3.5 h-3.5" />
                        {adv.deliveryStatus}
                      </span>
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
