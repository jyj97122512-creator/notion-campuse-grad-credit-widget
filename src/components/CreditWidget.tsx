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
  bgGrid: '#C8D4BC',
  card: '#F7F8F2',
  cardBorder: '#B8C8A8',
  headerGreen: '#7A9068',
  headerGreenDark: '#5C7A4E',
  accent: '#4A6640',
  accentLight: '#9AB08A',
  text: '#3A4A32',
  muted: '#6A8060',
  mutedLight: '#9AB890',
  progress: '#7A9068',
  progressBg: '#D0DAC4',
  footerBg: '#5C7A4E',
  footerText: '#EEF2E8',
  statusBg: '#F0F4E8',
  statusBorder: '#C0CEB0',
}

type Size = 'xs' | 'sm' | 'md' | 'lg'
function getSize(w: number): Size {
  if (w < 200) return 'xs'
  if (w < 400) return 'sm'
  if (w < 620) return 'md'
  return 'lg'
}

// ── 바코드 장식 (세로 선 패턴) ───────────────────
function Barcode({ vertical = false }: { vertical?: boolean }) {
  const bars = [3, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 3, 1, 2, 1]
  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: '1px',
      alignItems: 'center',
      opacity: 0.25,
    }}>
      {bars.map((w, i) => (
        <div key={i} style={{
          width: vertical ? '100%' : w,
          height: vertical ? w : '100%',
          background: C.accent,
          borderRadius: 0,
        }} />
      ))}
    </div>
  )
}

// ── 카드 행거 ─────────────────────────────────────
function CardHanger() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '-1px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* 줄 */}
      <div style={{ width: 2, height: 8, background: C.cardBorder }} />
      {/* 고리 */}
      <div style={{
        width: 14, height: 8,
        border: `1.5px solid ${C.cardBorder}`,
        borderRadius: '6px 6px 0 0',
        borderBottom: 'none',
        background: C.bg,
      }} />
    </div>
  )
}

