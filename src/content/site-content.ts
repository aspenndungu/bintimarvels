export type TimelineEntry = { year: string; title: string; text: string };
export type TeamMember = { name: string; role: string; bio: string; image: string };
export type ProjectStory = {
  year: string;
  title: string;
  summary: string;
  source: string;
  image?: string;
  imageAlt?: string;
  status?: 'completed' | 'announced';
};

export const SOCIAL_LINKS = [
  { label: 'Mrembo Instagram', href: 'https://www.instagram.com/mrembopads/' },
  { label: 'Mrembo TikTok', href: 'https://www.tiktok.com/@mrembo_254' },
  { label: 'Binti Instagram', href: 'https://www.instagram.com/bintipads_ke' },
  { label: 'Binti Facebook', href: 'https://www.facebook.com/Bintipadske/' },
  { label: 'Binti TikTok', href: 'https://www.tiktok.com/@bintipads' },
  { label: 'Binti on X', href: 'https://x.com/bintipads_ke' },
  { label: 'Binti YouTube', href: 'https://www.youtube.com/channel/UCjR_Gs3x5W8PZixuDvOJVIg' },
] as const;

export const COMPANY_TIMELINE: TimelineEntry[] = [
  { year: '2020', title: 'Binti begins', text: 'After more than a decade in aviation, Lorna Joyce stepped into menstrual care with a simple belief: women deserved products and access built around their reality.' },
  { year: '2021', title: 'The company takes shape', text: 'Binti Marvels was formally established and began building relationships with retailers, schools and community partners.' },
  { year: '2022', title: 'Binti reaches the market', text: 'Binti Pads entered commercial distribution, carried by a small team and the trust of neighbourhood retailers.' },
  { year: '2025', title: 'A deliberate pause', text: 'Import costs, currency pressure and unreliable supply made the original model difficult to sustain. The team paused, listened and rebuilt.' },
  { year: '2026', title: 'Mrembo, made in Kenya', text: 'Mrembo became Binti Marvels’ first locally produced product, made through a Kenyan contract-manufacturing partner.' },
];

export const TEAM: TeamMember[] = [
  { name: 'Lorna Joyce', role: 'Founder & CEO', image: '/story/lorna-joyce.webp', bio: 'A menstrual-health entrepreneur and former aviation operations leader, Lorna guides Binti Marvels’ product, customer and community vision.' },
  { name: 'Barnabas “Banns” Njiru', role: 'Operations', image: '/story/barnabas-njiru.webp', bio: 'Banns carries Binti’s operational work forward, helping move Mrembo products and school-support projects from plan to delivery.' },
];

export const PRODUCT_FEATURES = [
  { title: '8 regular pads', text: 'In every Mrembo pack.' },
  { title: 'Unscented', text: 'Straightforward care without added fragrance.' },
  { title: 'Cotton-feel', text: 'Soft and comfortable, as stated on the pack.' },
  { title: 'Made in Kenya', text: 'Locally produced through a contract-manufacturing partner.' },
] as const;

export const DISTRIBUTION_REGIONS = ['Nairobi', 'Embu', 'Nakuru', 'Kajiado'] as const;

export const CHARITY_PROJECTS: ProjectStory[] = [
  {
    year: 'May 2026',
    title: 'Menstrual Health Day at Lang’ata Women’s Prison',
    summary: 'Mrembo joined usikueMSHY and Kenya Youth Parliament for Water for a day centred on dignity, conversation and menstrual care.',
    source: 'https://www.tiktok.com/@lornajoycefa/video/7646069101844024584',
    image: '/impact/menstrual-health-day-2026.webp',
    imageAlt: 'Menstrual Hygiene Day 2026 event artwork for Lang’ata Women’s Prison',
    status: 'completed',
  },
  {
    year: 'May 2026',
    title: 'Dairyland Kenya × Mizizi Wellness',
    summary: 'Dairyland Kenya supported Mrembo product supply delivered through Mizizi Wellness, bringing companies and community care into the same room.',
    source: 'https://www.tiktok.com/@lornajoycefa/video/7643741666834140423',
    image: '/impact/dairyland-mizizi.webp',
    imageAlt: 'Adults at the Dairyland Kenya and Mizizi Wellness Mrembo product handover',
    status: 'completed',
  },
  {
    year: 'November 2024',
    title: 'Purple Dot and women in construction',
    summary: 'Purple Dot International documented its work with Binti Marvels to support menstrual care for women working in construction.',
    source: 'https://www.linkedin.com/posts/purple-dot-international-ltd_purple-dot-binti-marvel-partnership-activity-7267834053330956288-OLgb',
    status: 'completed',
  },
  {
    year: 'October 2024',
    title: 'Oldorko and Oldepe Primary Schools',
    summary: 'Binti’s Kajiado West outreach combined menstrual-health conversations with product support for the school communities.',
    source: 'https://www.instagram.com/p/DBIzxbVI-A7/',
    status: 'completed',
  },
  {
    year: 'June 2023',
    title: 'Rhino Charge with Dada Mwenzangu',
    summary: 'Binti and Dada Mwenzangu used the conservation event to bring menstrual-health visibility into a different public space.',
    source: 'https://www.tiktok.com/@lornajoycefa/video/7241900315446922502',
    status: 'completed',
  },
];

export const GOLF_SUPPORTERS = [
  'Absa Bank Kenya',
  'Tropical Heat Group',
  'JAZA',
  'KWAL',
  'Capital FM Kenya',
  'TRACE TV',
  'Solutech Limited',
  'Light Art Club',
  'Keeping a Girl in School',
] as const;

export const GOLF_SOURCE = 'https://www.tiktok.com/@lornajoycefa/video/7429657503140531462';

export const PRESS_LINKS = [
  { outlet: 'Business Daily', title: 'How a shutdown helped Binti rebuild', href: 'https://www.businessdailyafrica.com/bd/corporate/enterprise/how-sanitary-pads-company-shut-down-saved-the-business-5387500' },
  { outlet: 'Nation', title: 'From aviation to menstrual care', href: 'https://nation.africa/kenya/life-and-style/saturday-magazine/-i-traded-a-glorious-career-in-aviation-to-make-sanitary-pads--4650910' },
  { outlet: 'NTV Thamani', title: 'Binti Pads on Thamani', href: 'https://ntvkenya.co.ke/business/binti-pads-on-thamani/' },
  { outlet: 'The Star', title: 'The strength behind the founder', href: 'https://www.the-star.co.ke/sasa/lifestyle/2023-05-04-strength-of-a-woman-bereaved-of-all-family/' },
  { outlet: 'KTN', title: 'The inspiring story of Lorna Joyce', href: 'https://www.standardmedia.co.ke/podcast/podcasts/291/general-podcasts/episodes/1679/the-inspiring-story-of-lorna-joyce-founder-of-binti-pads' },
] as const;

export const FOUNDER_VIDEO = {
  title: 'Binti Pads, period poverty and the African woman who refuses to quit',
  publisher: '(So) How’s Business? | African Women Entrepreneurs',
  href: 'https://www.youtube.com/watch?v=aXwZ7PEVbzA',
  embed: 'https://www.youtube-nocookie.com/embed/aXwZ7PEVbzA?rel=0',
  image: '/press/how-is-business-youtube.webp',
} as const;
