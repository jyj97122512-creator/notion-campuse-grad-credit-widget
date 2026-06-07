'use client'

import { useEffect, useRef, useState } from 'react'
import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

// ── 폰트 ─────────────────────────────────────────
const FONT = {
  deco: 'DOSSaemmul, sans-serif',
  data: 'ChosunGu, sans-serif',
}

// ── 색상 (Student Record Edition) ────────────────
const C = {
  bg: '#DDE4D4',
  card: '#F7F8F2',
  cardBorder: '#AAB49A',
  accent: '#6C865E',
  accentLight: '#9AB08A',
  text: '#435042',
  muted: '#7A9070',
  mutedLight: '#A0B490',
  footer: '#556B4A',
  footerText: '#F0F4EC',
  progressBg: '#C8D4BC',
  stamp: '#8FA87E',
}

// ── 브레이크포인트 ────────────────────────────────
type Size = 'xs' | 'sm' | 'md' | 'lg'
function getSize(w: number): Size {
  if (w < 200) return 'xs'
  if (w < 380) return 'sm'
  if (w < 600) return 'md'
  return 'lg'
}

// ── 카드별 이미지 플레이스홀더 정의 ──────────────
// imageUrl prop 연결 시 실제 이미지로 대체 가능
const CARD_META = {
  total: {
    label: 'TOTAL CREDITS',
    sublabel: '전체 학점',
    emoji: '📚',
    gradientFrom: '#C8D8B8',
    gradientTo: '#E0EAD4',
    stamp: 'ACADEMIC\nRECORD',
  },
  major: {
    label: 'MAJOR CREDITS',
    sublabel: '전공 학점',
    emoji: '🏛',
    gradientFrom: '#BDD0C0',
    gradientTo: '#D8E8D8',
    stamp: 'MAJOR\nCOURSE',
  },
  liberal: {
    label: 'LIBERAL ARTS',
    sublabel: '교양 학점',
    emoji: '🌿',
    gradientFrom: '#C4D4B0',
    gradientTo: '#DCE8CC',
    stamp: 'LIBERAL\nARTS',
  },
  gpa: {
    label: 'SEMESTER GPA',
    sublabel: '이번 학기 평점',
    emoji: '⭐',
    gradientFrom: '#BCC8AC',
    gradientTo: '#D4E0C4',
    stamp: 'GRADE\nRECORD',
  },
}

interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
  /** 카드별 커스텀 이미지 URL (선택) */
  images?: { total?: string; major?: string; liberal?: string; gpa?: string }
}

