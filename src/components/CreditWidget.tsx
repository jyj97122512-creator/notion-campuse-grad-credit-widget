'use client'

import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

const C = {
  bg: '#E8EDE0',
  card: '#F5F7F1',
  cardBorder: '#D4DCC8',
  accentDark: '#4A6640',
  accentMid: '#6B8A5E',
  accentLight: '#A8BC98',
  text: '#3A4A35',
  muted: '#7A9170',
  mutedLight: '#9AAD8E',
  footer: '#5C7A4E',
  footerText: '#E8EDE0',
  progressBg: '#D4DCC8',
}

interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
}

function StatCard({
  icon,
  label,
  sublabel,
  earned,
  required,
}: {
  icon: string
  label: string
  sublabel: string
  earned: number | string
  required?: number
}) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: '8px',
        padding: '12px 14px 10px',
        flex: 1,
      }}
    >
      {/* icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px' }}>{icon}</span>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{label}</div>
          <div style={{ fontSize: '8px', color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{sublabel}</div>
        </div>
      </div>
      {/* divider */}
      <div style={{ borderTop: `1px dashed ${C.cardBorder}`, marginBottom: '8px' }} />
      {/* value */}
      <div style={{ fontFamily: '"Courier New", monospace', fontWeight: 700, color: C.accentDark, fontSize: '20px', lineHeight: 1 }}>
        {earned}
        {required !== undefined && (
          <span style={{ fontSize: '11px', color: C.mutedLight, fontWeight: 400 }}>
            &nbsp;/&nbsp;{required}
          </span>
        )}
      </div>
      {required !== undefined && (
        <div style={{ fontSize: '8px', color: C.muted, marginTop: '3px', letterSpacing: '0.04em' }}>
          취득 / 필요
        </div>
      )}
    </div>
  )
}

export default function CreditWidget({ summary, title = 'CREDIT BUDDY', updatedAt }: Props) {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } =
    summary

  const pct = Math.min(progressRate, 100)

  return (
    <div
      style={{
        background: C.bg,
        backgroundImage: `
          linear-gradient(${C.cardBorder}55 1px, transparent 1px),
          linear-gradient(90deg, ${C.cardBorder}55 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        maxWidth: '340px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '0.04em', marginBottom: '2px' }}>
          今日も、未来の自分のために。
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: C.accentDark,
              letterSpacing: '0.06em',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: '9px',
              color: C.muted,
              border: `1px solid ${C.accentLight}`,
              borderRadius: '99px',
              padding: '1px 6px',
              letterSpacing: '0.04em',
            }}
          >
            {new Date().getFullYear()}
          </span>
        </div>
        <div style={{ fontSize: '9px', color: C.muted, marginTop: '1px' }}>
          캠퍼스 라이프를 정리하는 작은 습관
        </div>
      </div>

      {/* ── Progress Card ── */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>졸업까지</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: C.accentDark, lineHeight: 1 }}>
              {remainingCredits}
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.muted }}> 학점 남았어요!</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '8px', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              GRADUATION PROGRESS
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 700,
                fontFamily: '"Courier New", monospace',
                color: C.accentMid,
                lineHeight: 1,
              }}
            >
              {pct}%
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              height: '10px',
              background: C.progressBg,
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              className="progress-fill"
              style={
                {
                  height: '100%',
                  width: `${pct}%`,
                  background: C.accentMid,
                  borderRadius: '2px',
                  '--target-width': `${pct}%`,
                } as React.CSSProperties
              }
            />
          </div>
          {/* markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
            {['0%', '50%', '100%'].map((m) => (
              <span key={m} style={{ fontSize: '7px', color: C.mutedLight }}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <StatCard icon="📚" label="전체 학점" sublabel="Total Credits" earned={earnedCredits} required={requiredCredits} />
        <StatCard icon="🎓" label="전공 학점" sublabel="Major Credits" earned={major.earned} required={major.required} />
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <StatCard icon="🌿" label="교양 학점" sublabel="Liberal Arts" earned={liberalArts.earned} required={liberalArts.required} />
        <StatCard
          icon="⭐"
          label="이번 학기 평점"
          sublabel="Semester GPA"
          earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'}
        />
      </div>

      {/* ── Status message ── */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '10px' }}>🌱</span>
        <span style={{ fontSize: '10px', color: C.muted, fontStyle: 'italic' }}>
          {getStatusMessage(remainingCredits)}
        </span>
      </div>

      {/* ── Footer bar ── */}
      <div
        style={{
          background: C.footer,
          borderRadius: '6px',
          padding: '7px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Last Updated
          </span>
          {updatedAt && (
            <span style={{ fontSize: '9px', color: C.footerText, fontFamily: '"Courier New", monospace' }}>
              {new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
            </span>
          )}
        </div>
        <span style={{ fontSize: '8px', color: C.footerText, opacity: 0.6, letterSpacing: '0.06em' }}>
          EVERY DAY IS A STEP FORWARD.
        </span>
      </div>
    </div>
  )
}
