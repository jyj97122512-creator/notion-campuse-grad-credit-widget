'use client'

import { useState } from 'react'
import { WidgetConfig } from '@/types'

const C = {
  border: '#2E2E2E',
  main: '#6B8ECA',
  accent: '#F4A7B9',
  text: '#2B2B2B',
  muted: '#8A8A8A',
  card: '#FFFFFF',
  error: '#E05252',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: `2px solid ${C.border}`,
  borderRadius: '2px',
  fontSize: '13px',
  fontFamily: 'monospace',
  background: C.card,
  color: C.text,
  outline: 'none',
  marginTop: '4px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: C.text,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
}

interface Props {
  onSuccess: (config: WidgetConfig, embedUrl: string) => void
}

export default function SetupForm({ onSuccess }: Props) {
  const [form, setForm] = useState<WidgetConfig>({
    apiKey: '',
    graduationDbId: '',
    semesterDbId: '',
    title: 'Credit Buddy',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof WidgetConfig, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  // Notion DB URL → ID 변환 유틸
  function extractDbId(input: string): string {
    const match = input.match(/([a-f0-9]{32})/i)
    if (match) return match[1]
    return input.trim()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      apiKey: form.apiKey.trim(),
      graduationDbId: extractDbId(form.graduationDbId),
      semesterDbId: extractDbId(form.semesterDbId),
    }

    try {
      const res = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '연결에 실패했습니다.')
        return
      }

      // 임베드 URL 생성 (config를 base64로 인코딩)
      const encoded = btoa(
        JSON.stringify({
          k: payload.apiKey,
          g: payload.graduationDbId,
          s: payload.semesterDbId,
          t: form.title || 'Credit Buddy',
        })
      )
      const embedUrl = `${window.location.origin}/widget?c=${encoded}`
      onSuccess({ ...payload, title: form.title }, embedUrl)
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* API Key */}
      <div>
        <label style={labelStyle}>Notion API Key *</label>
        <input
          style={inputStyle}
          type="password"
          placeholder="secret_xxxxxxxxxxxxxxxxxxxx"
          value={form.apiKey}
          onChange={(e) => set('apiKey', e.target.value)}
          required
        />
        <p style={{ fontSize: '11px', color: C.muted, marginTop: '4px' }}>
          notion.so → 설정 → 연결 → 내 통합에서 발급한 Internal Integration Token
        </p>
      </div>

      {/* Graduation DB ID */}
      <div>
        <label style={labelStyle}>졸업요건 DB ID *</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="졸업요건 DB URL 또는 ID"
          value={form.graduationDbId}
          onChange={(e) => set('graduationDbId', e.target.value)}
          required
        />
      </div>

      {/* Semester DB ID */}
      <div>
        <label style={labelStyle}>학기 DB ID *</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="학기 DB URL 또는 ID"
          value={form.semesterDbId}
          onChange={(e) => set('semesterDbId', e.target.value)}
          required
        />
      </div>

      {/* Widget Title */}
      <div>
        <label style={labelStyle}>위젯 제목</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="Credit Buddy"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: '12px', color: C.error, border: `1px solid ${C.error}`, padding: '8px 12px', borderRadius: '2px' }}>
          ⚠ {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px',
          background: loading ? C.muted : C.main,
          color: '#fff',
          border: `2px solid ${C.border}`,
          borderRadius: '2px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        {loading ? '연결 확인 중...' : '연결 테스트 & 임베드 URL 생성'}
      </button>
    </form>
  )
}
