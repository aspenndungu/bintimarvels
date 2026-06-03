import { useState } from 'react';
import { Copy, Check, Terminal, Share2, Layers, CheckCircle2, MessageSquare, Database } from 'lucide-react';

export default function DeveloperGuide() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const codeSnippets = {
    woopeyload: `{
  "action": "woocommerce_order_created",
  "id": 88392,
  "status": "processing",
  "total": "900.00",
  "currency": "KES",
  "billing": {
    "first_name": "Wanjiku",
    "last_name": "Nduta",
    "phone": "+254712345678",
    "email": "wanjiku@domain.ke"
  },
  "line_items": [
    {
      "name": "Mrembo 12-Pack Comfort Box",
      "quantity": 1,
      "price": "900.00"
    }
  ],
  "meta_data": [
    {
      "key": "_consent_transactional",
      "value": "approved"
    },
    {
      "key": "_consent_marketing",
      "value": "approved"
    },
    {
      "key": "_consent_timestamp",
      "value": "2026-06-03T12:00:00Z"
    },
    {
      "key": "_consent_text_version",
      "value": "v1.0.3_2026_marketing_reorder"
    }
  ]
}`,
    n8nworkflow: `[
  {
    "parameters": {
      "path": "webhook/mrembo-order-created",
      "options": {}
    },
    "name": "WooCommerce Webhook",
    "type": "n8n-nodes-base.webhook",
    "position": [250, 240]
  },
  {
    "parameters": {
      "conditions": {
        "boolean": [
          {
            "value1": "={{$json.meta_data.find(m => m.key === '_consent_transactional').value}}",
            "value2": "approved"
          }
        ]
      }
    },
    "name": "Check Consent Status",
    "type": "n8n-nodes-base.if",
    "position": [450, 240]
  },
  {
    "parameters": {
      "text": "Hi {{$json.billing.first_name}}, thank you for choosing Mrembo Pads! We have received your order. Ref: #{{$json.id}}. Binti customer care will WhatsApp you shortly to confirm preferred delivery lines. Rep STOP to end.",
      "recipientPhon": "={{$json.billing.phone}}"
    },
    "name": "Send WhatsApp confirmation",
    "type": "n8n-nodes-base.whatsapp",
    "position": [700, 140]
  }
]`,
    analyticsCode: `// 1. Compliant GA4 & Meta Pixel Loader Guard
export function initAnalyticsWithConsent(consentGranted) {
  if (!consentGranted) {
    console.log('Telemetry disabled: Halting non-functional scripts');
    return;
  }
  
  // Load GA4
  const gaScript = document.createElement('script');
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER";
  gaScript.async = true;
  document.head.appendChild(gaScript);
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-PLACEHOLDER', { 'anonymize_ip': true });
  
  console.log('Telemetry successfully initialized under consumer approval');
}`
  };

  return (
    <div className="space-y-12" id="developer-guide-section">
      <div className="p-8 bg-[#FAF7F2] rounded-2xl border border-brand-clay">
        <div className="flex items-start gap-4">
          <Terminal className="w-8 h-8 text-brand-berry shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark">Developer Setup & Integrations</h2>
            <p className="text-brand-dark-light mt-1">
              Connect Mrembo Pads e-commerce elements securely to WooCommerce, SMS aggregators, n8n workflows, data storage layers, and browser pixels while tracking proper opt-in values in full audit tables.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Roadmap Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-brand-clay shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-brand-berry">
            <Share2 className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-brand-dark">WooCommerce Backend</h4>
          <p className="text-xs text-brand-dark-light leading-relaxed">
            Configure custom checkout fields inside PHP hooks. Add non-serialized keys for <code className="bg-brand-cream px-1 py-0.5 rounded border border-brand-clay">_consent_transactional</code> and <code className="bg-brand-cream px-1 py-0.5 rounded border border-brand-clay">_consent_marketing</code>. Ensure M-Pesa tracking codes save directly to invoice meta parameters. Only dispatch payloads to n8n if transactional consent registers valid flag values.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-brand-clay shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-brand-gold">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-brand-dark">n8n Execution Layer</h4>
          <p className="text-xs text-brand-dark-light leading-relaxed">
            Utilize webhook listeners to process instant customer orders. Connect webhook nodes to split conditions (IF blocks) mapping the exact consent attributes. Direct accepted states to Twilio or licensed local SMS aggregators for A2P delivery. Support failsafe fallback channels (e.g., mail delivery or automatic Slack alerts to manual human agents if deliveries lag).
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-brand-clay shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-brand-teal">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-brand-dark">Consent Logs Database</h4>
          <p className="text-xs text-brand-dark-light leading-relaxed">
            Maintains the primary proof ledger. Log entries must catalog: client E164 phone numbers, distinct checked checkboxes (transactional, reminder, marketing), source page relative URI, IP anonymized logs, local Timestamp, and exact string representations of the consent copy shown during form filling. Retain only for valid legal lifetimes.
          </p>
        </div>
      </section>

      {/* Code Blocks */}
      <section className="space-y-6">
        {/* WooCommerce webhook payload */}
        <div className="bg-brand-dark rounded-xl overflow-hidden border border-brand-dark-light">
          <div className="p-4 bg-brand-dark-light flex justify-between items-center text-xs">
            <span className="font-mono text-brand-clay flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              WooCommerce Hook JSON Payload (e-commerce event)
            </span>
            <button
              onClick={() => handleCopy(codeSnippets.woopeyload, 'wp')}
              className="px-2 py-1 bg-brand-dark border border-brand-dark-light hover:bg-[#4E352C] rounded text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedSection === 'wp' ? <Check className="w-3.5 h-3.5 text-[#0D6E4A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy JSON</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-[11px] font-mono text-brand-cream/90 leading-relaxed max-h-[300px]">
            {codeSnippets.woopeyload}
          </pre>
        </div>

        {/* n8n workflow node definition */}
        <div className="bg-brand-dark rounded-xl overflow-hidden border border-brand-dark-light">
          <div className="p-4 bg-brand-dark-light flex justify-between items-center text-xs">
            <span className="font-mono text-brand-clay flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              n8n Workflow Structure - Webhook Trigger and Consent router
            </span>
            <button
              onClick={() => handleCopy(codeSnippets.n8nworkflow, 'n8n')}
              className="px-2 py-1 bg-brand-dark border border-brand-dark-light hover:bg-[#4E352C] rounded text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedSection === 'n8n' ? <Check className="w-3.5 h-3.5 text-[#0D6E4A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy n8n Structure</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-[11px] font-mono text-brand-cream/90 leading-relaxed max-h-[300px]">
            {codeSnippets.n8nworkflow}
          </pre>
        </div>

        {/* Compliant telemetry analytics load code */}
        <div className="bg-brand-dark rounded-xl overflow-hidden border border-brand-dark-light">
          <div className="p-4 bg-brand-dark-light flex justify-between items-center text-xs">
            <span className="font-mono text-brand-clay flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span>
              Compliant GA4 & Meta Pixel Cookie Loading Guard
            </span>
            <button
              onClick={() => handleCopy(codeSnippets.analyticsCode, 'ga')}
              className="px-2 py-1 bg-brand-dark border border-brand-dark-light hover:bg-[#4E352C] rounded text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedSection === 'ga' ? <Check className="w-3.5 h-3.5 text-[#0D6E4A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Javascript Code</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-[11px] font-mono text-brand-cream/90 leading-relaxed max-h-[300px]">
            {codeSnippets.analyticsCode}
          </pre>
        </div>
      </section>

      {/* Database Schema diagram table */}
      <section className="bg-white rounded-xl border border-brand-clay overflow-hidden">
        <div className="p-6 bg-brand-cream border-b border-brand-clay">
          <h4 className="font-display font-bold text-brand-dark text-lg">Recommended Database Entity Mapping Schema</h4>
          <p className="text-xs text-brand-dark-light">Ensures ODPC Kenya & Meta security metrics audit requirements are satisfied on production servers.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-cream-dark/60 text-brand-dark border-b border-brand-clay font-medium font-display">
                <th className="p-4">Entity Type</th>
                <th className="p-4">Essential Parameters</th>
                <th className="p-4">Verification Context</th>
                <th className="p-4">Consent Action Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-dark">
              <tr>
                <td className="p-4 font-semibold text-brand-berry">Customer Base</td>
                <td className="p-4 font-mono text-brand-dark-light text-[11px]">customer_id, phone_e164, name, county, town, channel_source</td>
                <td className="p-4 leading-relaxed text-brand-dark-light">Identify user coordinates and segment individual buyers vs stockist retailers.</td>
                <td className="p-4 shrink-0"><span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-700 border border-red-200">Sensitive Mobile Key</span></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-brand-berry">Order Records</td>
                <td className="p-4 font-mono text-brand-dark-light text-[11px]">order_id, customer_id, bundle_id, quantity, amount_ksh, pay_ref, delivery_status</td>
                <td className="p-4 leading-relaxed text-brand-dark-light">M-Pesa transaction identifiers connected to exact bundle codes shipped.</td>
                <td className="p-4 shrink-0"><span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200">Tax & Billing Audits</span></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-brand-berry">Consent Audits</td>
                <td className="p-4 font-mono text-[#4F352C] text-[11px]">consent_id, phone_e164, channel, purpose, consent_ip, shown_text, timestamp</td>
                <td className="p-4 leading-relaxed text-brand-dark-light text-brand-dark-light">Keeps audit evidence proving the exactly unchecked text standard the user approved.</td>
                <td className="p-4 shrink-0"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">Legal Audit Proof</span></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-brand-berry">Cycle Reminders</td>
                <td className="p-4 font-mono text-brand-dark-light text-[11px]">reminder_id, customer_id, interval_days, last_date, active_status, hash_key</td>
                <td className="p-4 leading-relaxed text-brand-dark-light">Discreetly processed. Never shares cycle info with public third-party modules.</td>
                <td className="p-4 shrink-0"><span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 border border-purple-200">Explicit Opt-In Required</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
