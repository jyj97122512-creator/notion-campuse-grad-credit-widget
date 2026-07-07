import { CreditSummary } from '@/types'
import { getStatusMessage } from './credit-calculator'

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

const FONT = 'DOSSaemmul, sans-serif'
const DECO  = 'ChosunGu, sans-serif'

const raised = (w = 2) =>
  `border:${w}px solid;border-color:#fff ${C.border} ${C.border} #fff`

const sunken = () =>
  `border:1px solid;border-color:${C.border} #fff #fff ${C.border}`

function winBtn(label: string) {
  return `<div style="width:18px;height:16px;display:flex;align-items:center;justify-content:center;background:${C.winBtn};${raised(1)};font-family:${FONT};font-size:10px;font-weight:900;color:${C.accentDark}">${label}</div>`
}

function statCard(label: string, earned: number | string, required?: number, compact = false) {
  const unset = typeof earned === 'number' && earned === 0 && required === 0
  const valueHtml = unset
    ? `<div style="font-size:12px;color:${C.muted};font-weight:700;font-family:${FONT}">미설정</div>`
    : `<div style="font-family:${FONT};font-weight:900;color:${C.text}">
        <span style="font-size:${compact ? 14 : 16}px;color:${C.accentDark}">${earned}</span>
        ${required !== undefined ? `<span style="font-size:10px;color:${C.muted}">/${required}</span>` : ''}
       </div>`

  return `<div style="background:${C.card};${raised(1)};padding:${compact ? '6px 8px' : '8px 10px'};flex:1;min-width:0">
    <div style="font-size:9px;color:${C.accent};font-weight:900;margin-bottom:4px;font-family:${FONT};letter-spacing:0.3px">${label}</div>
    <div style="border-top:1px dotted ${C.border};margin-bottom:5px"></div>
    ${valueHtml}
  </div>`
}

function progressBar(pct: number) {
  return `<div style="display:flex;flex-direction:column;gap:3px">
    <div style="${sunken()};background:#fff;height:16px;padding:2px;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:repeating-linear-gradient(90deg,${C.progFill} 0,${C.progFill} 8px,#fff 0,#fff 10px)"></div>
    </div>
    <div style="display:flex;justify-content:space-between">
      <span style="font-size:7px;color:${C.muted};font-family:${FONT}">0%</span>
      <span style="font-size:7px;color:${C.muted};font-family:${FONT}">50%</span>
      <span style="font-size:7px;color:${C.muted};font-family:${FONT}">100%</span>
    </div>
  </div>`
}

export function renderWidgetHtml(summary: CreditSummary, title: string, updatedAt: string): string {
  const { requiredCredits, earnedCredits, remainingCredits, progressRate, major, liberalArts, currentSemester } = summary
  const pct = Math.min(progressRate, 100)
  const updatedTime = new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  const gpa = currentSemester?.gpa != null ? currentSemester.gpa.toFixed(2) : '—'

  const widget = `
<div style="${raised(2)};background:${C.bg};width:290px;box-sizing:border-box;font-family:${FONT}">

  <!-- Title Bar -->
  <div style="background:linear-gradient(180deg,#f1ffd7,#cfeaa3 45%,#9fca65);border-bottom:1px solid ${C.darkBorder};height:28px;display:flex;align-items:center;justify-content:space-between;padding:0 5px 0 8px;flex-shrink:0">
    <div style="display:flex;align-items:center;gap:6px">
      <span style="font-size:13px;filter:drop-shadow(1px 1px 0 #fff)">🎓</span>
      <span style="font-size:12px;font-weight:900;color:${C.accentDark};letter-spacing:0.5px;font-family:${FONT};text-shadow:1px 1px 0 rgba(255,255,255,0.8)">${title}</span>
    </div>
    <div style="display:flex;gap:3px">
      ${winBtn('_')}${winBtn('□')}${winBtn('×')}
    </div>
  </div>

  <!-- Body -->
  <div style="padding:8px;display:flex;flex-direction:column;gap:6px">

    <!-- Progress -->
    <div style="${sunken()};background:${C.card};padding:8px 10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-size:9px;color:${C.muted};font-family:${FONT};margin-bottom:2px">졸업까지</div>
          <div style="font-size:16px;font-weight:900;color:${C.accentDark};line-height:1;font-family:${FONT}">
            ${remainingCredits}<span style="font-size:10px;font-weight:700;color:${C.muted}"> 학점 남았어요!</span>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:7px;color:${C.muted};letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT}">GRADUATION</div>
          <div style="font-size:22px;font-weight:900;font-family:${FONT};color:${C.accent};line-height:1">${pct}%</div>
        </div>
      </div>
      ${progressBar(pct)}
    </div>

    <!-- 2x2 Stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
      ${statCard('■ 전체 학점', earnedCredits, requiredCredits)}
      ${statCard('■ 전공 학점', major.earned, major.required)}
      ${statCard('■ 교양 학점', liberalArts.earned, liberalArts.required)}
      ${statCard('■ 이번 학기 평점', gpa, undefined, true)}
    </div>

    <!-- Status -->
    <div style="${sunken()};background:${C.card};padding:5px 8px;display:flex;align-items:center">
      <span style="font-size:9px;color:${C.accent};font-family:${DECO}">${getStatusMessage(remainingCredits)}</span>
    </div>

  </div>

  <!-- Status Bar -->
  <div style="border-top:1px solid #b0be90;background:${C.statusBg};height:26px;display:flex;align-items:center;padding:0 6px;gap:6px">
    <div style="height:19px;display:flex;align-items:center;padding:0 6px;flex:1;overflow:hidden;background:${C.listBg};${sunken()}">
      <span style="font-size:9px;color:${C.muted};font-family:${FONT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Last Updated: ${updatedTime}</span>
    </div>
    <div style="height:19px;display:flex;align-items:center;padding:0 6px;flex-shrink:0;background:${C.listBg};${sunken()}">
      <span style="font-size:8px;color:${C.accent};font-family:${DECO};letter-spacing:0.3px">EVERY DAY IS A STEP FORWARD.</span>
    </div>
  </div>

</div>`

  return widget
}

const CSS = `
  html,body{margin:0;padding:0;background:#eef3db;min-height:400px;overflow-y:visible;-webkit-text-size-adjust:none}
  @font-face{font-family:DOSSaemmul;src:url('/fonts/DOSSaemmul.woff2') format('woff2'),url('/fonts/DOSSaemmul.ttf') format('truetype');font-display:swap}
  @font-face{font-family:ChosunGu;src:url('/fonts/ChosunGu.woff2') format('woff2'),url('/fonts/ChosunGu.ttf') format('truetype');font-display:swap}
`

export function wrapHtmlDocument(body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${CSS}</style>
</head>
<body><div style="padding:16px;min-height:380px;background:#eef3db;box-sizing:border-box;display:inline-block">${body}</div></body>
</html>`
}

export function errorHtmlDocument(message: string): string {
  const body = `<div style="border:2px solid;border-color:#fff #9caf73 #9caf73 #fff;background:#f5f7e7;padding:20px">
  <p style="font-size:12px;color:#8B4040;margin:0;font-family:DOSSaemmul,sans-serif">⚠ ${message}</p>
</div>`
  return wrapHtmlDocument(body)
}
