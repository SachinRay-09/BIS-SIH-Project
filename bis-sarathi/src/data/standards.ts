// BIS Sarathi — Seeded standards data
// Source: Bureau of Indian Standards (BIS) official catalogue
// All records are public-source snapshots retrieved from bis.gov.in
// Retrieved: 28 Sep 2026

export type { SourceType, BISStandard } from '../lib/types'
import type { SourceType, BISStandard } from '../lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// IS 14543:2024 — Current revision
// Packaged Drinking Water (other than Packaged Natural Mineral Water)
// Mandatory certification under the Compulsory Registration Scheme (CRS)
// ─────────────────────────────────────────────────────────────────────────────
export const IS_14543_2024: BISStandard = {
  id: 'IS-14543-2024',
  standardNumber: 'IS 14543',
  title: 'Packaged Drinking Water (other than Packaged Natural Mineral Water)',
  year: 2024,
  supersedes: 'IS-14543-2016',
  scope:
    'This standard specifies requirements for packaged drinking water, being water other than packaged natural mineral water, intended for direct human consumption. ' +
    'It covers the physico-chemical, microbiological, and general quality requirements, as well as packaging, labelling, and marking requirements for all containers. ' +
    'The standard applies to water that may be treated by processes such as filtration, reverse osmosis, UV treatment, ozonation, or a combination thereof, before packaging.',
  applicableProducts: [
    'Packaged drinking water (bottles, jars, pouches)',
    'Treated and packaged water for direct consumption',
    'Bulk packaged water for dispensers',
  ],
  certificationScheme: 'CRS',
  sourceUrl: 'https://www.bis.gov.in/index.php/standards/bis-catalogue/?category=WRD&number=14543',
  sourceType: 'OFFICIAL_BIS',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  revision: '2024 (4th Revision)',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// IS 14543:2016 — Earlier revision (superseded by 2024 edition)
// Packaged Drinking Water (other than Packaged Natural Mineral Water)
// ─────────────────────────────────────────────────────────────────────────────
export const IS_14543_2016: BISStandard = {
  id: 'IS-14543-2016',
  standardNumber: 'IS 14543',
  title: 'Packaged Drinking Water (other than Packaged Natural Mineral Water)',
  year: 2016,
  scope:
    'This standard specifies requirements for packaged drinking water other than packaged natural mineral water, intended for sale for direct human consumption. ' +
    'It covers physical, chemical, and bacteriological requirements for the water, together with requirements for containers, closures, labelling, and marking. ' +
    'The standard applies to water packaged in sealed containers of various types and sizes after appropriate treatment.',
  applicableProducts: [
    'Packaged drinking water (bottles, jars, pouches)',
    'Treated and packaged water for direct consumption',
  ],
  certificationScheme: 'CRS',
  sourceUrl: 'https://www.bis.gov.in/index.php/standards/bis-catalogue/?category=WRD&number=14543',
  sourceType: 'OFFICIAL_BIS',
  retrievedAt: '28 Sep 2026',
  authority: 'BIS',
  revision: '2016 (3rd Revision)',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Exported standards catalogue for IS 14543
// ─────────────────────────────────────────────────────────────────────────────
export const standards: BISStandard[] = [IS_14543_2024, IS_14543_2016]

export default standards
