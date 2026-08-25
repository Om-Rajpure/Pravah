import React, { useState, useEffect } from 'react'
import { ShieldCheck, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Database } from 'lucide-react'
import { getPrivacyPolicy, getDataCatalog } from '../../services/visitorService'

function Toggle({ label, sublabel, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {sublabel && <p className="text-[11px] text-text-secondary mt-0.5">{sublabel}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-label={`Toggle ${label}`}
        className="flex-shrink-0 mt-0.5"
      >
        {value
          ? <ToggleRight className="w-7 h-7 text-low" />
          : <ToggleLeft className="w-7 h-7 text-text-muted" />
        }
      </button>
    </div>
  )
}

export default function VisitorPrivacy() {
  const [policy, setPolicy] = useState(null)
  const [catalog, setCatalog] = useState(null)
  const [showCatalog, setShowCatalog] = useState(false)
  const [locationOn, setLocationOn] = useState(false)
  const [personalizedOn, setPersonalizedOn] = useState(false)

  useEffect(() => {
    Promise.all([getPrivacyPolicy(), getDataCatalog()])
      .then(([p, c]) => { setPolicy(p); setCatalog(c) })
      .catch(console.error)
  }, [])

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto w-full pt-2 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 rounded-card-sm bg-terracotta/10 text-terracotta flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Privacy Center</p>
          <h1 className="text-lg font-bold text-text-primary">Your Privacy</h1>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-surface border border-border rounded-card p-4">
        <p className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider mb-1">Settings</p>
        <Toggle
          label="Approximate Location"
          sublabel="Enables nearby recommendations. Uses neighbourhood-level area only."
          value={locationOn}
          onChange={setLocationOn}
        />
        <Toggle
          label="Personalised Suggestions"
          sublabel="Adjusts recommendations for this session only. Not stored."
          value={personalizedOn}
          onChange={setPersonalizedOn}
        />
        <div className="pt-3 text-xs text-text-muted">
          <strong className="text-text-secondary">Data usage:</strong> Aggregated crowd conditions only ·
          <strong className="text-text-secondary"> History:</strong> Not stored
        </div>
      </div>

      {/* What We Use / Don't Use */}
      {policy && (
        <div className="bg-surface border border-border rounded-card p-4 space-y-4">
          <div>
            <p className="text-[10.5px] uppercase font-bold text-low tracking-wider mb-2">What PRAVAAH Uses</p>
            <ul className="space-y-1.5">
              {policy.we_use.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="text-low font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10.5px] uppercase font-bold text-critical tracking-wider mb-2">What PRAVAAH Does Not Need</p>
            <ul className="space-y-1.5">
              {policy.we_do_not_use.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="text-critical font-bold mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-text-secondary border-t border-border pt-3">
            <strong>Why?</strong> {policy.why}
          </p>
        </div>
      )}

      {/* How Aggregation Works */}
      {policy && (
        <div className="bg-surface-muted/50 border border-border rounded-card p-4 space-y-2 text-xs text-text-secondary">
          <p className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider">How Crowd Data Works</p>
          <p>{policy.small_group_note}</p>
          <p>{policy.synthetic_note}</p>
          <p className="text-[10.5px] italic text-text-muted">{policy.prototype_disclaimer}</p>
        </div>
      )}

      {/* Data Governance Catalog (Expandable) */}
      {catalog && (
        <div className="bg-surface border border-border rounded-card overflow-hidden">
          <button
            onClick={() => setShowCatalog(!showCatalog)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate" />
              <span>Data Governance Catalog</span>
            </div>
            {showCatalog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCatalog && (
            <div className="border-t border-border overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-surface-muted/60">
                  <tr>
                    {['Data Type', 'Purpose', 'Granularity', 'Retention', 'Public?'].map(h => (
                      <th key={h} className="px-3 py-2 font-bold text-text-muted uppercase text-[9.5px] tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {catalog.catalog.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-muted/30">
                      <td className="px-3 py-2 font-semibold text-text-primary whitespace-nowrap">{row.data_type}</td>
                      <td className="px-3 py-2 text-text-secondary">{row.purpose}</td>
                      <td className="px-3 py-2 text-text-secondary whitespace-nowrap">{row.granularity}</td>
                      <td className="px-3 py-2 text-text-secondary whitespace-nowrap">{row.retention}</td>
                      <td className="px-3 py-2">
                        <span className={`font-bold ${row.public ? 'text-low' : 'text-text-muted'}`}>
                          {row.public ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Retention Config */}
              <div className="px-4 py-3 bg-surface-muted/30 border-t border-border text-[10.5px] text-text-muted space-y-0.5">
                <p><strong>Raw event retention:</strong> {catalog.retention.raw_event_minutes} minutes</p>
                <p><strong>Aggregate retention:</strong> {catalog.retention.aggregate_retention_hours} hours</p>
                <p><strong>Visitor session:</strong> {catalog.retention.visitor_session_minutes} minutes</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
