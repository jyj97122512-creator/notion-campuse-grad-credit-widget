'use client'

import { useState } from 'react'
import SetupForm from '@/components/SetupForm'
import CreditWidget from '@/components/CreditWidget'
import { CreditSummary } from '@/types'

const C = {
  text: '#2E3B28',
  muted: '#7A9170',
  accent: '#4A6640',
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
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)

  return (
    <main style={{
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '36px',
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text, margin: '0 0 8px' }}>
          Credit Buddy
        </h1>
        <p style={{ color: C.muted, fontSize: '13px', margin: 0, lineHeight: 1.7 }}>
          Notion 학점 관리 DB를 연결하면 졸업까지 남은 학점을 위젯으로 확인할 수 있어요.
        </p>
      </div>

      {/* 메인 레이아웃 */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '840px',
      }}>
        {/* 설정 폼 */}
        <div style={{
          flex: '1 1 340px',
          maxWidth: '440px',
          background: '#FFFFFF',
          border: '1.5px solid #C8D4BC',
          borderRadius: '12px',
          padding: '28px 24px',
          boxShadow: '0 2px 12px rgba(74,102,64,0.07)',
        }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px', color: C.accent }}>
            위젯 설정
          </h2>
          <SetupForm onSuccess={(url) => setEmbedUrl(url)} />
        </div>

        {/* 미리보기 */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p style={{ fontSize: '11px', color: C.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
            미리보기 (샘플 데이터)
          </p>
          <CreditWidget summary={DEMO_SUMMARY} />
          {embedUrl && (
            <p style={{ fontSize: '11px', color: '#3A6B35', margin: 0, textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>
              ✓ 위 미리보기와 동일한 위젯이 노션에 임베드돼요
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
