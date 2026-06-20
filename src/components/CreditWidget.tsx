'use client'

import { useEffect, useRef, useState } from 'react'
import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

const FONT = {
  deco: 'DOSSaemmul, sans-serif',
  data: 'ChosunGu, sans-serif',
}

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
  sublabel: '#5E7255',
  footer: '#5C7A4E',
  footerText: '#E8EDE0',
  progressBg: '#D4DCC8',
}

type Size = 'xs' | 'sm' | 'md' | 'lg'
function getSize(w: number): Size {
  if (w < 200) return 'xs'
  if (w < 340) return 'sm'
  if (w < 560) return 'md'
  return 'lg'
}

function isUnset(earned: number | string, required?: number) {
  return typeof earned === 'number' && earned === 0 && required === 0
}

// ── StatCard ──────────────────────────────────────
function StatCard({
  icon, label, earned, required, compact = false,
}: {
  icon: string
  label: string
  earned: number | string
  required?: number
  compact?: boolean
}) {
  const unset = isUnset(earned, required)
  const iconSize = compact ? 16 : 20

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.cardBorder}`,
      borderRadius: '8px',
      padding: compact ? '8px 10px' : '12px 14px 10px',
      flex: 1,
      minWidth: 0,
    }}>
      {/* Header: 아이콘 + 제목 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? '5px' : '6px', marginBottom: compact ? '4px' : '7px' }}>
        <img src={icon} alt="" style={{ width: iconSize, height: iconSize, objectFit: 'contain', flexShrink: 0 }} />
        <span style={{ fontSize: compact ? '9px' : '10px', fontWeight: 700, color: C.text, lineHeight: 1.2, fontFamily: FONT.data }}>
          {label}
        </span>
      </div>

      {/* Body: 아이콘 왼쪽 기준선 (margin-left: 0) */}
      {/* 점선 */}
      <div style={{ borderTop: `1px dashed ${C.cardBorder}`, marginBottom: compact ? '4px' : '7px' }} />

      {/* 값 */}
      {unset ? (
        <>
          <div style={{ fontFamily: FONT.data, fontWeight: 600, color: C.mutedLight, fontSize: compact ? '12px' : '15px', lineHeight: 1 }}>
            미설정
          </div>
          {!compact && (
            <div style={{ fontSize: '9px', color: C.sublabel, fontWeight: 600, marginTop: '4px', fontFamily: FONT.data }}>
              필요 학점 미설정
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ fontFamily: FONT.data, fontWeight: 700, color: C.accentDark, fontSize: compact ? '15px' : '18px', lineHeight: 1 }}>
            {earned}
            {required !== undefined && (
              <span style={{ fontSize: compact ? '9px' : '11px', color: C.mutedLight, fontWeight: 400 }}>
                &nbsp;/&nbsp;{required}
              </span>
            )}
          </div>
          {!compact && required !== undefined && (
            <div style={{ fontSize: '9px', color: C.sublabel, fontWeight: 600, marginTop: '4px', fontFamily: FONT.data }}>
              취득 / 필요
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Footer ────────────────────────────────────────
function Footer({ updatedTime }: { updatedTime: string | null }) {
  return (
    <div style={{
      background: C.footer,
      borderRadius: '6px',
      padding: '8px 14px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '3px 8px',
    }}>
      <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.75, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data, whiteSpace: 'nowrap' }}>
        Last Updated
      </span>
      {updatedTime && (
        <span style={{ fontSize: '9px', color: C.footerText, fontFamily: FONT.data, whiteSpace: 'nowrap' }}>
          {updatedTime} 기준
        </span>
      )}
      <span style={{ fontSize: '8px', color: C.footerText, opacity: 0.6, fontFamily: FONT.deco, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
        EVERY DAY IS A STEP FORWARD.
      </span>
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────
function ProgressBar({ pct, showMarkers = true }: { pct: number; showMarkers?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '8px', background: C.progressBg, borderRadius: '4px', overflow: 'hidden' }}>
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            background: C.accentMid,
            borderRadius: '4px',
            '--target-width': `${pct}%`,
          } as React.CSSProperties}
        />
      </div>
      {showMarkers && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          {['0%', '50%', '100%'].map(m => (
            <span key={m} style={{ fontSize: '7px', color: C.mutedLight, fontFamily: FONT.data }}>{m}</span>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
}

export default function CreditWidget({ summary, title = 'Credit Buddy', updatedAt }: Props) {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } = summary
  const pct = Math.min(progressRate, 100)

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>('sm')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setSize(getSize(entries[0].contentRect.width))
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

  // ── xs ─────────────────────────────────────────
  if (size === 'xs') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '12px' }}>
        <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.deco, marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: C.accentMid, fontFamily: FONT.data, lineHeight: 1, marginBottom: '6px' }}>{pct}%</div>
        <ProgressBar pct={pct} showMarkers={false} />
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { label: '전체', earned: earnedCredits, req: requiredCredits },
            { label: '전공', earned: major.earned, req: major.required },
            { label: '교양', earned: liberalArts.earned, req: liberalArts.required },
          ].map(({ label, earned, req }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: FONT.data, color: C.text }}>
              <span style={{ color: C.muted }}>{label}</span>
              {earned === 0 && req === 0
                ? <span style={{ color: C.mutedLight }}>미설정</span>
                : <span style={{ fontWeight: 700 }}>{earned}<span style={{ color: C.mutedLight, fontWeight: 400 }}>/{req}</span></span>
              }
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── sm (200~340px) ─────────────────────────────
  if (size === 'sm') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '16px' }}>
        {/* Header — 타이틀 텍스트만 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '9px', color: C.muted, fontFamily: FONT.deco, marginBottom: '3px' }}>
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
          <div style={{ fontSize: '9px', color: C.muted, marginTop: '2px', fontFamily: FONT.deco }}>
            캠퍼스 라이프를 정리하는 작은 습관
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: C.muted, marginBottom: '3px', fontFamily: FONT.data }}>졸업까지</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.accentDark, lineHeight: 1, fontFamily: FONT.data }}>
                {remainingCredits}
                <span style={{ fontSize: '11px', fontWeight: 600, color: C.muted }}> 학점 남았어요!</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '7px', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data }}>GRADUATION</div>
              <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: FONT.data, color: C.accentMid, lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
          <ProgressBar pct={pct} />
        </div>

        {/* Stats 2x2 */}
        <div style={{ display: 'flex', gap: '7px', marginBottom: '7px' }}>
          <StatCard icon="/icons/04-semester-complete-badge.png" label="전체 학점" earned={earnedCredits} required={requiredCredits} />
          <StatCard icon="/icons/02-clover-note.png" label="전공 학점" earned={major.earned} required={major.required} />
        </div>
        <div style={{ display: 'flex', gap: '7px', marginBottom: '10px' }}>
          <StatCard icon="/icons/04-clover-label.png" label="교양 학점" earned={liberalArts.earned} required={liberalArts.required} />
          <StatCard icon="/icons/03-clover-medal.png" label="이번 학기 평점" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} />
        </div>

        {/* Status */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <img src="/icons/01-clover.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco }}>{getStatusMessage(remainingCredits)}</span>
        </div>

        <Footer updatedTime={updatedTime} />
      </div>
    )
  }

  // ── md (340~560px) — 스탯 1줄 4개 ────────────────
  if (size === 'md') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco, marginBottom: '3px' }}>今日も、未来の自分のために。</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: C.accentDark, fontFamily: FONT.data }}>{title}</span>
              <span style={{ fontSize: '10px', color: C.muted, border: `1px solid ${C.accentLight}`, borderRadius: '99px', padding: '1px 7px', fontFamily: FONT.data }}>{year}</span>
            </div>
            <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px', fontFamily: FONT.deco }}>캠퍼스 라이프를 정리하는 작은 습관</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data }}>GRADUATION</div>
            <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: FONT.data, color: C.accentMid, lineHeight: 1 }}>{pct}%</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: C.muted, marginBottom: '6px', fontFamily: FONT.data }}>
            졸업까지 <strong style={{ color: C.accentDark, fontSize: '16px' }}>{remainingCredits}</strong> 학점 남았어요!
          </div>
          <ProgressBar pct={pct} />
        </div>

        {/* Stats 1x4 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <StatCard icon="/icons/04-semester-complete-badge.png" label="전체 학점" earned={earnedCredits} required={requiredCredits} compact />
          <StatCard icon="/icons/02-clover-note.png" label="전공 학점" earned={major.earned} required={major.required} compact />
          <StatCard icon="/icons/04-clover-label.png" label="교양 학점" earned={liberalArts.earned} required={liberalArts.required} compact />
          <StatCard icon="/icons/03-clover-medal.png" label="학기 평점" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} compact />
        </div>

        <Footer updatedTime={updatedTime} />
      </div>
    )
  }

  // ── lg (560px+) — 2열 ─────────────────────────────
  return (
    <div ref={containerRef} style={{ ...bgStyle, padding: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.deco, marginBottom: '3px' }}>今日も、未来の自分のために。</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: C.accentDark, fontFamily: FONT.data }}>{title}</span>
            <span style={{ fontSize: '11px', color: C.muted, border: `1px solid ${C.accentLight}`, borderRadius: '99px', padding: '2px 8px', fontFamily: FONT.data }}>{year}</span>
          </div>
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '3px', fontFamily: FONT.deco }}>캠퍼스 라이프를 정리하는 작은 습관</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: FONT.data }}>GRADUATION PROGRESS</div>
          <div style={{ fontSize: '40px', fontWeight: 700, fontFamily: FONT.data, color: C.accentMid, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco, marginTop: '3px' }}>{getStatusMessage(remainingCredits)}</div>
        </div>
      </div>

      {/* 2열 본문 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        {/* 왼쪽 */}
        <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', color: C.muted, marginBottom: '5px', fontFamily: FONT.data }}>졸업까지</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: C.accentDark, lineHeight: 1, fontFamily: FONT.data, marginBottom: '10px' }}>
              {remainingCredits}
              <span style={{ fontSize: '13px', fontWeight: 600, color: C.muted }}> 학점</span>
            </div>
            <ProgressBar pct={pct} />
          </div>
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
                {earned === 0 && req === 0
                  ? <span style={{ fontSize: '12px', fontWeight: 600, color: C.mutedLight, fontFamily: FONT.data }}>미설정</span>
                  : <span style={{ fontSize: '14px', fontWeight: 700, color: C.accentDark, fontFamily: FONT.data }}>
                      {earned}<span style={{ fontSize: '10px', color: C.mutedLight, fontWeight: 400 }}>/{req}</span>
                    </span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 2x2 */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <StatCard icon="/icons/04-semester-complete-badge.png" label="전체 학점" earned={earnedCredits} required={requiredCredits} />
          <StatCard icon="/icons/02-clover-note.png" label="전공 학점" earned={major.earned} required={major.required} />
          <StatCard icon="/icons/04-clover-label.png" label="교양 학점" earned={liberalArts.earned} required={liberalArts.required} />
          <StatCard icon="/icons/03-clover-medal.png" label="이번 학기 평점" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} />
        </div>
      </div>

      <Footer updatedTime={updatedTime} />
    </div>
  )
}
