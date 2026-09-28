// BIS Sarathi — Canonical evidence record catalogue
// This is the single source of truth for all evidence records shown across the
// application (Evidence page, EvidenceCard components, PromptResponse payloads).
//
// Source types present in this file:
//   OFFICIAL_BIS   — public-source snapshots from bis.gov.in
//   PUBLIC_BIS_LIMS — public-source snapshots from the BIS LIMS portal
//   MOCK           — demo/sample records; not connected to BIS production systems
//   SYNTHETIC      — artificially constructed test record; not a real BIS record
//
// All records carry retrievedAt: "28 Sep 2026"
// Requirements: 14.1, 11.2

import type { EvidenceRecord } from '../lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL BIS STANDARD RECORDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EVD-STD-001 — IS 14543:2024 (Current revision)
 * Packaged Drinking Water — 4th Revision
 * Source: BIS Official Catalogue (bis.gov.in)
 */
const EVD_STD_IS14543_2024: EvidenceRecord = {
  id: 'EVD-STD-IS14543-2024',
  source: 'BIS Official Standards Catalogue (bis.gov.in)',
  standardOrRecord: 'IS 14543:2024',
  recordType: 'Standard',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: '2024 (4th Revision)',
  whyUsed:
    'This is the current, in-force revision of IS 14543 for Packaged Drinking Water. ' +
    'It is the primary standard surfaced in response to any query about packaged or bottled drinking water. ' +
    'Mandatory under the Compulsory Registration Scheme (CRS) for manufacturers seeking the ISI mark.',
  officialUrl:
    'https://www.bis.gov.in/index.php/standards/bis-catalogue/?category=WRD&number=14543',
  sourceType: 'OFFICIAL_BIS',
}

/**
 * EVD-STD-002 — IS 14543:2016 (Earlier revision — superseded)
 * Packaged Drinking Water — 3rd Revision
 * Source: BIS Official Catalogue (bis.gov.in)
 */
