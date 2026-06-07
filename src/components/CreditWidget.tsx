'use client'

import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

const C = {
  bg: '#FFF8E7',
  card: '#FFFFFF',
  border: '#2E2E2E',
  main: '#6B8ECA',
  accent: '#F4A7B9',
  text: '#2B2B2B',
  muted: '#8A8A8A',
  progressEmpty: '#E8E1D3',
}

interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
}

function StatCard({
  label,
  earned,
  required,
  accent = false,
}: {
  label: string
  earned: number | string
  required?: number
  accent?: boolean
}) {
  return (
    <div
      style={{
        background: accent ? C.accent + '28' : C.card,
        border: `2px solid ${C.border}`,
        borderRadius: '2px',
        padding: '10px 12px',
      }}
    >
      <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600, marginBottom: 4, letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'monospace', fontWeight: 700, color: C.text, fontSize: '17px', lineHeight: 1 }}>
        {earned}
        {required !== undefined && (
          <span style={{ fontSize: '11px', color: C.muted, fontWeight: 400 }}>
            &nbsp;/&nbsp;{required}
          </span>
        )}
      </div>
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
        border: `2px solid ${C.border}`,
        borderRadius: '4px',
        padding: '20px',
        width: '100%',
        maxWidth: '320px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
          <span style={{ fontSize: '16px' }}>🎓</span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: C.text,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: C.muted, fontWeight: 500 }}>
          {getStatusMessage(remainingCredits)}
        </p>
      </div>

      {/* ── Progress ── */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}
        >
          <span
            style={{ fontSize: '34px', fontWeight: 800, color: C.main, fontFamily: 'monospace', lineHeight: 1 }}
          >
            {pct}%
          </span>
          <span style={{ fontSize: '10px', color: C.muted, letterSpacing: '0.06em' }}>GRADUATION PROGRESS</span>
        </div>
        {/* Progress Bar */}
        <div
          style={{
            height: '14px',
            background: C.progressEmpty,
            border: `2px solid ${C.border}`,
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            className="progress-fill"
            style={
              {
                height: '100%',
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${C.main} 0%, #8BAEDD 100%)`,
                '--target-width': `${pct}%`,
              } as React.CSSProperties
            }
          />
          {/* 픽셀 눈금선 */}
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              style={{
                position: 'absolute',
                top: 0,
                left: `${mark}%`,
                width: '1px',
                height: '100%',
                background: C.border + '40',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        <StatCard label="전체 학점" earned={earnedCredits} required={requiredCredits} />
        <StatCard label="전공 학점" earned={major.earned} required={major.required} />
        <StatCard label="교양 학점" earned={liberalArts.earned} required={liberalArts.required} />
        <StatCard
          label={currentSemester ? `${currentSemester.name} GPA` : '이번 학기 GPA'}
          earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'}
          accent
        />
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: `1px dashed ${C.border}`,
          paddingTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '11px', color: C.muted }}>
          남은 학점&nbsp;
          <strong style={{ color: C.text, fontFamily: 'monospace' }}>{remainingCredits}</strong>
        </span>
        {updatedAt && (
          <span style={{ fontSize: '9px', color: C.muted }}>
            {new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
          </span>
        )}
      </div>
    </div>
  )
}