// ── StudentRecordCard ─────────────────────────────
function StudentRecordCard({
  meta,
  earned,
  required,
  imageUrl,
  compact = false,
  horizontal = false,
}: {
  meta: (typeof CARD_META)[keyof typeof CARD_META]
  earned: number | string
  required?: number
  imageUrl?: string
  compact?: boolean
  horizontal?: boolean
}) {
  const imgH = compact ? 56 : horizontal ? 90 : 80

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        flex: 1,
        minWidth: horizontal ? 120 : 0,
      }}
    >
      {/* ── 상단 헤더 ── */}
      <div
        style={{
          background: C.accent,
          padding: compact ? '4px 10px' : '6px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          ...(horizontal ? { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: 70, padding: '10px 10px' } : {}),
        }}
      >
        <span
          style={{
            fontSize: compact ? '7px' : '8px',
            fontWeight: 700,
            color: C.footerText,
            letterSpacing: '0.12em',
            fontFamily: FONT.data,
            whiteSpace: 'nowrap',
          }}
        >
          STUDENT RECORD
        </span>
        {!compact && (
          <span style={{ fontSize: '8px', color: C.footerText, opacity: 0.7, fontFamily: FONT.data, letterSpacing: '0.06em' }}>
            CREDIT BUDDY
          </span>
        )}
      </div>

      {/* ── 이미지 영역 ── */}
      <div
        style={{
          height: imgH,
          background: imageUrl
            ? `url(${imageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${meta.gradientFrom} 0%, ${meta.gradientTo} 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...(horizontal ? { width: 70, height: 'auto', minHeight: 80 } : {}),
        }}
      >
        {!imageUrl && (
          <>
            <span style={{ fontSize: compact ? 22 : 28, opacity: 0.6 }}>{meta.emoji}</span>
            {/* 스탬프 느낌 도장 */}
            <div
              style={{
                position: 'absolute',
                bottom: 6,
                right: 8,
                border: `1.5px solid ${C.stamp}`,
                borderRadius: '4px',
                padding: '2px 5px',
                fontSize: '6px',
                fontFamily: FONT.data,
                color: C.stamp,
                letterSpacing: '0.08em',
                fontWeight: 700,
                opacity: 0.7,
                whiteSpace: 'pre',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              {meta.stamp}
            </div>
          </>
        )}
      </div>

      {/* ── 수치 영역 ── */}
      <div
        style={{
          padding: compact ? '8px 10px' : '10px 12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* 레이블 */}
        <div
          style={{
            fontSize: compact ? '7px' : '8px',
            fontWeight: 700,
            color: C.muted,
            letterSpacing: '0.1em',
            fontFamily: FONT.data,
            marginBottom: '3px',
          }}
        >
          {meta.label}
        </div>
        {/* 구분선 */}
        <div style={{ borderTop: `1px dashed ${C.cardBorder}`, marginBottom: '6px' }} />
        {/* 숫자 */}
        <div
          style={{
            fontFamily: FONT.data,
            fontWeight: 700,
            color: C.text,
            fontSize: compact ? '18px' : '22px',
            lineHeight: 1,
          }}
        >
          {earned}
          {required !== undefined && (
            <span style={{ fontSize: compact ? '10px' : '12px', color: C.mutedLight, fontWeight: 400 }}>
              &nbsp;/&nbsp;{required}
            </span>
          )}
        </div>
        {required !== undefined && (
          <div style={{ fontSize: '7px', color: C.muted, marginTop: '3px', fontFamily: FONT.data, letterSpacing: '0.04em' }}>
            취득 / 필요
          </div>
        )}
      </div>
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────
function ProgressBar({ pct, showMarkers = true }: { pct: number; showMarkers?: boolean }) {
  return (
    <div>
      <div style={{ height: '8px', background: C.progressBg, borderRadius: '2px', overflow: 'hidden' }}>
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            background: C.accent,
            borderRadius: '2px',
            '--target-width': `${pct}%`,
          } as React.CSSProperties}
        />
      </div>
      {showMarkers && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          {['0%', '50%', '100%'].map(m => (
            <span key={m} style={{ fontSize: '7px', color: C.mutedLight, fontFamily: FONT.data }}>{m}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 공통 헤더 블록 ────────────────────────────────
function WidgetHeader({ title, size }: { title: string; size: Size }) {
  const fs = size === 'lg' ? 24 : size === 'md' ? 20 : 17
  return (
    <div style={{ marginBottom: size === 'xs' ? 8 : 14 }}>
      <div style={{ fontSize: '9px', color: C.muted, fontFamily: FONT.deco, marginBottom: '2px' }}>
        今日も、未来の自分のために。
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: fs, fontWeight: 900, color: C.accent, fontFamily: FONT.data, letterSpacing: '0.05em' }}>
          {title}
        </span>
        <span
          style={{
            fontSize: '8px',
            color: C.muted,
            border: `1px solid ${C.accentLight}`,
            borderRadius: '99px',
            padding: '1px 6px',
            fontFamily: FONT.data,
          }}
        >
          Student Record
        </span>
      </div>
      <div style={{ fontSize: '9px', color: C.muted, marginTop: '1px', fontFamily: FONT.deco }}>
        캠퍼스 라이프를 정리하는 작은 습관
      </div>
    </div>
  )
}

// ── 공통 푸터 블록 ────────────────────────────────
function WidgetFooter({ updatedTime }: { updatedTime: string | null }) {
  return (
    <div
      style={{
        background: C.footer,
        borderRadius: '6px',
        padding: '7px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '9px', color: C.footerText, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.data }}>
          Last Updated
        </span>
        {updatedTime && (
          <span style={{ fontSize: '9px', color: C.footerText, fontFamily: FONT.data }}>
            {updatedTime} 기준
          </span>
        )}
      </div>
      <span style={{ fontSize: '8px', color: C.footerText, opacity: 0.6, fontFamily: FONT.deco }}>
        EVERY DAY IS A STEP FORWARD.
      </span>
    </div>
  )
}

// ════════════════════════════════════════════════════
export default function CreditWidget({ summary, title = 'CREDIT BUDDY', updatedAt, images = {} }: Props) {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } = summary
  const pct = Math.min(progressRate, 100)
  const gpa = currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>('sm')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => setSize(getSize(entries[0].contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const updatedTime = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null

  const bgStyle: React.CSSProperties = {
    background: C.bg,
    backgroundImage: `
      linear-gradient(${C.cardBorder}44 1px, transparent 1px),
      linear-gradient(90deg, ${C.cardBorder}44 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    borderRadius: '12px',
    fontFamily: FONT.data,
    width: '100%',
    boxSizing: 'border-box',
  }

  // ── xs ────────────────────────────────────────
  if (size === 'xs') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '12px' }}>
        <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.deco, marginBottom: '6px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: C.accent, fontFamily: FONT.data, lineHeight: 1, marginBottom: '6px' }}>
          {pct}%
        </div>
        <ProgressBar pct={pct} showMarkers={false} />
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { l: '전체', e: earnedCredits, r: requiredCredits },
            { l: '전공', e: major.earned, r: major.required },
            { l: '교양', e: liberalArts.earned, r: liberalArts.required },
          ].map(({ l, e, r }) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: FONT.data, color: C.text }}>
              <span style={{ color: C.muted }}>{l}</span>
              <span style={{ fontWeight: 700 }}>{e}<span style={{ color: C.mutedLight, fontWeight: 400 }}>/{r}</span></span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── sm: 프로그레스 카드 + 레코드 카드 세로 스택 ──
  if (size === 'sm') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '16px' }}>
        <WidgetHeader title={title} size={size} />

        {/* 졸업 진행률 */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.data, marginBottom: '2px' }}>졸업까지</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: C.text, fontFamily: FONT.data, lineHeight: 1 }}>
                {remainingCredits}
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.muted }}> 학점</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.data, letterSpacing: '0.08em' }}>GRADUATION</div>
              <div style={{ fontSize: '30px', fontWeight: 700, color: C.accent, fontFamily: FONT.data, lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
          <ProgressBar pct={pct} />
        </div>

        {/* Student Record Cards — 세로 스택 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <StudentRecordCard meta={CARD_META.total}   earned={earnedCredits}  required={requiredCredits}     imageUrl={images.total}   compact />
          <StudentRecordCard meta={CARD_META.major}   earned={major.earned}   required={major.required}      imageUrl={images.major}   compact />
          <StudentRecordCard meta={CARD_META.liberal} earned={liberalArts.earned} required={liberalArts.required} imageUrl={images.liberal} compact />
          <StudentRecordCard meta={CARD_META.gpa}     earned={gpa}                                           imageUrl={images.gpa}     compact />
        </div>

        <WidgetFooter updatedTime={updatedTime} />
      </div>
    )
  }

  // ── md: 2×2 그리드 ─────────────────────────────
  if (size === 'md') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '18px' }}>
        <WidgetHeader title={title} size={size} />

        {/* 졸업 진행률 */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.data, marginBottom: '2px' }}>졸업까지</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: C.text, fontFamily: FONT.data, lineHeight: 1 }}>
                {remainingCredits}
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.muted }}> 학점 남았어요!</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.data, letterSpacing: '0.1em' }}>GRADUATION PROGRESS</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: C.accent, fontFamily: FONT.data, lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
          <ProgressBar pct={pct} />
        </div>

        {/* Student Record Cards — 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <StudentRecordCard meta={CARD_META.total}   earned={earnedCredits}      required={requiredCredits}     imageUrl={images.total}   />
          <StudentRecordCard meta={CARD_META.major}   earned={major.earned}       required={major.required}      imageUrl={images.major}   />
          <StudentRecordCard meta={CARD_META.liberal} earned={liberalArts.earned} required={liberalArts.required} imageUrl={images.liberal} />
          <StudentRecordCard meta={CARD_META.gpa}     earned={gpa}                                               imageUrl={images.gpa}     />
        </div>

        <WidgetFooter updatedTime={updatedTime} />
      </div>
    )
  }

  // ── lg: 좌(진행률+상태) / 우(4장 가로) 2열 ───────
  return (
    <div ref={containerRef} style={{ ...bgStyle, padding: '22px' }}>
      <WidgetHeader title={title} size={size} />

      <div style={{ display: 'flex', gap: '16px' }}>
        {/* 왼쪽: 진행률 */}
        <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.data, marginBottom: '4px', letterSpacing: '0.08em' }}>GRADUATION PROGRESS</div>
            <div style={{ fontSize: '48px', fontWeight: 700, color: C.accent, fontFamily: FONT.data, lineHeight: 1, marginBottom: '8px' }}>{pct}%</div>
            <ProgressBar pct={pct} />
            <div style={{ marginTop: '8px', fontSize: '11px', color: C.muted, fontFamily: FONT.data }}>
              졸업까지 <strong style={{ color: C.text }}>{remainingCredits}</strong> 학점
            </div>
          </div>
          {/* 요약 행 */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '10px 14px' }}>
            {[
              { l: '전체', e: earnedCredits, r: requiredCredits },
              { l: '전공', e: major.earned, r: major.required },
              { l: '교양', e: liberalArts.earned, r: liberalArts.required },
            ].map(({ l, e, r }, i, arr) => (
              <div key={l} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '5px 0',
                borderBottom: i < arr.length - 1 ? `1px dashed ${C.cardBorder}` : 'none',
              }}>
                <span style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.data }}>{l}</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: C.text, fontFamily: FONT.data }}>
                  {e}<span style={{ fontSize: '10px', color: C.mutedLight, fontWeight: 400 }}>/{r}</span>
                </span>
              </div>
            ))}
          </div>
          {/* 상태 메시지 */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>🌱</span>
            <span style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco }}>{getStatusMessage(remainingCredits)}</span>
          </div>
        </div>

        {/* 오른쪽: Student Record Cards 4장 가로 */}
        <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
          <StudentRecordCard meta={CARD_META.total}   earned={earnedCredits}      required={requiredCredits}     imageUrl={images.total}   horizontal />
          <StudentRecordCard meta={CARD_META.major}   earned={major.earned}       required={major.required}      imageUrl={images.major}   horizontal />
          <StudentRecordCard meta={CARD_META.liberal} earned={liberalArts.earned} required={liberalArts.required} imageUrl={images.liberal} horizontal />
          <StudentRecordCard meta={CARD_META.gpa}     earned={gpa}                                               imageUrl={images.gpa}     horizontal />
        </div>
      </div>

      <WidgetFooter updatedTime={updatedTime} />
    </div>
  )
}
