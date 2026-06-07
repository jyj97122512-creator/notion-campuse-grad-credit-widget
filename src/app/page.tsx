'use client'

import { useState } from 'react'
import SetupForm from '@/components/SetupForm'
import CreditWidget from '@/components/CreditWidget'
import { CreditSummary, WidgetConfig } from '@/types'

const C = {
  border: '#2E2E2E',
  main: '#6B8ECA',
  accent: '#F4A7B9',
  text: '#2B2B2B',
  muted: '#8A8A8A',
  card: '#FFFFFF',
  success: '#4CAF50',
}

const DEMO_SUMMARY: CreditSummary = {
  requiredCredits: 130,
  earnedCredits: 96,
  remainingCredits: 34,
  progressRate: 74,
  major: { required: 60, earned: 42 },
  liberalArts: { required: 35, earned: 28 },
  currentSemester: { name: '2026-1학기', gpa: 4.12 },
}

export default function SetupPage() {
  const [result, setResult] = useState<{ config: WidgetConfig; embedUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)

  function handleSuccess(config: WidgetConfig, embedUrl: string) {
    setResult({ config, embedUrl })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copyUrl() {
    if (!result) return
    await navigator.clipboard.writeText(result.embedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.text,
            margin: '0 0 8px',
          }}
        >
          Credit Buddy
        </h1>
        <p style={{ color: C.muted, fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          노션 졸업요건 DB에 연결하면 학점 현황을 위젯으로 확인할 수 있어요.
          <br />
          생성된 URL을 노션 페이지에 임베드하세요.
        </p>
      </div>

      {/* 성공 결과 */}
      {result && (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: C.card,
            border: `2px solid ${C.border}`,
            borderRadius: '4px',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 700, color: C.success, marginBottom: '12px' }}>
            ✓ 연결 성공! 아래 URL을 노션에 임베드하세요.
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <code
              style={{
                flex: 1,
                padding: '10px',
                background: '#F5F5F5',
                border: `1px solid ${C.border}`,
                borderRadius: '2px',
                fontSize: '11px',
                wordBreak: 'break-all',
                color: C.text,
              }}
            >
              {result.embedUrl}
            </code>
            <button
              onClick={copyUrl}
              style={{
                padding: '0 14px',
                background: copied ? '#4CAF50' : C.main,
                color: '#fff',
                border: `2px solid ${C.border}`,
                borderRadius: '2px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? '✓ 복사됨' : '복사'}
            </button>
          </div>
          <p style={{ fontSize: '11px', color: C.muted, marginTop: '8px' }}>
            노션 페이지에서 <code>/embed</code> → URL 붙여넣기
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '800px' }}>
        {/* Setup Form */}
        <div
          style={{
            flex: '1 1 320px',
            maxWidth: '420px',
            background: C.card,
            border: `2px solid ${C.border}`,
            borderRadius: '4px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px', color: C.text }}>
            설정
          </h2>
          <SetupForm onSuccess={handleSuccess} />
        </div>

        {/* Demo Preview */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p style={{ fontSize: '11px', color: C.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
            미리보기 (샘플 데이터)
          </p>
          <CreditWidget summary={DEMO_SUMMARY} />
        </div>
      </div>
    </main>
  )
}
