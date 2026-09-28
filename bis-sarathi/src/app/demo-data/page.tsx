// BIS Sarathi — /demo-data route
// Server component: Demo Data Transparency page
// Fully documents the demo dataset so judges and auditors can verify provenance.
//
// Three sections required by unit test 13.11:
//   "Standards" — public/source-derived standard records
//   "Laboratories" — public BIS LIMS snapshot records
//   "Verification Record" — mock verification record
//
// Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 14.1, 14.2, 14.3

import type { Metadata } from 'next'
import { standards } from '@/data/standards'
import { labs } from '@/data/labs'
import DEMO_LIC_001 from '@/data/verification'
import { evidenceRecords } from '@/data/evidence'

export const metadata: Metadata = {
  title: 'Demo Data — BIS Sarathi',
  description:
    'Full documentation of the demo dataset used in BIS Sarathi — provenance, record IDs, retrieval dates, and source types.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Section header component
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ title, count, badge }: { title: string; count: number; badge: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-xl font-semibold text-[#1B2A4A]">{title}</h2>
      <span className="text-sm font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
        {count} record{count !== 1 ? 's' : ''}
      </span>
      <span className="text-xs font-bold px-2 py-0.5 rounded border border-current uppercase tracking-wide"
        style={{ color: badgeColour(badge), borderColor: badgeColour(badge) }}>
        {badge}
      </span>
    </div>
  )
}

function badgeColour(badge: string): string {
  if (badge === 'OFFICIAL BIS' || badge === 'PUBLIC BIS LIMS') return '#15803D'
  if (badge === 'MOCK') return '#B45309'
  if (badge === 'SYNTHETIC') return '#64748B'
  return '#64748B'
}

// ─────────────────────────────────────────────────────────────────────────────
// Field row inside a record table
// ─────────────────────────────────────────────────────────────────────────────
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-1.5 pr-4 text-sm font-medium text-slate-500 whitespace-nowrap w-36 align-top">
        {label}
      </td>
      <td className="py-1.5 text-sm text-[#1A1A2E]">{value}</td>
    </tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual record card
