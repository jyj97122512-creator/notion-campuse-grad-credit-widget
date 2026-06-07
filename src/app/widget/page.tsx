'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import CreditWidget from '@/components/CreditWidget'
import { CreditSummary } from '@/types'

function WidgetContent() {
  const params = useSearchParams()
  const [summary, setSummary] = useState<CreditSummary | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('Credit Buddy')
  const [config, setConfig] = useState<{ images?: { total?: string; major?: string; liberal?: string; gpa?: string } }>({})

  const fetchData = useCallback(async (cfg: { k: string; g: string; s: string; t?: string; images?: Record<string, string> }) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: cfg.k,
          graduationDbId: cfg.g,
          semesterDbId: cfg.s,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSummary(data.summary)
      setUpdatedAt(data.updatedAt)
      if (cfg.t) setTitle(cfg.t)
      if (cfg.images) setConfig({ images: cfg.images as any })
    } catch (e: any) {
      setError(e.message ?? '데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const encoded = params.get('c')
    if (!encoded) {
      setError('설정이 없습니다. 먼저 설정 페이지에서 임베드 URL을 생성하세요.')
      setLoading(false)
      return
    }

    try {
      const config = JSON.parse(atob(encoded))
      fetchData(config)

      // 30분마다 자동 갱신
      const interval = setInterval(() => fetchData(config), 30 * 60 * 1000)
      return () => clearInterval(interval)
    } catch {
      setError('설정 정보가 올바르지 않습니다.')
      setLoading(false)
    }
  }, [params, fetchData])

  if (loading) {
    return (
      <div
        style={{
          width: 320,
          minHeight: 240,
          background: '#E8EDE0',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>🌿</span>
        <p style={{ fontSize: 12, color: '#7A9170', margin: 0 }}>학점 정보를 불러오는 중…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          width: 320,
          background: '#E8EDE0',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <p style={{ fontSize: 12, color: '#8B4040', margin: 0 }}>⚠ {error}</p>
      </div>
    )
  }

  if (!summary) return null

  return <CreditWidget summary={summary} title={title} updatedAt={updatedAt} images={config?.images} />
}

export default function WidgetPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '16px',
        background: 'transparent',
      }}
    >
      <Suspense fallback={<div style={{ color: '#8A8A8A', fontSize: 12 }}>로딩 중…</div>}>
        <WidgetContent />
      </Suspense>
    </div>
  )
}
