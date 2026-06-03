import { MremboProduct, ComplianceChecklistItem, ImageAssetInfo } from './types';

export const MREMBO_PRODUCTS: MremboProduct[] = [
  {
    id: 'mrembo-6',
    name: 'Mrembo 6-Pack Starter Bundle',
    packs: 6,
    totalPads: 48,
    priceKsh: 500,
    badge: 'Starter',
    description: 'Perfect for small households or trying Mrembo for the first time. Comes with lightweight, leak-proof confidence.',
    imageSrc: '/bundle_6.png'
  },
  {
    id: 'mrembo-12',
    name: 'Mrembo 12-Pack Comfort Box',
    packs: 12,
    totalPads: 96,
    priceKsh: 900,
    badge: 'Most Popular',
    description: 'Our overall best-seller. Designed for 2-3 months of uninterrupted peace, keeping your days fully on track.',
    isPopular: true,
    imageSrc: '/bundle_12.png'
  },
  {
    id: 'mrembo-24',
    name: 'Mrembo 24-Pack Premium Box',
    packs: 24,
    totalPads: 192,
    priceKsh: 1550,
    badge: 'Best Value',
    description: 'Ideal for complete confidence. Fully stock up and support your routines, or share premium care with a loved one.',
    imageSrc: '/bundle_24.png'
  },
  {
    id: 'mrembo-48',
    name: 'Mrembo 48-Pack Queen Bulk Box',
    packs: 48,
    totalPads: 384,
    priceKsh: 2650,
    badge: 'Super Saver',
    description: 'Maximum savings box. Excellent for salons, resellers, or large families who commit to self-care without worry.',
    imageSrc: '/bundle_48.png'
  }
];

export const BINTI_PRODUCTS = [
  {
    id: 'binti-liners-30',
    name: 'Binti Panty Liners Pack (Box of 3)',
    quantity: '3 packs (90 Liners total)',
    priceKsh: 450,
    description: 'Breathable every-day care designed with soft materials for ultimate skin safety and freshness.',
  },
  {
    id: 'binti-pads-8',
    name: 'Binti Regular Pads (10-Pack Bundle)',
    quantity: '10 packs (80 Pads total)',
    priceKsh: 750,
    description: 'Specially engineered for school girls and young women. Provides 12H leak barrier protection, soft cotton-like finish.',
  }
];

export const COMPLIANCE_CHECKLIST: ComplianceChecklistItem[] = [
  {
    id: 'comp-1',
    category: 'Legal',
    title: 'ODPC Kenya Handler Registration',
    description: 'Verify if Binti Marvels Ltd is officially registered with the Office of the Data Protection Commissioner (ODPC) as a controller/processor, as per legal volume thresholds.',
    status: 'Pending',
    actionNeeded: 'Confirm registration status with Kenyan legal counsel and update Privacy Policy.'
  },
  {
    id: 'comp-2',
    category: 'Legal',
    title: 'Substantiate Sanitary Certifications',
    description: 'Verify and document KEBS (Kenya Bureau of Standards) certifications for pads, including absorbency standards and dermatological testing parameters.',
    status: 'Pending',
    actionNeeded: 'Ensure certificate ID numbers are ready for listing if requested by supermarket buyers.'
  },
  {
    id: 'comp-3',
    category: 'Consent',
    title: 'Double-Opt-In Form Integration',
    description: 'Implement distinct, un-ticked consent checkboxes for general service orders, automated marketing, and cycle tracking/reorders.',
    status: 'Completed',
    actionNeeded: 'Verified! Consent boxes on this prototype are distinct, optional, and trackable.'
  },
  {
    id: 'comp-4',
    category: 'Consent',
    title: 'Privacy Policy & Terms Clearance',
    description: 'Pristinely construct visible links in footer. Link explicitly from checkout screens and stockist lead engines.',
    status: 'Completed',
    actionNeeded: 'Done! Footer contains fully visible links with comprehensive templates ready to launch.'
  },
  {
    id: 'comp-5',
    category: 'WhatsApp / Meta',
    title: 'Meta Business Verification',
    description: 'Submit official Binti Marvels Ltd certificates of incorporation and utilities bills. Must match the exact physical address, email, and phone listed on website.',
    status: 'Pending',
    actionNeeded: 'Align contact details on about page perfectly to business incorporation documents.'
  },
  {
    id: 'comp-6',
    category: 'WhatsApp / Meta',
    title: 'WhatsApp BSP Template Review',
    description: 'Pre-approve transactional and utility message templates. Must strictly avoid spam cues and include brand identity with passive stop keywords.',
    status: 'Pending',
    actionNeeded: 'Draft utility template formats for order booking and delivery notifications.'
  },
  {
    id: 'comp-7',
    category: 'Technical / Tracking',
    title: 'Google Analytics 4 & Meta Pixel Setup',
    description: 'Configure cookie banner triggers. Standard tracking triggers must wait until user selects Accept/Deny options unless classified as strictly functional.',
    status: 'Completed',
    actionNeeded: 'Interactive, compliant Cookie Consent Banner built directly into the prototype footer.'
  },
  {
    id: 'comp-8',
    category: 'Technical / Tracking',
    title: 'Database Order / Consent Auditing',
    description: 'Configure automated CRM webhook to store order history alongside client IP, timestamp, and precise visual version of the consent text they approved.',
    status: 'Completed',
    actionNeeded: 'Consent-capturing local state logging schema implemented inside order simulation.'
  }
];

