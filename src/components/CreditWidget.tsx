'use client'

import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

const C = {
  bg: '#B7C3A5',
  card: '#DDE5D4',
  cardAlt: '#CDD8C2',
  accent: '#6E8A63',
  text: '#364033',
  muted: '#5A6E55',
  mutedLight: '#7A9175',
  progressEmpty: '#C4D0B5',
  divider: '#A3B390',
}

interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
}

function StatRow({
  label,
  earned,
  required,
  highlight = false,
}: {
  label: string
  earned: number | string
  required?: number
  highlight?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '7px 0',
        borderBottom: `1px solid ${C.divider}`,
      }}
    >
      <span
        style={{
          fontSize: '11px',
          color: highlight ? C.accent : C.muted,
          fontWeight: highlight ? 700 : 500,
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: '"DM Mono", "Courier New", monospace',
          fontSize: highlight ? '14px' : '13px',
          fontWeight: 700,
          color: highlight ? C.accent : C.text,
        }}
      >
        {earned}
        {required !== undefined && (
          <span style={{ fontSize: '10px', color: C.mutedLight, fontWeight: 400 }}>
            &nbsp;/&nbsp;{required}
          </span>
        )}
      </span>
    </div>
  )
}

export default function CreditWidget({ summary, title = 'Credit Buddy', updatedAt }: Props) {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } =
    summary

  const pct = Math.min(progressRate, 100)

  return (
    <div
      style={{
        background: C.bg,
        borderRadius: '12px',
        padding: '20px',
        width: '100%',
        maxWidth: '300px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: C.mutedLight,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: '11px', color: C.muted }}>
          {getStatusMessage(remainingCredits)}
        </div>
      </div>

      {/* ── Progress Card ── */}
      <div
        style={{
          background: C.card,
          borderRadius: '8px',
          padding: '14px 16px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontFamily: '"DM Mono", "Courier New", monospace',
              fontSize: '32px',
              fontWeight: 700,
              color: C.accent,
              lineHeight: 1,
            }}
          >
            {pct}%
          </span>
          <span
            style={{
              fontSize: '9px',
              color: C.mutedLight,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            graduation
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '6px',
            background: C.progressEmpty,
            borderRadius: '99px',
            overflow: 'hidden',
          }}
        >
          <div
            className="progress-fill"
            style={
              {
                height: '100%',
                width: `${pct}%`,
                background: C.accent,
                borderRadius: '99px',
                '--target-width': `${pct}%`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {/* ── Stats Card ── */}
      <div
        style={{
          background: C.card,
          borderRadius: '8px',
          padding: '4px 16px 0',
        }}
      >
        <StatRow label="Total" earned={earnedCredits} required={requiredCredits} />
        <StatRow label="Major" earned={major.earned} required={major.required} />
        <StatRow label="Liberal Arts" earned={liberalArts.earned} required={liberalArts.required} />
        <StatRow
          label={currentSemester ? `GPA · ${currentSemester.name}` : 'GPA'}
          earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'}
          highlight
        />
        <div style={{ paddingBottom: '4px' }} />
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '10px', color: C.muted }}>
          잔여&nbsp;
          <strong
            style={{
              fontFamily: '"DM Mono", "Courier New", monospace',
              color: C.text,
            }}
          >
            {remainingCredits}
          </strong>
          &nbsp;학점
        </span>
        {updatedAt && (
          <span style={{ fontSize: '9px', color: C.mutedLight }}>
            {new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
          </span>
        )}
      </div>
    </div>
  )
}
