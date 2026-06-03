import React, { useState } from 'react';
import { COMPLIANCE_CHECKLIST, DRAFT_TEMPLATES } from '../data';
import { ComplianceChecklistItem } from '../types';
import { ShieldCheck, AlertOctagon, HelpCircle, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function ComplianceViewer() {
  const [checklist, setChecklist] = useState<ComplianceChecklistItem[]>(COMPLIANCE_CHECKLIST);
  const [demoState, setDemoState] = useState({
    name: 'Wanjiko Nduta',
    phone: '0712345678',
    consentTrans: false,
    consentMark: false,
    consentReminders: false,
  });
  const [submittedLogs, setSubmittedLogs] = useState<any[]>([]);

  const toggleStatus = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' }
          : item
      )
    );
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      timestamp: new Date().toISOString(),
      name: demoState.name,
      phone: "+254" + demoState.phone.replace(/^0/, ''),
      optins: {
        transactional: demoState.consentTrans ? 'GRANTED' : 'DENIED (Default)',
        marketing: demoState.consentMark ? 'GRANTED' : 'DENIED (Default)',
        reorderReminders: demoState.consentReminders ? 'GRANTED' : 'DENIED (Default)'
      },
      schema_audit: {
        text_version: 'v1.0.3_2026_audit',
        user_agent_consent: 'captured_via_interactive_prototype_viewer'
      }
    };
    setSubmittedLogs([newLog, ...submittedLogs]);
  };

  return (
    <div className="space-y-12" id="compliance-viewer-section">
      <div className="p-8 bg-[#FAF7F2] rounded-2xl border border-brand-clay">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-brand-berry shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark">Compliance & Consent Framework</h2>
            <p className="text-brand-dark-light mt-1">
              To operate legally inside Kenya under the Data Protection Act (ODPC) and satisfy Meta’s strict business review guidelines for automated WhatsApp and SMS templates, Binti Marvels Ltd must execute airtight, active, unchecked consent structures.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Checklist Board */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-brand-dark">Interactive Launch Checklist</h3>
            <p className="text-xs text-brand-dark-light">Toggle item status bubbles dynamically as you review launch readiness.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-brand-dark-medium">Completed: </span>
            <span className="text-sm font-bold text-brand-berry bg-brand-clay/30 px-3 py-1 rounded-full">
              {checklist.filter(c => c.status === 'Completed').length} / {checklist.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all ${
                item.status === 'Completed'
                  ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                  : 'bg-white border-brand-clay hover:border-amber-300'
              } pointer-events-auto flex flex-col md:flex-row md:items-start select-none`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`mt-1 h-5 w-5 rounded-md flex shrink-0 items-center justify-center cursor-pointer transition-colors border ${
                    item.status === 'Completed'
                      ? 'bg-brand-teal border-brand-teal text-white'
                      : 'bg-white border-brand-clay-dark text-transparent hover:border-brand-berry'
                  }`}
                >
                  ✓
                </button>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xs font-bold text-brand-dark">{item.category}</span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-brand-dark text-base">{item.title}</h4>
                  <p className="text-xs text-brand-dark-light leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:pl-6 md:border-l border-brand-clay md:w-80 shrink-0">
                <span className="block font-mono text-[10px] text-brand-dark-light uppercase font-bold tracking-wider">Next Immediate Task</span>
                <p className="text-xs text-brand-dark-light italic mt-1 leading-relaxed">{item.actionNeeded}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Opt-In interactive logger simulator */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Compliance Simulator Form */}
        <div className="bg-white border border-brand-clay rounded-2xl overflow-hidden shadow-xs p-6 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-brand-gold uppercase font-bold tracking-widest">Airtight UX Sandbox</span>
            <h3 className="font-display text-lg font-bold text-brand-dark">Active Consent Logger Subscriptions</h3>
            <p className="text-xs text-brand-dark-light">Simulate filling out an order checkout. Notice how checkbox labels explicitly outline Binti Marvels compliance rules. None of these fields are pre-ticked (Mandated by meta guidelines).</p>
          </div>

          <form onSubmit={handleDemoSubmit} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-brand-dark block text-xs">Customer Full Name</label>
                <input
                  type="text"
                  value={demoState.name}
                  onChange={(e) => setDemoState({ ...demoState, name: e.target.value })}
                  className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry"
                />
              </div>
              <div className="space-y-1">
                <label className="text-brand-dark block text-xs">Phone Number</label>
                <input
                  type="text"
                  value={demoState.phone}
                  onChange={(e) => setDemoState({ ...demoState, phone: e.target.value })}
                  className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-mono"
                />
              </div>
            </div>

            {/* Checkbox 1: Transactional */}
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-brand-clay flex items-start gap-3">
              <input
                type="checkbox"
                id="c-trans"
                checked={demoState.consentTrans}
                onChange={(e) => setDemoState({ ...demoState, consentTrans: e.target.checked })}
                className="mt-0.5 shrink-0 accent-brand-berry w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <label htmlFor="c-trans" className="cursor-pointer text-brand-dark text-xs block font-bold">
                  Consent 1: Operational Transaction Notifications (Required for Delivery)
                </label>
                <span className="text-[10px] text-brand-dark-light block leading-relaxed">
                  I agree that Binti Marvels Ltd may contact me via WhatsApp or SMS to coordinate shipping logistics, coordinate payment details, and deliver dispatch receipts. Binti Marvels will never sell your contacts.
                </span>
              </div>
            </div>

            {/* Checkbox 2: Period Reminders */}
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-brand-clay flex items-start gap-3">
              <input
                type="checkbox"
                id="c-remind"
                checked={demoState.consentReminders}
                onChange={(e) => setDemoState({ ...demoState, consentReminders: e.target.checked })}
                className="mt-0.5 shrink-0 accent-brand-berry w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <label htmlFor="c-remind" className="cursor-pointer text-brand-dark text-xs block font-bold">
                  Consent 2: Discreet Cycle / Reorder Safety Alarms (Optional)
                </label>
                <span className="text-[10px] text-brand-dark-light block leading-relaxed text-[#5C3E33]">
                  I explicitly opt in to receive highly discreet, private monthly period predictions and scheduled automated reorder reminder messages every 28 days via SMS and WhatsApp.
                </span>
              </div>
            </div>

            {/* Checkbox 3: Marketing */}
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-brand-clay flex items-start gap-3">
              <input
                type="checkbox"
                id="c-mark"
                checked={demoState.consentMark}
                onChange={(e) => setDemoState({ ...demoState, consentMark: e.target.checked })}
                className="mt-0.5 shrink-0 accent-brand-berry w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <label htmlFor="c-mark" className="cursor-pointer text-brand-dark text-xs block font-bold">
                  Consent 3: Brand Marketing Broadcasts & Offers (Optional)
                </label>
                <span className="text-[10px] text-brand-dark-light block leading-relaxed">
                  Bula! Please keep me updated with seasonal news regarding free school pad donations, reseller opportunities, community events, and bulk pack bargains. Reply STOP to opt out.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-center py-3 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-medium rounded-xl cursor-pointer transition-colors relative pointer-events-auto"
            >
              Simulate Submitting Consent Parameters
            </button>
          </form>
        </div>

        {/* Real-time Consent Audit Output */}
        <div className="bg-brand-dark rounded-2xl border border-brand-dark-light overflow-hidden p-6 shadow-md h-full flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-brand-gold uppercase block bg-brand-dark-light border border-brand-dark-light px-2.5 py-1 rounded inline-block">
              Server Logs Console (Consent Webhook Dispatcher)
            </span>
            <h4 className="font-display font-bold text-white text-base">Real-time Opt-In Verification Stream</h4>
            <p className="text-xs text-brand-clay leading-relaxed">
              When a consumer clicks "Submit", their exact checked states are dispatched to your backend databases. Here is the mock payload compiled live that satisfies legal auditing requirements:
            </p>
          </div>

          <div className="bg-black/40 rounded-lg p-4 flex-1 h-[250px] overflow-y-auto font-mono text-brand-cream/80 text-[11px] leading-relaxed space-y-4 border border-[#482F24]">
            {submittedLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-brand-clay/50 space-y-2 text-xs">
                <Clock className="w-8 h-8 animate-pulse text-brand-clay" />
                <p>Waiting for sandbox submits...</p>
                <p className="text-[10px] max-w-[200px]">Fill original name, check optional tick boxes and click submit on the left.</p>
              </div>
            ) : (
              submittedLogs.map((log, i) => (
                <div key={i} className="border-b border-[#482F24] pb-4 space-y-1 font-mono text-brand-cream/95">
                  <div className="flex justify-between font-bold text-brand-teal text-[10px]">
                    <span>[API_LOG_CAPTURED]</span>
                    <span>{log.timestamp.slice(11, 19)}</span>
                  </div>
                  <div>Name: <span className="text-brand-cream font-semibold">{log.name}</span></div>
                  <div>Phone: <span className="text-brand-cream font-mono">{log.phone}</span></div>
                  <div className="pl-2 space-y-0.5 border-l border-brand-clay-dark/30 my-1 text-xs">
                    <div>- OptIn Operational: <span className={log.optins.transactional === 'GRANTED' ? 'text-brand-teal' : 'text-rose-400'}>{log.optins.transactional}</span></div>
                    <div>- OptIn Cycle Alerts: <span className={log.optins.reorderReminders === 'GRANTED' ? 'text-brand-teal' : 'text-rose-400'}>{log.optins.reorderReminders}</span></div>
                    <div>- OptIn Promotional: <span className={log.optins.marketing === 'GRANTED' ? 'text-brand-teal' : 'text-rose-400'}>{log.optins.marketing}</span></div>
                  </div>
                  <div className="text-[10px] text-brand-clay/60">Version: {log.schema_audit.text_version} | Status: Recorded</div>
                </div>
              ))
            )}
          </div>
          <div className="text-[10px] text-brand-clay leading-relaxed">
            * Note: Storing exact visual text version limits is an ODPC directive. If Binti updates its marketing text wording, old logs remain protected within older version tags.
          </div>
        </div>
      </section>

      {/* Copy of Meta-Approved Wording templates */}
      <section className="bg-white rounded-xl border border-brand-clay p-6 space-y-4">
        <h3 className="font-display text-lg font-bold text-brand-dark">Pre-Approved Template Copy Guidelines</h3>
        <p className="text-xs text-brand-dark-light">Standard template copies to deploy inside n8n or SMS aggregators. These contain necessary unprompted opting descriptions:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(DRAFT_TEMPLATES).slice(0,3).map(([key, value]) => (
            <div key={key} className="p-4 bg-brand-cream rounded-lg border border-brand-clay space-y-2 text-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="font-bold text-brand-dark font-display">{value.title}</h4>
                <div className="p-3 bg-white rounded border border-brand-clay font-mono text-[11px] text-[#4E2F23]/80 leading-relaxed">
                  "{value.copy}"
                </div>
              </div>
              <p className="text-[10px] italic text-brand-dark-light pt-2 border-t border-brand-clay/40">{value.context}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
