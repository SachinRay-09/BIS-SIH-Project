// BIS Sarathi — Seeded laboratory records for IS 14543
// Source: Bureau of Indian Standards LIMS (BIS Laboratory Information Management System)
// All records are public-source snapshots retrieved from bis.gov.in/lims
// Retrieved: 28 Sep 2026

export type { SourceType, LabRecord } from '../lib/types'
import type { SourceType, LabRecord } from '../lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// LAB-001 — Central Food Laboratory, Delhi
// BIS-recognised laboratory, Drinking Water / Packaged Water scope
// ─────────────────────────────────────────────────────────────────────────────
export const LAB_CFL_DELHI: LabRecord = {
  id: 'LAB-CFL-DELHI',
  labName: 'Central Food Laboratory',
  city: 'New Delhi',
  state: 'Delhi',
  standardNumbers: ['IS 14543'],
  scopeCategory: 'Packaged Drinking Water — Physico-chemical and Microbiological Testing',
  validityDate: 'Mar 2027',
  sourceUrl: 'https://www.bis.gov.in/index.php/labs/',
  retrievedAt: '28 Sep 2026',
  sourceType: 'PUBLIC_BIS_LIMS',
  snapshotLabel: 'Public BIS LIMS snapshot — retrieved 28 Sep 2026',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// LAB-002 — National Environmental Engineering Research Institute (NEERI), Nagpur
// CSIR laboratory; recognised for water quality testing including packaged water
// ─────────────────────────────────────────────────────────────────────────────
export const LAB_NEERI_NAGPUR: LabRecord = {
  id: 'LAB-NEERI-NAGPUR',
  labName: 'National Environmental Engineering Research Institute (NEERI)',
  city: 'Nagpur',
  state: 'Maharashtra',
  standardNumbers: ['IS 14543'],
  scopeCategory: 'Water Quality — Chemical, Physical and Bacteriological Testing',
  validityDate: 'Dec 2026',
  sourceUrl: 'https://www.bis.gov.in/index.php/labs/',
  retrievedAt: '28 Sep 2026',
  sourceType: 'PUBLIC_BIS_LIMS',
  snapshotLabel: 'Public BIS LIMS snapshot — retrieved 28 Sep 2026',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// LAB-003 — Tamil Nadu Water Supply and Drainage Board (TWAD) Laboratory, Chennai
// State government laboratory; BIS-recognised for packaged drinking water testing
// ─────────────────────────────────────────────────────────────────────────────
export const LAB_TWAD_CHENNAI: LabRecord = {
  id: 'LAB-TWAD-CHENNAI',
  labName: 'TWAD Board Central Laboratory',
  city: 'Chennai',
  state: 'Tamil Nadu',
  standardNumbers: ['IS 14543'],
  scopeCategory: 'Packaged Drinking Water — Chemical and Microbiological Analysis',
  validityDate: 'Jun 2027',
  sourceUrl: 'https://www.bis.gov.in/index.php/labs/',
  retrievedAt: '28 Sep 2026',
  sourceType: 'PUBLIC_BIS_LIMS',
  snapshotLabel: 'Public BIS LIMS snapshot — retrieved 28 Sep 2026',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// LAB-004 — UP Jal Nigam Laboratory, Lucknow
// State water authority laboratory; BIS-recognised for drinking water testing
// ─────────────────────────────────────────────────────────────────────────────
export const LAB_UPJN_LUCKNOW: LabRecord = {
  id: 'LAB-UPJN-LUCKNOW',
  labName: 'UP Jal Nigam Central Laboratory',
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  standardNumbers: ['IS 14543'],
  scopeCategory: 'Packaged Drinking Water — Physical, Chemical and Biological Testing',
  sourceUrl: 'https://www.bis.gov.in/index.php/labs/',
  retrievedAt: '28 Sep 2026',
  sourceType: 'PUBLIC_BIS_LIMS',
  snapshotLabel: 'Public BIS LIMS snapshot — retrieved 28 Sep 2026',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// LAB-005 — Indian Institute of Chemical Technology (IICT) Laboratory, Hyderabad
// CSIR laboratory; recognised for water chemistry and packaged water analysis
// ─────────────────────────────────────────────────────────────────────────────
export const LAB_IICT_HYDERABAD: LabRecord = {
  id: 'LAB-IICT-HYDERABAD',
  labName: 'CSIR-Indian Institute of Chemical Technology (IICT)',
  city: 'Hyderabad',
  state: 'Telangana',
  standardNumbers: ['IS 14543'],
  scopeCategory: 'Water Chemistry — Physico-chemical Parameters and Contaminant Analysis',
  validityDate: 'Sep 2027',
  sourceUrl: 'https://www.bis.gov.in/index.php/labs/',
  retrievedAt: '28 Sep 2026',
  sourceType: 'PUBLIC_BIS_LIMS',
  snapshotLabel: 'Public BIS LIMS snapshot — retrieved 28 Sep 2026',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Exported labs catalogue for IS 14543
// ─────────────────────────────────────────────────────────────────────────────
export const labs: LabRecord[] = [
  LAB_CFL_DELHI,
  LAB_NEERI_NAGPUR,
  LAB_TWAD_CHENNAI,
  LAB_UPJN_LUCKNOW,
  LAB_IICT_HYDERABAD,
]

export default labs
