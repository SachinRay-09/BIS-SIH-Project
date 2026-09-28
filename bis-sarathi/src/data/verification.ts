// BIS Sarathi — Seeded verification data
// This is a MOCK/DEMO record only — not connected to BIS production systems.
// Retrieved: 28 Sep 2026

export type { SourceType, VerificationRecord } from '../lib/types'
import type { SourceType, VerificationRecord } from '../lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// DEMO-LIC-001 — Mock/Sample verification record for demonstration only
// This record is entirely fictional and exists solely to illustrate the
// licence verification workflow in the BIS Sarathi demo.
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_LIC_001: VerificationRecord = {
  licenceId: 'DEMO-LIC-001',
  status: 'Sample/Mock',
  productDescription: 'Packaged Drinking Water (500ml PET bottle)',
  manufacturer: 'Demo Beverages Pvt. Ltd. (Sample Record)',
  standard: 'IS 14543',
  issuedDate: '15 Mar 2023',
  expiryDate: '14 Mar 2025',
  sourceType: 'MOCK',
  isDemoRecord: true,
  warningText:
    'THIS IS A MOCK DEMONSTRATION RECORD ONLY. ' +
    'It does not represent a real BIS licence, a real manufacturer, or a real product. ' +
    'This record is not sourced from, and is not connected to, the BIS production licence registry or any official BIS system. ' +
    'Do not use this information for any compliance, legal, or purchasing decision. ' +
    'To verify a real ISI licence, visit the official BIS portal at https://www.bis.gov.in.',
  retrievedAt: '28 Sep 2026',
} as const

export default DEMO_LIC_001