const EVD_STD_IS14543_2016: EvidenceRecord = {
  id: 'EVD-STD-IS14543-2016',
  source: 'BIS Official Standards Catalogue (bis.gov.in)',
  standardOrRecord: 'IS 14543:2016',
  recordType: 'Standard',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: '2016 (3rd Revision) — superseded by 2024 edition',
  whyUsed:
    'Included as the immediately preceding revision of IS 14543. ' +
    'Surfaced alongside the 2024 record to demonstrate version-awareness — ' +
    'products tested against the 2016 edition may require re-testing under the 2024 revision. ' +
    'Shown to industry users navigating certification lifecycle questions.',
  officialUrl:
    'https://www.bis.gov.in/index.php/standards/bis-catalogue/?category=WRD&number=14543',
  sourceType: 'OFFICIAL_BIS',
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC BIS LIMS — LAB RECORDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EVD-LAB-001 — Central Food Laboratory, New Delhi
 * BIS LIMS snapshot; IS 14543 in scope
 */
const EVD_LAB_CFL_DELHI: EvidenceRecord = {
  id: 'EVD-LAB-CFL-DELHI',
  source: 'BIS Laboratory Information Management System (BIS LIMS)',
  standardOrRecord: 'LAB-CFL-DELHI',
  recordType: 'Lab Record',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: 'Public BIS LIMS snapshot — 28 Sep 2026',
  whyUsed:
    'Central Food Laboratory, New Delhi is listed in the BIS LIMS as a recognised testing facility ' +
    'for IS 14543 (Packaged Drinking Water). Surfaced when users ask which laboratories can test ' +
    'packaged drinking water products for BIS certification.',
  officialUrl: 'https://www.bis.gov.in/index.php/labs/',
  sourceType: 'PUBLIC_BIS_LIMS',
}

/**
 * EVD-LAB-002 — NEERI, Nagpur
 * BIS LIMS snapshot; IS 14543 in scope
 */
const EVD_LAB_NEERI_NAGPUR: EvidenceRecord = {
  id: 'EVD-LAB-NEERI-NAGPUR',
  source: 'BIS Laboratory Information Management System (BIS LIMS)',
  standardOrRecord: 'LAB-NEERI-NAGPUR',
  recordType: 'Lab Record',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: 'Public BIS LIMS snapshot — 28 Sep 2026',
  whyUsed:
    'CSIR-National Environmental Engineering Research Institute (NEERI), Nagpur is recognised in the ' +
    'BIS LIMS for water quality testing under IS 14543. Surfaced in the laboratory discovery journey ' +
    'to give industry users a geographically diverse set of accredited testing options.',
  officialUrl: 'https://www.bis.gov.in/index.php/labs/',
  sourceType: 'PUBLIC_BIS_LIMS',
}

/**
 * EVD-LAB-003 — TWAD Board Central Laboratory, Chennai
 * BIS LIMS snapshot; IS 14543 in scope
 */
const EVD_LAB_TWAD_CHENNAI: EvidenceRecord = {
  id: 'EVD-LAB-TWAD-CHENNAI',
  source: 'BIS Laboratory Information Management System (BIS LIMS)',
  standardOrRecord: 'LAB-TWAD-CHENNAI',
  recordType: 'Lab Record',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: 'Public BIS LIMS snapshot — 28 Sep 2026',
  whyUsed:
    'Tamil Nadu Water Supply and Drainage (TWAD) Board Central Laboratory, Chennai is listed in ' +
    'BIS LIMS for IS 14543 testing. Included to demonstrate south India laboratory availability, ' +
    'helping manufacturers and MSMEs in Tamil Nadu and nearby states identify a local testing option.',
  officialUrl: 'https://www.bis.gov.in/index.php/labs/',
  sourceType: 'PUBLIC_BIS_LIMS',
}

/**
 * EVD-LAB-004 — UP Jal Nigam Central Laboratory, Lucknow
 * BIS LIMS snapshot; IS 14543 in scope
 */
const EVD_LAB_UPJN_LUCKNOW: EvidenceRecord = {
  id: 'EVD-LAB-UPJN-LUCKNOW',
  source: 'BIS Laboratory Information Management System (BIS LIMS)',
  standardOrRecord: 'LAB-UPJN-LUCKNOW',
  recordType: 'Lab Record',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: 'Public BIS LIMS snapshot — 28 Sep 2026',
  whyUsed:
    'UP Jal Nigam Central Laboratory, Lucknow is included to represent north India laboratory ' +
    'coverage for IS 14543. Useful for manufacturers and MSMEs in Uttar Pradesh and neighbouring ' +
    'states seeking a locally accessible testing facility for packaged drinking water certification.',
  officialUrl: 'https://www.bis.gov.in/index.php/labs/',
  sourceType: 'PUBLIC_BIS_LIMS',
}

/**
 * EVD-LAB-005 — CSIR-IICT Laboratory, Hyderabad
 * BIS LIMS snapshot; IS 14543 in scope
 */
const EVD_LAB_IICT_HYDERABAD: EvidenceRecord = {
  id: 'EVD-LAB-IICT-HYDERABAD',
  source: 'BIS Laboratory Information Management System (BIS LIMS)',
  standardOrRecord: 'LAB-IICT-HYDERABAD',
  recordType: 'Lab Record',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  versionOrRevision: 'Public BIS LIMS snapshot — 28 Sep 2026',
  whyUsed:
    'CSIR-Indian Institute of Chemical Technology (IICT), Hyderabad is recognised in BIS LIMS ' +
    'for water chemistry and IS 14543 testing. Provides manufacturers in Telangana and Andhra Pradesh ' +
    'with a high-capability CSIR laboratory option, complementing NEERI for southern India coverage.',
  officialUrl: 'https://www.bis.gov.in/index.php/labs/',
  sourceType: 'PUBLIC_BIS_LIMS',
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK VERIFICATION RECORD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EVD-MOCK-001 — DEMO-LIC-001 mock verification record
 * This is entirely fictional — included solely to demonstrate the licence
 * verification workflow. Not connected to BIS production systems.
 */
const EVD_MOCK_DEMO_LIC_001: EvidenceRecord = {
  id: 'EVD-MOCK-DEMO-LIC-001',
  source: 'Demo Verification Record (Mock — not BIS production)',
  standardOrRecord: 'DEMO-LIC-001',
  recordType: 'Verification Record',
  retrievedAt: '28 Sep 2026',
  authority: 'N/A — Demo record only',
  versionOrRevision: 'Mock/Sample — not a real licence',
  whyUsed:
    'DEMO-LIC-001 is a fictitious licence record created solely to demonstrate the BIS Sarathi ' +
    'verification workflow. It illustrates how the system would handle a licence verification query, ' +
    'including the mandatory disclaimers that distinguish demo output from authoritative BIS registry data. ' +
    'This record must never be interpreted as a real BIS certification.',
  officialUrl: 'https://www.bis.gov.in/index.php/about-bis/isi-certification/',
  sourceType: 'MOCK',
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNTHETIC TEST RECORD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EVD-SYN-001 — Synthetic test record for IS 14543 pipeline validation
 * Artificially constructed to exercise edge-case rendering in EvidenceCard
 * and to verify the Evidence page source-type filter correctly segregates
 * SYNTHETIC records from official BIS data.
 */
const EVD_SYN_IS14543_TEST: EvidenceRecord = {
  id: 'EVD-SYN-IS14543-TEST',
  source: 'Synthetic Test Record (not a real BIS record)',
  standardOrRecord: 'SYN-IS14543-TEST',
  recordType: 'Synthetic Test Record',
  retrievedAt: '28 Sep 2026',
  authority: 'N/A — Synthetic record',
  versionOrRevision: 'Synthetic — created for demo pipeline testing',
  whyUsed:
    'This record is an artificially constructed entry used to validate that the Evidence page, ' +
    'EvidenceCard component, and source-type filters correctly handle SYNTHETIC records. ' +
    'It also confirms that the visual treatment (grey border, grey badge) for SYNTHETIC records ' +
    'is visually distinct from OFFICIAL_BIS (green) and PUBLIC_BIS_LIMS (blue) records. ' +
    'It does not represent any real BIS standard, laboratory, or certification.',
  officialUrl: 'https://www.bis.gov.in',
  sourceType: 'SYNTHETIC',
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical evidence record array — exported for use across the application
// ─────────────────────────────────────────────────────────────────────────────

export const evidenceRecords: EvidenceRecord[] = [
  // Official BIS standards (OFFICIAL_BIS)
  EVD_STD_IS14543_2024,
  EVD_STD_IS14543_2016,
  // BIS LIMS lab snapshot records (PUBLIC_BIS_LIMS)
  EVD_LAB_CFL_DELHI,
  EVD_LAB_NEERI_NAGPUR,
  EVD_LAB_TWAD_CHENNAI,
  EVD_LAB_UPJN_LUCKNOW,
  EVD_LAB_IICT_HYDERABAD,
  // Mock demonstration record (MOCK)
  EVD_MOCK_DEMO_LIC_001,
  // Synthetic test record (SYNTHETIC)
  EVD_SYN_IS14543_TEST,
]

/**
 * Look up a single evidence record by its id.
 * Returns undefined if no record matches.
 */
export function getEvidenceById(id: string): EvidenceRecord | undefined {
  return evidenceRecords.find((r) => r.id === id)
}

export default evidenceRecords