// ─────────────────────────────────────────────────────────────────────────────
function RecordCard({
  id,
  borderColour,
  children,
}: {
  id: string
  borderColour: string
  children: React.ReactNode
}) {
  return (
    <article
      className="bg-white rounded-lg border border-slate-200 p-4 mb-3"
      style={{ borderLeftWidth: '4px', borderLeftColor: borderColour }}
    >
      <p className="text-xs font-mono text-slate-400 mb-2">{id}</p>
      <table className="w-full">{children}</table>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Synthetic records derived from evidenceRecords (for completeness transparency)
// ─────────────────────────────────────────────────────────────────────────────
const syntheticRecords = evidenceRecords.filter((r) => r.sourceType === 'SYNTHETIC')

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DemoDataPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-2">Demo Dataset Inventory</h1>
        <p className="text-[#64748B] text-base">
          Full documentation of every record used in this BIS Sarathi demonstration.
        </p>
      </header>

      {/* Transparency note */}
      <div
        className="rounded-lg border border-amber-300 bg-amber-50 p-4 mb-10"
        role="note"
        aria-label="Transparency notice"
      >
        <p className="text-sm font-semibold text-amber-800 mb-1">
          ⚠ Transparency Notice
        </p>
        <p className="text-sm text-amber-700">
          This page lists every record the application uses. All official and LIMS records are
          public-source snapshots retrieved from{' '}
          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
            aria-label="bis.gov.in (opens in new tab)"
          >
            bis.gov.in
          </a>{' '}
          on <strong>28 Sep 2026</strong>. Mock records are used only to demonstrate
          interaction flows where live authorised BIS integration is unavailable. Synthetic
          records exist solely for pipeline and rendering validation — they are not real BIS
          records.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: Standards                                                  */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="section-standards">
        <SectionHeader
          title="Standards"
          count={standards.length}
          badge="OFFICIAL BIS"
        />
        <p id="section-standards" className="sr-only">Standards section</p>
        <p className="text-sm text-slate-500 mb-4">
          Public-source snapshots from the BIS Official Standards Catalogue (bis.gov.in).
          Retrieved <strong>28 Sep 2026</strong>. These records are the foundation for all
          standards discovery responses in the demo.
        </p>

        {standards.map((std) => (
          <RecordCard key={std.id} id={std.id} borderColour="#15803D">
            <tbody>
              <FieldRow label="Standard No." value={std.standardNumber} />
              <FieldRow label="Title" value={std.title} />
              <FieldRow label="Year" value={String(std.year)} />
              <FieldRow label="Revision" value={std.revision} />
              <FieldRow label="Scheme" value={std.certificationScheme} />
              <FieldRow label="Source type" value={std.sourceType} />
              <FieldRow label="Authority" value={std.authority} />
              <FieldRow label="Retrieved" value={std.retrievedAt} />
              {std.supersedes && (
                <FieldRow label="Supersedes" value={std.supersedes} />
              )}
              <FieldRow label="Official URL" value={std.sourceUrl} />
            </tbody>
          </RecordCard>
        ))}
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: Laboratories                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="section-labs">
        <SectionHeader
          title="Laboratories"
          count={labs.length}
          badge="PUBLIC BIS LIMS"
        />
        <p id="section-labs" className="sr-only">Laboratories section</p>
        <p className="text-sm text-slate-500 mb-4">
          Public BIS LIMS snapshot records sourced from the BIS Laboratory Information
          Management System. Snapshot date: <strong>28 Sep 2026</strong>. Verify current
          laboratory status on BIS LIMS before booking or testing.
        </p>

        {labs.map((lab) => (
          <RecordCard key={lab.id} id={lab.id} borderColour="#1D4ED8">
            <tbody>
              <FieldRow label="Lab name" value={lab.labName} />
              <FieldRow label="City" value={lab.city} />
              <FieldRow label="State" value={lab.state} />
              <FieldRow label="Standards" value={lab.standardNumbers.join(', ')} />
              <FieldRow label="Scope" value={lab.scopeCategory} />
              <FieldRow label="Source type" value={lab.sourceType} />
              <FieldRow label="Retrieved" value={lab.retrievedAt} />
              {lab.validityDate && (
                <FieldRow label="Validity" value={lab.validityDate} />
              )}
              <FieldRow label="Snapshot" value={lab.snapshotLabel} />
              <FieldRow label="Official URL" value={lab.sourceUrl} />
            </tbody>
          </RecordCard>
        ))}
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: Verification Record                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="section-verification">
        <SectionHeader
          title="Verification Record"
          count={1}
          badge="MOCK"
        />
        <p id="section-verification" className="sr-only">Verification Record section</p>
        <p className="text-sm text-slate-500 mb-4">
          Mock records used only to demonstrate interaction flows where live authorised BIS
          integration is unavailable. These records are entirely fictional and must not be
          mistaken for authoritative BIS certification data.
        </p>

        <RecordCard
          id={DEMO_LIC_001.licenceId}
          borderColour="#B45309"
        >
          <tbody>
            <FieldRow label="Licence ID" value={DEMO_LIC_001.licenceId} />
            <FieldRow label="Status" value={DEMO_LIC_001.status} />
            <FieldRow label="Product" value={DEMO_LIC_001.productDescription} />
            <FieldRow label="Manufacturer" value={DEMO_LIC_001.manufacturer} />
            <FieldRow label="Standard" value={DEMO_LIC_001.standard} />
            <FieldRow label="Issued" value={DEMO_LIC_001.issuedDate} />
            <FieldRow label="Expires" value={DEMO_LIC_001.expiryDate} />
            <FieldRow label="Source type" value={DEMO_LIC_001.sourceType} />
            <FieldRow label="Retrieved" value={DEMO_LIC_001.retrievedAt} />
          </tbody>
        </RecordCard>

        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 mt-2">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
            Mock record disclaimer
          </p>
          <p className="text-xs text-amber-700">
            {DEMO_LIC_001.warningText}
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* SYNTHETIC records (supplementary — not a primary section heading)     */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      {syntheticRecords.length > 0 && (
        <section className="mb-10" aria-labelledby="section-synthetic">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-[#1B2A4A]" id="section-synthetic">
              Synthetic Test Records
            </h2>
            <span className="text-sm font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {syntheticRecords.length} record{syntheticRecords.length !== 1 ? 's' : ''}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded border border-current uppercase tracking-wide"
              style={{ color: '#64748B', borderColor: '#64748B' }}
            >
              SYNTHETIC — TEST ONLY
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Artificially constructed records that exist solely to validate rendering pipelines
            and source-type filters. They do not represent any real BIS standard, laboratory,
            or certification.
          </p>

          {syntheticRecords.map((rec) => (
            <RecordCard key={rec.id} id={rec.id} borderColour="#64748B">
              <tbody>
                <FieldRow label="Record" value={rec.standardOrRecord} />
                <FieldRow label="Record type" value={rec.recordType} />
                <FieldRow label="Source type" value={rec.sourceType} />
                <FieldRow label="Authority" value={rec.authority} />
                <FieldRow label="Retrieved" value={rec.retrievedAt} />
                <FieldRow label="Why used" value={rec.whyUsed} />
              </tbody>
            </RecordCard>
          ))}
        </section>
      )}

      {/* Dataset summary footer */}
      <footer className="border-t border-slate-200 pt-6 mt-4">
        <p className="text-xs text-slate-400">
          Dataset summary — {standards.length} standard record
          {standards.length !== 1 ? 's' : ''},{' '}
          {labs.length} laboratory record{labs.length !== 1 ? 's' : ''}, 1 mock
          verification record, {syntheticRecords.length} synthetic test record
          {syntheticRecords.length !== 1 ? 's' : ''}. All official and LIMS records
          retrieved 28 Sep 2026. Not connected to BIS production systems.
        </p>
      </footer>
    </div>
  )
}
