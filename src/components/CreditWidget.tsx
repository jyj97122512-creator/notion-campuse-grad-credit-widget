'use client'

import { useEffect, useRef, useState } from 'react'
import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

// ── 폰트 ─────────────────────────────────────────
const FONT = {
  deco: 'DOSSaemmul, sans-serif',
  data: 'ChosunGu, sans-serif',
}

// ── 색상 ─────────────────────────────────────────
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

// ── 브레이크포인트 ────────────────────────────────
// xs < 200 / sm 200~340 / md 340~560 / lg 560+
type Size = 'xs' | 'sm' | 'md' | 'lg'
function getSize(w: number): Size {
  if (w < 200) return 'xs'
  if (w < 340) return 'sm'
  if (w < 560) return 'md'
  return 'lg'
}

// ── StatCard ──────────────────────────────────────
function StatCard({
  icon, label, sublabel, earned, required, compact = false,
}: {
  icon: string
  label: string
  sublabel: string
  earned: number | string
  required?: number
  compact?: boolean
}) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.cardBorder}`,
      borderRadius: '8px',
      padding: compact ? '8px 10px' : '12px 14px 10px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: compact ? '4px' : '6px' }}>
        <span style={{ fontSize: compact ? '11px' : '13px' }}>{icon}</span>
        <div>
          <div style={{ fontSize: compact ? '9px' : '10px', fontWeight: 700, color: C.text, lineHeight: 1.2, fontFamily: FONT.data }}>
            {label}
          </div>
          {!compact && (
            <div style={{ fontSize: '8px', color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONT.data }}>
              {sublabel}
            </div>
          )}
        </div>
      </div>
      <div style={{ borderTop: `1px dashed ${C.cardBorder}`, marginBottom: compact ? '4px' : '8px' }} />
      <div style={{ fontFamily: FONT.data, fontWeight: 700, color: C.accentDark, fontSize: compact ? '16px' : '20px', lineHeight: 1 }}>
        {earned}
        {required !== undefined && (
          <span style={{ fontSize: compact ? '9px' : '11px', color: C.mutedLight, fontWeight: 400 }}>
            &nbsp;/&nbsp;{required}
          </span>
        )}
      </div>
      {!compact && required !== undefined && (
        <div style={{ fontSize: '8px', color: C.muted, marginTop: '3px', fontFamily: FONT.data }}>취득 / 필요</div>
      )}
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────
function ProgressBar({ pct, showMarkers = true }: { pct: number; showMarkers?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '10px', background: C.progressBg, borderRadius: '2px', overflow: 'hidden' }}>
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            background: C.accentMid,
            borderRadius: '2px',
            '--target-width': `${pct}%`,
          } as React.CSSProperties}
        />
      </div>
      {showMarkers && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
          {['0%', '50%', '100%'].map(m => (
            <span key={m} style={{ fontSize: '7px', color: C.mutedLight, fontFamily: FONT.data }}>{m}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Props ─────────────────────────────────────────
interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
}

// ════════════════════════════════════════════════════
export default function CreditWidget({ summary, title = 'CREDIT BUDDY', updatedAt }: Props) {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } = summary
  const pct = Math.min(progressRate, 100)

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>('sm')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width
      setSize(getSize(w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const year = new Date().getFullYear()
  const updatedTime = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null

  const bgStyle = {
    background: C.bg,
    backgroundImage: `
      linear-gradient(${C.cardBorder}55 1px, transparent 1px),
      linear-gradient(90deg, ${C.cardBorder}55 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    borderRadius: '12px',
    fontFamily: FONT.data,
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  // ── xs: 초소형 ─────────────────────────────────
  if (size === 'xs') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '12px' }}>
        <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.deco, marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: C.accentMid, fontFamily: FONT.data, lineHeight: 1, marginBottom: '6px' }}>
          {pct}%
        </div>
        <ProgressBar pct={pct} showMarkers={false} />
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { label: '전체', earned: earnedCredits, req: requiredCredits },
            { label: '전공', earned: major.earned, req: major.required },
            { label: '교양', earned: liberalArts.earned, req: liberalArts.required },
          ].map(({ label, earned, req }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: FONT.data, color: C.text }}>
              <span style={{ color: C.muted }}>{label}</span>
              <span style={{ fontWeight: 700 }}>{earned}<span style={{ color: C.mutedLight, fontWeight: 400 }}>/{req}</span></span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── sm: 기본 (현재 레이아웃) ───────────────────
  if (size === 'sm') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '9px', color: C.muted, fontFamily: FONT.deco, marginBottom: '2px' }}>
            今日も、未来の自分のために。
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: C.accentDark, fontFamily: FONT.data }}>
              {title}
            </span>
            <span style={{ fontSize: '9px', color: C.muted, border: `1px solid ${C.accentLight}`, borderRadius: '99px', padding: '1px 6px', fontFamily: FONT.data }}>
              {year}
            </span>
          </div>
          <div style={{ fontSize: '9px', color: C.muted, marginTop: '1px', fontFamily: FONT.deco }}>
            캠퍼스 라이프를 정리하는 작은 습관
          </div>
        </div>
        {/* Progress */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px', fontFamily: FONT.data }}>졸업까지</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: C.accentDark, lineHeight: 1, fontFamily: FONT.data }}>
                {remainingCredits}
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.muted }}> 학점 남았어요!</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '8px', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data }}>GRADUATION PROGRESS</div>
              <div style={{ fontSize: '26px', fontWeight: 700, fontFamily: FONT.data, color: C.accentMid, lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
          <ProgressBar pct={pct} />
        </div>
        {/* Stats 2x2 */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <StatCard icon="📚" label="전체 학점" sublabel="Total Credits" earned={earnedCredits} required={requiredCredits} />
          <StatCard icon="🎓" label="전공 학점" sublabel="Major Credits" earned={major.earned} required={major.required} />
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <StatCard icon="🌿" label="교양 학점" sublabel="Liberal Arts" earned={liberalArts.earned} required={liberalArts.required} />
          <StatCard icon="⭐" label="이번 학기 평점" sublabel="Semester GPA" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} />
        </div>
        {/* Status */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px' }}>🌱</span>
          <span style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco }}>{getStatusMessage(remainingCredits)}</span>
        </div>
        {/* Footer */}
        <div style={{ background: C.footer, borderRadius: '6px', padding: '7px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data }}>Last Updated</span>
            {updatedTime && <span style={{ fontSize: '9px', color: C.footerText, fontFamily: FONT.data }}>{updatedTime} 기준</span>}
          </div>
          <span style={{ fontSize: '8px', color: C.footerText, opacity: 0.6, fontFamily: FONT.deco }}>EVERY DAY IS A STEP FORWARD.</span>
        </div>
      </div>
    )
  }

  // ── md: 중형 — 스탯 1줄 4개 ────────────────────
  if (size === 'md') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco, marginBottom: '2px' }}>今日も、未来の自分のために。</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: C.accentDark, fontFamily: FONT.data }}>{title}</span>
              <span style={{ fontSize: '10px', color: C.muted, border: `1px solid ${C.accentLight}`, borderRadius: '99px', padding: '1px 7px', fontFamily: FONT.data }}>{year}</span>
            </div>
            <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px', fontFamily: FONT.deco }}>캠퍼스 라이프를 정리하는 작은 습관</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data }}>GRADUATION</div>
            <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: FONT.data, color: C.accentMid, lineHeight: 1 }}>{pct}%</div>
          </div>
        </div>
        {/* Progress */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px', fontFamily: FONT.data }}>
            졸업까지 <strong style={{ color: C.accentDark, fontSize: '18px' }}>{remainingCredits}</strong> 학점 남았어요!
          </div>
          <ProgressBar pct={pct} />
        </div>
        {/* Stats 1x4 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <StatCard icon="📚" label="전체 학점" sublabel="Total" earned={earnedCredits} required={requiredCredits} compact />
          <StatCard icon="🎓" label="전공 학점" sublabel="Major" earned={major.earned} required={major.required} compact />
          <StatCard icon="🌿" label="교양 학점" sublabel="Liberal" earned={liberalArts.earned} required={liberalArts.required} compact />
          <StatCard icon="⭐" label="학기 평점" sublabel="GPA" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} compact />
        </div>
        {/* Footer */}
        <div style={{ background: C.footer, borderRadius: '6px', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.7, textTransform: 'uppercase', fontFamily: FONT.data }}>Last Updated</span>
            {updatedTime && <span style={{ fontSize: '9px', color: C.footerText, fontFamily: FONT.data }}>{updatedTime} 기준</span>}
          </div>
          <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.6, fontFamily: FONT.deco }}>EVERY DAY IS A STEP FORWARD.</span>
        </div>
      </div>
    )
  }

  // ── lg: 와이드 — 좌(프로그레스) / 우(스탯) 2열 ─
  return (
    <div ref={containerRef} style={{ ...bgStyle, padding: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.deco, marginBottom: '3px' }}>今日も、未来の自分のために。</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '26px', fontWeight: 900, color: C.accentDark, fontFamily: FONT.data }}>{title}</span>
            <span style={{ fontSize: '11px', color: C.muted, border: `1px solid ${C.accentLight}`, borderRadius: '99px', padding: '2px 8px', fontFamily: FONT.data }}>{year}</span>
          </div>
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px', fontFamily: FONT.deco }}>캠퍼스 라이프를 정리하는 작은 습관</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: FONT.data }}>GRADUATION PROGRESS</div>
          <div style={{ fontSize: '44px', fontWeight: 700, fontFamily: FONT.data, color: C.accentMid, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.deco, marginTop: '2px' }}>{getStatusMessage(remainingCredits)}</div>
        </div>
      </div>

      {/* 2열 본문 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        {/* 왼쪽: 프로그레스 */}
        <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', color: C.muted, marginBottom: '6px', fontFamily: FONT.data }}>졸업까지</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: C.accentDark, lineHeight: 1, fontFamily: FONT.data, marginBottom: '10px' }}>
              {remainingCredits}
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.muted }}> 학점</span>
            </div>
            <ProgressBar pct={pct} />
          </div>
          {/* 전체 학점 요약 */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '12px 16px' }}>
            {[
              { label: '전체', earned: earnedCredits, req: requiredCredits },
              { label: '전공', earned: major.earned, req: major.required },
              { label: '교양', earned: liberalArts.earned, req: liberalArts.required },
            ].map(({ label, earned, req }, i, arr) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '5px 0',
                borderBottom: i < arr.length - 1 ? `1px dashed ${C.cardBorder}` : 'none',
              }}>
                <span style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.data }}>{label}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: C.accentDark, fontFamily: FONT.data }}>
                  {earned}<span style={{ fontSize: '10px', color: C.mutedLight, fontWeight: 400 }}>/{req}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 스탯 카드 2x2 */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <StatCard icon="📚" label="전체 학점" sublabel="Total Credits" earned={earnedCredits} required={requiredCredits} />
          <StatCard icon="🎓" label="전공 학점" sublabel="Major Credits" earned={major.earned} required={major.required} />
          <StatCard icon="🌿" label="교양 학점" sublabel="Liberal Arts" earned={liberalArts.earned} required={liberalArts.required} />
          <StatCard icon="⭐" label="이번 학기 평점" sublabel="Semester GPA" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: C.footer, borderRadius: '6px', padding: '9px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: C.footerText, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT.data }}>Last Updated</span>
          {updatedTime && <span style={{ fontSize: '10px', color: C.footerText, fontFamily: FONT.data }}>{updatedTime} 기준</span>}
        </div>
        <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.6, fontFamily: FONT.deco }}>EVERY DAY IS A STEP FORWARD.</span>
      </div>
    </div>
  )
}