// ── Student Record Card ───────────────────────────
function StudentRecordCard({
  label,
  sublabel,
  emoji,
  accentColor = C.headerGreen,
  earned,
  required,
  semesterName,
  imageUrl,
  compact = false,
}: {
  label: string
  sublabel: string
  emoji: string
  accentColor?: string
  earned: number | string
  required?: number
  semesterName?: string
  imageUrl?: string
  compact?: boolean
}) {
  const imgH = compact ? 60 : 110

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <CardHanger />
      <div style={{
        background: C.card,
        border: `1.5px solid ${C.cardBorder}`,
        borderRadius: '10px',
        overflow: 'hidden',
        width: '100%',
        boxShadow: '0 2px 8px rgba(60,80,50,0.08)',
      }}>
        {/* 헤더: STUDENT RECORD + 바코드 */}
        <div style={{
          background: accentColor,
          padding: compact ? '5px 10px' : '7px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ height: compact ? 16 : 20, flex: 1 }}>
            <Barcode />
          </div>
          <span style={{
            fontSize: compact ? '7px' : '8px',
            fontWeight: 700,
            color: C.footerText,
            letterSpacing: '0.14em',
            fontFamily: FONT.data,
            textAlign: 'center',
            flex: 2,
            whiteSpace: 'nowrap',
          }}>
            STUDENT RECORD
          </span>
          <div style={{ height: compact ? 16 : 20, flex: 1 }}>
            <Barcode />
          </div>
        </div>

        {/* 이미지 영역 */}
        <div style={{
          height: imgH,
          background: imageUrl
            ? `url(${imageUrl}) center/cover no-repeat`
            : `linear-gradient(160deg, #EDF2E6 0%, #E0EAD4 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: `1px solid ${C.cardBorder}`,
        }}>
          {/* 왼쪽 바코드 장식 */}
          <div style={{
            position: 'absolute', left: 6, top: 0, bottom: 0,
            width: 6,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{ height: '60%' }}><Barcode vertical /></div>
          </div>
          {!imageUrl && (
            <span style={{ fontSize: compact ? 28 : 44, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
              {emoji}
            </span>
          )}
        </div>

        {/* 수치 영역 */}
        <div style={{ padding: compact ? '8px 12px 0' : '12px 16px 0' }}>
          {/* 영문 레이블 */}
          <div style={{
            fontSize: compact ? '9px' : '11px',
            fontWeight: 800,
            color: C.accent,
            letterSpacing: '0.18em',
            fontFamily: FONT.data,
            textAlign: 'center',
            marginBottom: '1px',
          }}>
            {label}
          </div>
          {/* 한국어 서브레이블 */}
          <div style={{
            fontSize: compact ? '8px' : '9px',
            color: C.muted,
            fontFamily: FONT.deco,
            textAlign: 'center',
            marginBottom: compact ? '6px' : '8px',
          }}>
            {sublabel}
          </div>
          {/* 구분선 */}
          <div style={{ borderTop: `1px dashed ${C.cardBorder}`, marginBottom: compact ? '6px' : '8px' }} />
          {/* 숫자 */}
          <div style={{
            fontFamily: FONT.data,
            fontWeight: 700,
            color: C.text,
            fontSize: compact ? '20px' : '28px',
            lineHeight: 1,
            textAlign: 'center',
          }}>
            {earned}
            {required !== undefined && (
              <span style={{ fontSize: compact ? '12px' : '16px', color: C.mutedLight, fontWeight: 400 }}>
                &nbsp;/&nbsp;{required}
              </span>
            )}
          </div>
          {/* 취득/필요 or 학기명 */}
          <div style={{
            fontSize: compact ? '7px' : '9px',
            color: C.muted,
            fontFamily: FONT.data,
            textAlign: 'center',
            marginTop: '4px',
            marginBottom: compact ? '8px' : '10px',
            letterSpacing: '0.04em',
          }}>
            {semesterName ?? (required !== undefined ? '취득 / 필요' : '')}
          </div>
        </div>

        {/* 카드 푸터 */}
        <div style={{
          background: accentColor,
          padding: compact ? '4px' : '6px',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: compact ? '7px' : '8px',
            fontWeight: 700,
            color: C.footerText,
            letterSpacing: '0.2em',
            fontFamily: FONT.data,
          }}>
            CREDIT BUDDY
          </span>
        </div>
      </div>
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  return (
    <div>
      <div style={{ height: '10px', background: C.progressBg, borderRadius: '3px', overflow: 'hidden' }}>
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            background: C.progress,
            borderRadius: '3px',
            '--target-width': `${pct}%`,
          } as React.CSSProperties}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
        {['0%', '50%', '100%'].map(m => (
          <span key={m} style={{ fontSize: '8px', color: C.mutedLight, fontFamily: FONT.data }}>{m}</span>
        ))}
      </div>
    </div>
  )
}

interface Props {
  summary: CreditSummary
  title?: string
  updatedAt?: string
  images?: { total?: string; major?: string; liberal?: string; gpa?: string }
}

// ════════════════════════════════════════════════════
export default function CreditWidget({ summary, title = 'Credit Buddy', updatedAt, images = {} }: Props) {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } = summary
  const pct = Math.min(progressRate, 100)
  const gpa = currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>('lg')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(e => setSize(getSize(e[0].contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const updatedTime = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null

  const year = new Date().getFullYear()

  const bgStyle: React.CSSProperties = {
    background: C.bg,
    backgroundImage: `
      linear-gradient(${C.bgGrid}55 1px, transparent 1px),
      linear-gradient(90deg, ${C.bgGrid}55 1px, transparent 1px)
    `,
    backgroundSize: '24px 24px',
    borderRadius: '14px',
    fontFamily: FONT.data,
    width: '100%',
    boxSizing: 'border-box',
  }

  // ── xs ────────────────────────────────────────
  if (size === 'xs') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '12px' }}>
        <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.deco, marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: C.accent, fontFamily: FONT.data, lineHeight: 1, marginBottom: '6px' }}>{pct}%</div>
        <ProgressBar pct={pct} />
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[['전체', earnedCredits, requiredCredits], ['전공', major.earned, major.required], ['교양', liberalArts.earned, liberalArts.required]].map(([l, e, r]) => (
            <div key={String(l)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: FONT.data, color: C.text }}>
              <span style={{ color: C.muted }}>{l}</span>
              <span style={{ fontWeight: 700 }}>{e}<span style={{ color: C.mutedLight, fontWeight: 400 }}>/{r}</span></span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── 공통 헤더 ─────────────────────────────────
  const Header = (
    <div style={{ marginBottom: size === 'sm' ? 14 : 18, position: 'relative' }}>
      <div style={{ fontSize: '10px', color: C.muted, fontFamily: FONT.deco, marginBottom: '2px', letterSpacing: '0.04em' }}>
        今日も、未来の自分のために。
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: size === 'lg' ? 32 : size === 'md' ? 26 : 22,
          fontWeight: 900,
          color: C.accent,
          fontFamily: FONT.deco,
          letterSpacing: '0.02em',
          lineHeight: 1.1,
        }}>
          {title}
        </span>
        <span style={{
          fontSize: '10px', color: C.muted,
          border: `1px solid ${C.accentLight}`,
          borderRadius: '99px', padding: '2px 8px',
          fontFamily: FONT.data,
        }}>
          {year}
        </span>
      </div>
      <div style={{ fontSize: '10px', color: C.muted, marginTop: '3px', fontFamily: FONT.deco, letterSpacing: '0.04em' }}>
        キャンパスライフを、もっと自分らしく。
      </div>
    </div>
  )

  // ── 공통 진행률 카드 ───────────────────────────
  const ProgressCard = (
    <div style={{
      background: C.card,
      border: `1.5px solid ${C.cardBorder}`,
      borderRadius: '10px',
      padding: size === 'sm' ? '12px 14px' : '14px 20px',
      marginBottom: size === 'sm' ? 12 : 16,
      display: 'flex',
      alignItems: 'center',
      gap: size === 'sm' ? 10 : 16,
    }}>
      {/* 식물 아이콘 */}
      <span style={{ fontSize: size === 'sm' ? 24 : 32, flexShrink: 0 }}>🪴</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: '11px', color: C.muted, fontFamily: FONT.data, marginBottom: '2px' }}>卒業まで</div>
            <div style={{ fontSize: size === 'sm' ? 20 : 24, fontWeight: 800, color: C.text, fontFamily: FONT.deco, lineHeight: 1 }}>
              {remainingCredits}
              <span style={{ fontSize: size === 'sm' ? 13 : 15, fontWeight: 600, color: C.muted }}> 学点 残っています！</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '8px', color: C.muted, fontFamily: FONT.data, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              GRADUATION PROGRESS
            </div>
            <div style={{ fontSize: size === 'sm' ? 28 : 36, fontWeight: 700, color: C.accent, fontFamily: FONT.data, lineHeight: 1 }}>
              {pct}%
            </div>
          </div>
        </div>
        <ProgressBar pct={pct} />
      </div>
    </div>
  )

  // ── 공통 하단 바 ───────────────────────────────
  const BottomBar = (
    <div style={{ display: 'flex', gap: 8, marginTop: size === 'sm' ? 12 : 16, alignItems: 'stretch' }}>
      {/* 상태 메시지 */}
      <div style={{
        flex: 1,
        background: C.statusBg,
        border: `1.5px solid ${C.statusBorder}`,
        borderRadius: '8px',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: '14px' }}>🌿</span>
        <span style={{ fontSize: '11px', color: C.accent, fontFamily: FONT.deco, fontWeight: 600 }}>
          졸업까지 {remainingCredits}학점 남았어요
        </span>
        <span style={{ fontSize: '14px' }}>🌱</span>
      </div>
      {/* 업데이트 시간 */}
      <div style={{
        background: C.footerBg,
        borderRadius: '8px',
        padding: '8px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '8px', color: C.footerText, opacity: 0.7, letterSpacing: '0.1em', fontFamily: FONT.data }}>
            LAST UPDATED
          </span>
          {updatedTime && (
            <span style={{ fontSize: '9px', color: C.footerText, fontFamily: FONT.data, opacity: 0.9 }}>
              오늘 {updatedTime} 기준
            </span>
          )}
        </div>
        <div style={{ fontSize: '8px', color: C.footerText, opacity: 0.5, fontFamily: FONT.deco, letterSpacing: '0.04em' }}>
          EVERY DAY IS A STEP FORWARD.
        </div>
      </div>
    </div>
  )

  // ── sm ───────────────────────────────────────
  if (size === 'sm') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '16px' }}>
        {Header}
        {ProgressCard}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StudentRecordCard label="TOTAL CREDITS"  sublabel="전체 학점"      emoji="📚" earned={earnedCredits}      required={requiredCredits}     imageUrl={images.total}   compact />
          <StudentRecordCard label="MAJOR CREDITS"  sublabel="전공 학점"      emoji="🏛"  earned={major.earned}       required={major.required}      imageUrl={images.major}   compact />
          <StudentRecordCard label="LIBERAL ARTS"   sublabel="교양 학점"      emoji="🌿" earned={liberalArts.earned} required={liberalArts.required} imageUrl={images.liberal} compact />
          <StudentRecordCard label="SEMESTER GPA"   sublabel="이번 학기 평점" emoji="⭐" accentColor="#8F9E7A" earned={gpa} semesterName={currentSemester?.name} imageUrl={images.gpa} compact />
        </div>
        {BottomBar}
      </div>
    )
  }

  // ── md ───────────────────────────────────────
  if (size === 'md') {
    return (
      <div ref={containerRef} style={{ ...bgStyle, padding: '18px' }}>
        {Header}
        {ProgressCard}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <StudentRecordCard label="TOTAL CREDITS"  sublabel="전체 학점"      emoji="📚" earned={earnedCredits}      required={requiredCredits}     imageUrl={images.total}   />
          <StudentRecordCard label="MAJOR CREDITS"  sublabel="전공 학점"      emoji="🏛"  earned={major.earned}       required={major.required}      imageUrl={images.major}   />
          <StudentRecordCard label="LIBERAL ARTS"   sublabel="교양 학점"      emoji="🌿" earned={liberalArts.earned} required={liberalArts.required} imageUrl={images.liberal} />
          <StudentRecordCard label="SEMESTER GPA"   sublabel="이번 학기 평점" emoji="⭐" accentColor="#8F9E7A" earned={gpa} semesterName={currentSemester?.name} imageUrl={images.gpa} />
        </div>
        {BottomBar}
      </div>
    )
  }

  // ── lg ───────────────────────────────────────
  return (
    <div ref={containerRef} style={{ ...bgStyle, padding: '24px' }}>
      {Header}
      {ProgressCard}
      {/* 4장 가로 배열 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <StudentRecordCard label="TOTAL CREDITS"  sublabel="전체 학점"      emoji="📚" earned={earnedCredits}      required={requiredCredits}     imageUrl={images.total}   />
        <StudentRecordCard label="MAJOR CREDITS"  sublabel="전공 학점"      emoji="🏛"  earned={major.earned}       required={major.required}      imageUrl={images.major}   />
        <StudentRecordCard label="LIBERAL ARTS"   sublabel="교양 학점"      emoji="🌿" earned={liberalArts.earned} required={liberalArts.required} imageUrl={images.liberal} />
        <StudentRecordCard label="SEMESTER GPA"   sublabel="이번 학기 평점" emoji="⭐" accentColor="#8F9E7A" earned={gpa} semesterName={currentSemester?.name} imageUrl={images.gpa} />
      </div>
      {BottomBar}
    </div>
  )
}