export const IMAGE_ASSERTS: ImageAssetInfo[] = [
  {
    filename: 'mrembo-born-from-africa.jpeg',
    driveId: '1zGwPGQ9iq9yKRNOxFpF2a9MilzjZ-1HR',
    purpose: 'Creative Lifestyle Banner',
    originalName: 'MREMBO PADS BORN FROM AFRICA.jpeg',
    suggestedSection: 'Hero Header Accent / Primary Banner Section'
  },
  {
    filename: 'lorna-joyce-binti.jpeg',
    driveId: '1V_bsLR5wHkMPeGvfIRIjV5TizLBohHhk',
    purpose: 'Founder Portrait',
    originalName: 'LORNA JOYCE 1 BINTI.jpg',
    suggestedSection: 'About Section / Corporate Trust Panel'
  },
  {
    filename: 'lorna-at-warehouse-binti.jpeg',
    driveId: '1qlQcN7juYUvj1H0hD0l_y5vHfyT9abJG',
    purpose: 'Stock / Dispatch Verification',
    originalName: 'LORNA AT THE WAREHOUSE BINTI 04.jpg',
    suggestedSection: 'Stockist Enquiries / Quality Assurance Block'
  },
  {
    filename: 'lorna-binti-donation-kitui.jpeg',
    driveId: '1I2hFSf-E6ZUAw5ORPKiFucdfNvalKjod',
    purpose: 'CSR / School Program Verification',
    originalName: 'LORNA BINTI DONATION IN KITUI.jpg',
    suggestedSection: 'Binti Schools & NGO Impact Section'
  },
  {
    filename: 'mrembo-online-price.jpeg',
    driveId: '1dNIs7wGXce_APAAAkVio9CSJ0seqjBbW',
    purpose: 'Visual Price List & Pack Reference',
    originalName: 'MREMBO PADS ONLINE PRICE.jpeg',
    suggestedSection: 'Products / Store Grid Representation'
  },
  {
    filename: 'mrembo-your-cycle-your-rules.jpeg',
    driveId: '1xxqdEvOKHwVXIwQE-1cJ1q4VBe4PCjUA',
    purpose: 'Alternative Bold Modern Visual',
    originalName: 'MREMBO PADS YOUR CYCLE YOUR RULES.jpeg',
    suggestedSection: 'Binti Circles community banner'
  },
  {
    filename: 'mrembo-with-skincare.jpeg',
    driveId: '1NMuIicFDRkVhC_wAdjuL3nvbF6OPvhOh',
    purpose: 'Self-Care / Accessory Visual',
    originalName: 'MREMBO PADS WITH SKIN CARE.jpeg',
    suggestedSection: 'Functional Benefit Section / Soft Life Section'
  },
  {
    filename: 'binti-marvels-limited-logo.png',
    driveId: '1DUIzAB8-nEfNr-YylY2ODbaWK4VnpLht',
    purpose: 'Brand Core Logo Identification',
    originalName: 'BINTI MARVELS LIMITED LOGO.png',
    suggestedSection: 'Main Navigation Bar & Compliance Footer'
  },
  {
    filename: 'binti-logo.png',
    driveId: '1poixQ5NEG3_wGDwATri7O8wTFtNUYuPB',
    purpose: 'Dignity Branch Identification',
    originalName: 'BINTI LOGO PNG.png',
    suggestedSection: 'CSR Program Pages / Bulk ordering headings'
  },
  {
    filename: 'binti-product-portfolio.jpeg',
    driveId: '1WZu_aVyVx-8wZGxdhd8Ur7HJrYy78Ypg',
    purpose: 'Corporate / Supermarket Assortment',
    originalName: 'BINTI PADS PRODUCT PORTFOLIO.jpeg',
    suggestedSection: 'Corporate Enquiries / Supermarket Product Listing'
  }
];

export const DRAFT_TEMPLATES = {
  orderConfirmation: {
    title: 'Order Confirmation Utility (WhatsApp / SMS)',
    copy: 'Hi {{1}}, thank you for choosing Mrembo Pads! We have received your order for {{2}} (KSh {{3}}). A customer-care agent will contact you shortly to confirm preferred delivery coordinates. Note: Binti Marvels will never sell your contacts. To reject updates, reply STOP.',
    context: 'Triggered automatically via n8n webhook upon e-commerce submission.'
  },
  periodReminder: {
    title: 'Discreet Cycle / Reorder Reminder (SMS / WhatsApp)',
    copy: 'Hi {{1}}, we hope you are feeling radiant today! This is your discreet Mrembo cycle safety reminder. To ensure you never run short on daily comfort, your custom bundle is ready for delivery. Click here to confirm with one tap: {{2}}. Reply STOP to stop reminders.',
    context: 'Requires separate explicit consent. Scheduled based on interval data.'
  },
  marketingOffer: {
    title: 'Creative Marketing Broadcast (WhatsApp / SMS)',
    copy: 'A Mrembo queen does not pause her routines. Stay protected this season with our new Binti Premium Liners, now only KSh 150 when bought with any bundle! Grab yours: {{1}}. Repl STOP to opt out.',
    context: 'Triggered manually for campaign broadcasts. Permitted only for opted-in profiles.'
  },
  stockistReceipt: {
    title: 'Stockist / CSR Enquiry Auto-Responder (Email / SMS)',
    copy: 'Hello {{1}}, thank you for reaching out to Binti Marvels Ltd. We have received your interest in stocking/partnering for {{2}}. Our sales distribution lead will email or WhatsApp you current wholesale sheets within 4 supply hours. Let’s keep women moving!',
    context: 'Fires instantly upon lead-form submission. Logs directly to CRM.'
  }
};
