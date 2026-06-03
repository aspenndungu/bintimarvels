import { IMAGE_ASSERTS } from '../data';
import { Image, ExternalLink, ShieldCheck, HeartPulse, CheckSquare } from 'lucide-react';

export default function AssetRegister() {
  return (
    <div className="space-y-8" id="asset-register-section">
      <div className="p-8 bg-[#FAF7F2] rounded-2xl border border-brand-clay">
        <div className="flex items-start gap-4">
          <Image className="w-8 h-8 text-brand-berry shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark">Uploaded Asset Directory & Alignment Map</h2>
            <p className="text-brand-dark-light mt-1">
              Binti Marvels and Mrembo provided high-fidelity physical photograph assets. We map these physical visual components directly into sections of our website concept below.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {IMAGE_ASSERTS.map((asset) => (
          <div key={asset.filename} className="p-6 bg-white rounded-xl border border-brand-clay shadow-xs space-y-4 hover:border-brand-berry transition-colors flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="p-1 px-2.5 rounded-full text-[10px] bg-brand-cream border border-brand-clay text-brand-dark font-mono font-medium">
                  {asset.filename.endsWith('.png') ? 'PNG Logo Accent' : 'JPEG Photography'}
                </span>
                <span className="text-[10px] text-brand-dark-light font-mono truncate max-w-[150px]">
                  Drive ID: {asset.driveId.slice(0, 10)}...
                </span>
              </div>
              <h4 className="font-display font-bold text-brand-dark text-lg">{asset.originalName.replace(/\..+$/, '')}</h4>
              <p className="text-xs text-brand-dark-light leading-relaxed">
                <strong className="text-brand-dark-light text-brand-dark font-medium">Mapped Purpose: </strong> {asset.purpose}
              </p>
              <p className="text-xs text-brand-dark-light leading-relaxed">
                <strong className="text-brand-dark-light text-brand-dark font-medium">Suggested UI Grid Placement: </strong> {asset.suggestedSection}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-cream-dark flex items-center justify-between text-xs font-medium text-brand-berry">
              <div className="flex items-center gap-1 text-brand-teal font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Ready for live layout use</span>
              </div>
              <span className="text-brand-dark-light font-mono text-[10px]">Reference: /assets/drive/{asset.filename}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rationale on original photography vs social media flyers */}
      <div className="p-6 bg-[#FAF7F2] rounded-xl border border-brand-clay space-y-3">
        <h4 className="font-display font-medium text-brand-dark text-base flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-brand-berry" />
          <span>Strategic Decision Checklist for Creative Assets</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-brand-dark-light leading-relaxed">
          <div className="space-y-2">
            <div className="flex gap-2 items-start">
              <CheckSquare className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
              <span>
                <strong>Founder & Team Imagery First:</strong> Uses <code className="bg-white/80 border border-brand-clay px-1 rounded text-brand-dark">lorna-joyce-binti.jpeg</code> inside the "Founder Story / CEO Trust Box" to humanize the business and differentiate from fly-by-night importers.
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <CheckSquare className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
              <span>
                <strong>Supply Chain Audits:</strong> Integrates <code className="bg-white/80 border border-brand-clay px-1 rounded text-brand-dark">lorna-at-warehouse-binti.jpeg</code> directly in the Wholesale & Reseller submission flow to give buyers proof of stock volume scale.
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2 items-start">
              <CheckSquare className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
              <span>
                <strong>CSR & NGO Integrity:</strong> Uses <code className="bg-white/80 border border-brand-clay px-1 rounded text-brand-dark">lorna-binti-donation-kitui.jpeg</code> as full verification proof for school distribution bulk campaigns, maintaining accountability.
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <CheckSquare className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
              <span>
                <strong>Avoid Flyer Noise:</strong> Rather than pasting pixelated posters with baked-in text directly on the website (which hampers text parsing and SEO indexes), we extract their price configurations (KSh 500, KSh 900, etc.) and copy hooks, rendering them in pristine HTML.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
