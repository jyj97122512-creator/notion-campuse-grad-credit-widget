import { CreditSummary } from '@/types'
import { getStatusMessage } from '@/lib/credit-calculator'

const FONT = {
  main: 'DOSSaemmul, sans-serif',
  deco: 'ChosunGu, sans-serif',
}

const C = {
  bg: '#eef3db',
  card: '#f5f7e7',
  listBg: '#f0f2df',
  border: '#9caf73',
  darkBorder: '#7f965b',
  text: '#29331d',
  muted: '#7d856e',
  accent: '#526733',
  accentDark: '#153209',
  winBtn: '#d4e8aa',
  statusBg: '#e8efcc',
  progFill: '#5a8028',
}

const raised = (w = 2): React.CSSProperties => ({
  borderStyle: 'solid',
  borderWidth: `${w}px`,
  borderColor: `#fff ${C.border} ${C.border} #fff`,
})

const sunken = (): React.CSSProperties => ({
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: `${C.border} #fff #fff ${C.border}`,
})

function WinButton({ label }: { label: string }) {
  return (
    <div style={{
      width: '18px', height: '16px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: C.winBtn, fontFamily: FONT.main,
      fontSize: '10px', fontWeight: 900, color: C.accentDark,
      ...raised(1),
    }}>
      {label}
    </div>
  )
}

function StatCard({
  label, earned, required, compact = false,
}: {
  label: string
  earned: number | string
  required?: number
  compact?: boolean
}) {
  const unset = typeof earned === 'number' && earned === 0 && required === 0

  return (
    <div style={{
      background: C.card,
      ...raised(1),
      padding: compact ? '6px 8px' : '8px 10px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontSize: '9px', color: C.accent, fontWeight: 900, marginBottom: '4px', fontFamily: FONT.main, letterSpacing: '0.3px' }}>
        {label}
      </div>
      <div style={{ borderTop: `1px dotted ${C.border}`, marginBottom: '5px' }} />
      {unset ? (
        <div style={{ fontSize: '12px', color: C.muted, fontWeight: 700, fontFamily: FONT.main }}>미설정</div>
      ) : (
        <div style={{ fontFamily: FONT.main, fontWeight: 900, color: C.text }}>
          <span style={{ fontSize: compact ? '14px' : '16px', color: C.accentDark }}>
            {earned}
          </span>
          {required !== undefined && (
            <span style={{ fontSize: '10px', color: C.muted }}>/{required}</span>
          )}
        </div>
      )}
    </div>
  )
}

function Win98Progress({ pct }: { pct: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ ...sunken(), background: '#fff', height: '16px', padding: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `repeating-linear-gradient(90deg, ${C.progFill} 0, ${C.progFill} 8px, #fff 0, #fff 10px)`,
          transition: 'width 1s linear',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {['0%', '50%', '100%'].map(m => (
          <span key={m} style={{ fontSize: '7px', color: C.muted, fontFamily: FONT.main }}>{m}</span>
        ))}
      </div>
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

  const updatedTime = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div style={{ ...raised(2), background: C.bg, width: '290px', boxSizing: 'border-box' as const, fontFamily: FONT.main }}>

      {/* Title Bar */}
      <div style={{
        background: `linear-gradient(180deg, #f1ffd7, #cfeaa3 45%, #9fca65)`,
        borderBottom: `1px solid ${C.darkBorder}`,
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5px 0 8px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', filter: 'drop-shadow(1px 1px 0 #fff)' }}>🎓</span>
          <span style={{ fontSize: '12px', fontWeight: 900, color: C.accentDark, letterSpacing: '0.5px', fontFamily: FONT.main, textShadow: '1px 1px 0 rgba(255,255,255,0.8)' }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          <WinButton label="_" />
          <WinButton label="□" />
          <WinButton label="×" />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>

        {/* Progress Section */}
        <div style={{ ...sunken(), background: C.card, padding: '8px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '9px', color: C.muted, fontFamily: FONT.main, marginBottom: '2px' }}>졸업까지</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: C.accentDark, lineHeight: 1, fontFamily: FONT.main }}>
                {remainingCredits}
                <span style={{ fontSize: '10px', fontWeight: 700, color: C.muted }}> 학점 남았어요!</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '7px', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.main }}>GRADUATION</div>
              <div style={{ fontSize: '22px', fontWeight: 900, fontFamily: FONT.main, color: C.accent, lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
          <Win98Progress pct={pct} />
        </div>

        {/* 2x2 Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <StatCard label="■ 전체 학점" earned={earnedCredits} required={requiredCredits} />
          <StatCard label="■ 전공 학점" earned={major.earned} required={major.required} />
          <StatCard label="■ 교양 학점" earned={liberalArts.earned} required={liberalArts.required} />
          <StatCard label="■ 이번 학기 평점" earned={currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'} compact />
        </div>

        {/* Status Message */}
        <div style={{ ...sunken(), background: C.card, padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', color: C.accent, fontFamily: FONT.deco }}>
            {getStatusMessage(remainingCredits)}
          </span>
        </div>

      </div>

      {/* Status Bar */}
      <div style={{
        borderTop: `1px solid #b0be90`,
        background: C.statusBg,
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6px',
        gap: '6px',
      }}>
        <div style={{
          height: '19px', display: 'flex', alignItems: 'center', gap: '4px',
          padding: '0 6px', flex: 1, overflow: 'hidden',
          background: C.listBg, ...sunken(),
        }}>
          <span style={{ fontSize: '9px', color: C.muted, fontFamily: FONT.main, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {updatedTime ? `Last Updated: ${updatedTime}` : 'Credit Buddy'}
          </span>
        </div>
        <div style={{
          height: '19px', display: 'flex', alignItems: 'center',
          padding: '0 6px', flexShrink: 0,
          background: C.listBg, ...sunken(),
        }}>
          <span style={{ fontSize: '8px', color: C.accent, fontFamily: FONT.deco, letterSpacing: '0.3px' }}>
            EVERY DAY IS A STEP FORWARD.
          </span>
        </div>
      </div>

    </div>
  )
}
