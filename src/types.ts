/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MremboProduct {
  id: string;
  name: string;
  packs: number; // e.g. 6 packs, 12 packs
  totalPads: number; // packs * 8 pads
  priceKsh: number;
  badge?: string;
  description: string;
  isPopular?: boolean;
  imageSrc: string;
}

export interface ComplianceChecklistItem {
  id: string;
  category: 'Legal' | 'Consent' | 'WhatsApp / Meta' | 'Technical / Tracking';
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  actionNeeded: string;
}

export interface ImageAssetInfo {
  filename: string;
  driveId: string;
  purpose: string;
  originalName: string;
  suggestedSection: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  actionRequired?: boolean;
}

export interface StockistLead {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
  role: 'supermarket' | 'pharmacy' | 'salon' | 'minimart' | 'reseller' | 'csr_ngo';
  volume: string;
  consentMarketing: boolean;
  timestamp: string;
}

export interface CSREnquiry {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  county: string;
  qtyPacks: number;
  intendedImpact: string;
  consentContact: boolean;
}
