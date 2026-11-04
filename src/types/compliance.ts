export type ComplianceStatus = 'not_started' | 'in_progress' | 'completed' | 'not_applicable';

export interface ChecklistItem {
  id: string;
  sectionId: 'A' | 'B' | 'C' | 'clerk_packet' | 'go_no_go' | 'payroll_controls';
  sectionTitle: string;
  title: string;
  description: string;
  sourceKeys: string[]; // e.g. ["S1", "S3"]
  pdfPage: number;
  status: ComplianceStatus;
  owner?: string;
  dueDate?: string;
  notes?: string;
  evidenceUrl?: string;
}

export interface StatutoryDeadline {
  id: string;
  title: string;
  dateStr: string; // YYYY-MM-DD
  program: 'FAMLI' | 'SDAT' | 'Clerk Licenses' | 'Taxes' | 'Custom';
  description: string;
  isUrgent?: boolean;
  sourceKey?: string;
  pdfPage?: number;
  isCustom?: boolean;
  completed?: boolean;
}

export interface GovernmentPortal {
  id: string;
  sourceKey: string;
  title: string;
  agency: string;
  category: 'Registration & Formation' | 'Taxes & Payroll' | 'Licensing & Permits' | 'Insurance & Labor' | 'Annual Filings';
  url: string;
  description: string;
  requiredFor: string;
  pdfPage: number;
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  operatingAddress: string;
  countyOrCity: string;
  targetOpeningDate: string;
  complianceLead: string;
  hasRetailInventory: boolean;
  inventoryValuation: number;
  employeeCount: number;
  estimatedQuarterlyWages: number;
  sdatId?: string;
  ein?: string;
  salesTaxAccount?: string;
}

export interface CountyInfo {
  name: string;
  isCity?: boolean;
  circuitCourtName: string;
  clerkAddress: string;
  phone: string;
  website: string;
  notes?: string;
}
