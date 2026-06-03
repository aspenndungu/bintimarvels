import { useState } from 'react';
import { Copy, Check, Palette, Sparkles, AlertCircle, Type, LayoutGrid } from 'lucide-react';

export default function BrandingTokens() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const tokens = {
    colors: [
      { name: 'Deep Berry / Plum', hex: '#5A082C', role: 'Main Brand Primary Accent. Imparts premium, rich confidence without looking clinical.', cls: 'bg-brand-berry text-white' },
      { name: 'Berry Dark', hex: '#3D041C', role: 'Deepest borders, heavy heading hover states, and premium text accents.', cls: 'bg-brand-berry-dark text-white' },
      { name: 'Warm Cream Accent', hex: '#FDFBF7', role: 'Warm, editorial canvas base background. Far more eye-safe, expensive, and lifestyle-led than stark clinical whites.', cls: 'bg-brand-cream border border-[#DFCDC5] text-[#22140F]' },
      { name: 'Warm Cream Darker', hex: '#F5EFEB', role: 'Card backgrounds, strip buffers, and subtle page divider intervals.', cls: 'bg-brand-cream-dark border border-[#DFCDC5] text-[#22140F]' },
      { name: 'Blush Clay Netrual', hex: '#EFE4DF', role: 'Product section borders, tertiary buttons, container frames, and placeholder tints.', cls: 'bg-brand-clay text-[#22140F]' },
      { name: 'Blush Clay Dark', hex: '#DFCDC5', role: 'Highly responsive icons, structural lines, disabled states, and border outlines.', cls: 'bg-brand-clay-dark text-[#22140F]' },
      { name: 'Ochre Gold Highlight', hex: '#D9A520', role: 'Attention multipliers, badges, interactive elements, highlights, and star reviews.', cls: 'bg-brand-gold text-white' },
      { name: 'Dark Cocoa Ink', hex: '#22140F', role: 'Primary typographic heavy text. Deep charcoal with warm brown undertones that feels organic and clean.', cls: 'bg-brand-dark text-white' },
      { name: 'Safety Green Teal', hex: '#0D6E4A', role: 'Explicit consent states, checkmarks, checkout success ticks, and security elements only.', cls: 'bg-brand-teal text-white' }
    ],
    typography: [
      { role: 'Display Headings', tag: 'font-display', family: '"Outfit", sans-serif', size: '2.25rem - 4.5rem', use: 'Main hero, high-impact campaign hooks, major card metrics. Gives a bold, lifestyle-first feminine edge.' },
      { role: 'Editorial Subheadings', tag: 'font-serif', family: '"Playfair Display", Georgia, serif', size: '1.5rem - 2.5rem', use: 'Story headings, quotes, premium product names. Adds local, high-trust organic luxury.' },
      { role: 'Body / User Forms', tag: 'font-sans', family: '"Inter", sans-serif', size: '0.875rem - 1.125rem', use: 'Standard descriptions, consent panels, inputs, user feedback. Maximizes mobile screen legibility.' },
      { role: 'Technical Stats', tag: 'font-mono', family: '"JetBrains Mono", monospace', size: '0.75rem - 0.875rem', use: 'Product specifications, price codes, batch details, metadata verification lines.' }
    ]
  };

  return (
    <div className="space-y-12" id="branding-tokens-section">
      <div className="p-8 bg-[#FAF7F2] rounded-2xl border border-brand-clay">
        <div className="flex items-start gap-4">
          <Palette className="w-8 h-8 text-brand-berry shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark">Branding & Conversional Art Direction</h2>
            <p className="text-brand-dark-light mt-1">
              Mrembo represents a premium-African, beauty-adjacent identity. It deliberately replaces standard, clinical, pale pink, or corporate shapes with warm, self-confident lifestyle colors that reflect of the ambitious lives of Kenyan women. Binti represents the access, schools, and dignity lane. Together, they represent one dignity mission across two life stages.
            </p>
          </div>
        </div>
      </div>

      {/* Colors Swatch Panel */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-brand-gold" />
          <h3 className="font-display text-xl font-bold text-brand-dark">Color Code Master Palette</h3>
        </div>
        <p className="text-sm text-brand-dark-light">Click any token to instantly copy its CSS variable name or color hex.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.colors.map((c) => (
            <div key={c.hex} className="bg-white rounded-xl border border-brand-clay shadow-xs overflow-hidden flex flex-col hover:border-brand-berry transition-all pointer-events-auto">
              <div className={`h-24 ${c.cls} flex items-end p-4 font-mono text-xs font-bold justify-between`}>
                <span className="backdrop-blur-xs bg-black/20 px-2 py-1 rounded-sm">{c.hex}</span>
                <span className="backdrop-blur-xs bg-black/20 px-2 py-1 rounded-sm">v4</span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-semibold text-brand-dark text-base">{c.name}</h4>
                  <p className="text-xs text-brand-dark-light mt-1 line-clamp-3 leading-relaxed">{c.role}</p>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-brand-cream-dark">
                  <button
                    onClick={() => copyToClipboard(c.hex, c.hex)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-brand-cream border border-brand-clay rounded-lg text-xs font-medium text-brand-dark hover:bg-brand-clay transition-colors cursor-pointer"
                  >
                    {copied === c.hex ? <Check className="w-3.5 h-3.5 text-brand-teal" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>HEX</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(`var(--color-brand-${c.name.toLowerCase().split(' ')[0]})`, c.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-brand-cream border border-brand-clay rounded-lg text-xs font-medium text-brand-dark hover:bg-brand-clay transition-colors cursor-pointer"
                  >
                    {copied === c.name ? <Check className="w-3.5 h-3.5 text-brand-teal" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Tailwind Var</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Panel */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-brand-berry" />
          <h3 className="font-display text-xl font-bold text-brand-dark">Typography Pairing Standards</h3>
        </div>
        <div className="bg-white rounded-xl border border-brand-clay divide-y divide-brand-clay overflow-hidden">
          {tokens.typography.map((t) => (
            <div key={t.role} className="p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-brand-clay text-brand-dark font-mono text-xs rounded-full font-medium">{t.tag}</span>
                  <span className="text-xs text-brand-dark-light">{t.family}</span>
                </div>
                <h4 className="font-display font-bold text-lg text-brand-dark">{t.role}</h4>
                <p className="text-xs text-brand-dark-light leading-relaxed">{t.use}</p>
              </div>
              <div className="border-l border-brand-clay pl-4 md:border-l-0 md:pl-0 text-right">
                <span className="block font-mono text-xs text-brand-dark-light">Target Scale</span>
                <span className="block text-2xl font-bold text-brand-berry">{t.size}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Copy Guardrails */}
      <section className="p-6 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-display font-bold text-amber-900">Important Medical Copy Guardrails</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              To strictly support Meta / SMS review and preserve authentic consumer trust, Binti Marvels and Mrembo must NEVER present clinical or unsupported medical claims. Refrain from claiming products:
            </p>
            <ul className="text-xs text-amber-800 list-disc pl-5 space-y-1">
              <li>Cure vaginal or fungal infections</li>
              <li>Alleviate or completely treat medical cramp conditions (Dysmenorrhea)</li>
              <li>Guarantee health or physiological outcomes</li>
              <li>Possess non-substantiated biological functions</li>
            </ul>
            <p className="text-xs text-amber-800 italic mt-2">
              Instead, emphasize lifestyle traits: 12-Hour leak-guards, dry cotton-feel topsheets, absolute daily comfort, body-friendly unscented security, and premium African craftsmanship.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
