'use client'

import { useState } from 'react'
import { DatabaseInfo, PropertyInfo, GradDbMapping, SemDbMapping } from '@/types'

// ── 색상 ─────────────────────────────────────────
const C = {
  bg: '#F5F7F1',
  border: '#C8D4BC',
  borderDark: '#8FAE83',
  accent: '#4A6640',
  accentMid: '#6B8A5E',
  accentLight: '#A8BC98',
  text: '#2E3B28',
  muted: '#7A9170',
  mutedLight: '#9AAD8E',
  card: '#FFFFFF',
  error: '#8B4040',
  errorBg: '#FDF0F0',
  success: '#3A6B35',
  successBg: '#EDF5EB',
  step: '#D4DCC8',
}

// ── 공통 스타일 ────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: `1.5px solid ${C.border}`,
  borderRadius: '6px',
  fontSize: '13px',
  background: C.card,
  color: C.text,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: C.accent,
  letterSpacing: '0.06em',
  marginBottom: '5px',
}

const btnPrimary: React.CSSProperties = {
  width: '100%',
  padding: '11px',
  background: C.accentMid,
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
  letterSpacing: '0.04em',
}

const btnSecondary: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  color: C.muted,
  border: `1.5px solid ${C.border}`,
  borderRadius: '6px',
  fontSize: '12px',
  cursor: 'pointer',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%237A9170' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
}

// ── 자동 탐색 키워드 ──────────────────────────────
const GRAD_KEYWORDS = ['졸업', '요건', 'graduation', 'requirement']
const SEM_KEYWORDS  = ['학기', 'semester', 'term']

function autoDetectDb(databases: DatabaseInfo[]) {
  const lower = (s: string) => s.toLowerCase()
  const grad = databases.find(db => GRAD_KEYWORDS.some(k => lower(db.title).includes(k)))
  const sem  = databases.find(db => SEM_KEYWORDS.some(k => lower(db.title).includes(k)))
  return { grad: grad ?? null, sem: sem ?? null }
}

function autoDetectGradMapping(props: PropertyInfo[]): GradDbMapping {
  const find = (types: string[], keywords: string[]) =>
    props.find(p =>
      types.includes(p.type) &&
      keywords.some(k => p.name.toLowerCase().includes(k))
    )?.name ?? ''

  const titleProp = props.find(p => p.type === 'title')?.name ?? ''
  const categoryProp = find(['select', 'multi_select'], ['구분', '분류', 'category', 'type'])
  const requiredProp = find(['number'], ['필요', 'required', '기준', '이수필요'])
  const earnedProp = find(['number', 'rollup', 'formula'], ['이수', '취득', 'earned', 'completed', '완료'])

  return {
    nameProp: titleProp,
    categoryProp,
    requiredCreditsProp: requiredProp,
    earnedCreditsProp: earnedProp,
  }
}

function autoDetectSemMapping(props: PropertyInfo[]): SemDbMapping {
  const find = (types: string[], keywords: string[]) =>
    props.find(p =>
      types.includes(p.type) &&
      keywords.some(k => p.name.toLowerCase().includes(k))
    )?.name ?? ''

  const titleProp = props.find(p => p.type === 'title')?.name ?? ''
  const statusProp = find(['status', 'select'], ['상태', 'status'])
  const gpaProp = find(['number', 'formula'], ['평점', 'gpa', '학점평균']) || null

  return {
    nameProp: titleProp,
    statusProp,
    currentStatusValue: '진행 중',
    gpaProp,
  }
}

// ── 단계 표시기 ──────────────────────────────────
function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = ['Notion 연결', 'DB 선택', '속성 매핑', '완료']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px' }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < steps.length ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: done ? C.accentMid : active ? C.accent : C.step,
                color: done || active ? '#fff' : C.muted,
                fontSize: '11px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done ? '✓' : n}
              </div>
              <span style={{ fontSize: '9px', color: active ? C.accent : C.muted, fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {n < steps.length && (
              <div style={{ flex: 1, height: '1.5px', background: done ? C.accentMid : C.step, margin: '0 4px', marginBottom: '14px' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── DB 드롭다운 ──────────────────────────────────
function DbSelect({ label, hint, databases, value, onChange }: {
  label: string; hint?: string; databases: DatabaseInfo[]; value: string; onChange: (id: string) => void
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 5px' }}>{hint}</p>}
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        <option value="">— 선택하세요 —</option>
        {databases.map(db => (
          <option key={db.id} value={db.id}>{db.title}</option>
        ))}
      </select>
    </div>
  )
}

// ── 속성 드롭다운 ──────────────────────────────────
function PropSelect({ label, hint, properties, value, onChange, optional = false, filterTypes }: {
  label: string; hint?: string; properties: PropertyInfo[]; value: string
  onChange: (name: string) => void; optional?: boolean; filterTypes?: string[]
}) {
  const filtered = filterTypes ? properties.filter(p => filterTypes.includes(p.type)) : properties
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {optional && <span style={{ fontWeight: 400, color: C.muted, marginLeft: 4 }}>(선택)</span>}
      </label>
      {hint && <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 5px' }}>{hint}</p>}
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        {optional && <option value="">— 사용 안 함 —</option>}
        {!optional && <option value="">— 선택하세요 —</option>}
        {filtered.map(p => (
          <option key={p.id} value={p.name}>{p.name} <span style={{ color: C.muted }}>({p.type})</span></option>
        ))}
      </select>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 700, color: C.accent, letterSpacing: '0.05em', margin: '4px 0 10px', textTransform: 'uppercase' }}>
      {children}
    </p>
  )
}

// ── Props ──────────────────────────────────────────
interface Props {
  onSuccess: (embedUrl: string) => void
}

// ════════════════════════════════════════════════════
export default function SetupForm({ onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [apiKey, setApiKey] = useState('')
  const [databases, setDatabases] = useState<DatabaseInfo[]>([])
  const [graduationDbId, setGraduationDbId] = useState('')
  const [semesterDbId, setSemesterDbId] = useState('')
  const [title, setTitle] = useState('Credit Buddy')

  const [gradProps, setGradProps] = useState<PropertyInfo[]>([])
  const [semProps, setSemProps] = useState<PropertyInfo[]>([])
  const [gradMapping, setGradMapping] = useState<GradDbMapping>({ nameProp: '', categoryProp: '', requiredCreditsProp: '', earnedCreditsProp: '' })
  const [semMapping, setSemMapping] = useState<SemDbMapping>({ nameProp: '', statusProp: '', currentStatusValue: '진행 중', gpaProp: null })

  const [embedUrl, setEmbedUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Step 1: API Key → DB 목록 ─────────────────────
  async function handleConnect() {
    if (!apiKey.trim()) { setError('Notion API 키를 입력해주세요.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/notion/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const dbs: DatabaseInfo[] = data.databases
      setDatabases(dbs)
      const { grad, sem } = autoDetectDb(dbs)
      if (grad) setGraduationDbId(grad.id)
      if (sem) setSemesterDbId(sem.id)
      setStep(2)
    } catch (e: any) {
      setError(e.message ?? '연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: DB 선택 → 속성 목록 로드 ──────────────
  async function handleLoadProperties() {
    if (!graduationDbId) { setError('졸업요건 DB를 선택해주세요.'); return }
    if (!semesterDbId)   { setError('학기 DB를 선택해주세요.'); return }
    setLoading(true); setError('')
    try {
      const [gradRes, semRes] = await Promise.all([
        fetch('/api/notion/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: apiKey.trim(), dbId: graduationDbId }),
        }),
        fetch('/api/notion/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: apiKey.trim(), dbId: semesterDbId }),
        }),
      ])
      const gradData = await gradRes.json()
      const semData = await semRes.json()
      if (!gradRes.ok) throw new Error(gradData.error)
      if (!semRes.ok) throw new Error(semData.error)

      const gProps: PropertyInfo[] = gradData.properties
      const sProps: PropertyInfo[] = semData.properties
      setGradProps(gProps)
      setSemProps(sProps)
      setGradMapping(autoDetectGradMapping(gProps))
      setSemMapping(autoDetectSemMapping(sProps))
      setStep(3)
    } catch (e: any) {
      setError(e.message ?? '속성 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: 매핑 → configId 생성 ─────────────────
  async function handleGenerate() {
    if (!gradMapping.categoryProp) { setError('졸업요건 DB의 구분/카테고리 속성을 선택해주세요.'); return }
    if (!gradMapping.requiredCreditsProp) { setError('졸업요건 DB의 필요 학점 속성을 선택해주세요.'); return }
    if (!gradMapping.earnedCreditsProp) { setError('졸업요건 DB의 이수 학점 속성을 선택해주세요.'); return }
    if (!semMapping.statusProp) { setError('학기 DB의 진행 상태 속성을 선택해주세요.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), graduationDbId, semesterDbId, title, gradMapping, semMapping }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const url = `${window.location.origin}/widget?config=${data.configId}`
      setEmbedUrl(url)
      setStep(4)
      onSuccess(url)
    } catch (e: any) {
      setError(e.message ?? 'URL 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(embedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const { grad: autoGrad, sem: autoSem } = databases.length ? autoDetectDb(databases) : { grad: null, sem: null }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <StepIndicator current={step} />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: C.bg, borderRadius: '8px', padding: '14px', fontSize: '12px', color: C.muted, lineHeight: 1.6 }}>
            <strong style={{ color: C.accent, display: 'block', marginBottom: '4px' }}>🔑 Notion 연결하기</strong>
            <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer"
              style={{ color: C.accentMid, textDecoration: 'underline' }}>
              notion.so/my-integrations
            </a>
            {' '}에서 새 통합을 만들고, 졸업요건 DB와 학기 DB에 연결 권한을 부여한 뒤 API 키를 붙여넣으세요.
          </div>
          <div>
            <label style={labelStyle}>Notion API 키</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="secret_xxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleConnect()}
              autoComplete="off"
            />
          </div>
          {error && <ErrorBox msg={error} />}
          <button onClick={handleConnect} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? '연결 확인 중…' : 'Notion 연결하기'}
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(autoGrad || autoSem) && (
            <div style={{ background: C.successBg, border: `1px solid ${C.accentLight}`, borderRadius: '8px', padding: '10px 14px', fontSize: '11px', color: C.success }}>
              ✓ DB를 자동으로 찾았어요. 확인 후 다음 단계로 이동하세요.
            </div>
          )}
          <DbSelect
            label="졸업요건 DB"
            hint={autoGrad ? `자동 감지: ${autoGrad.title}` : undefined}
            databases={databases}
            value={graduationDbId}
            onChange={id => { setGraduationDbId(id); setError('') }}
          />
          <DbSelect
            label="학기 DB"
            hint={autoSem ? `자동 감지: ${autoSem.title}` : undefined}
            databases={databases}
            value={semesterDbId}
            onChange={id => { setSemesterDbId(id); setError('') }}
          />
          <div>
            <label style={labelStyle}>위젯 제목 (선택)</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="Credit Buddy"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          {error && <ErrorBox msg={error} />}
          <button onClick={handleLoadProperties} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? '속성 불러오는 중…' : '다음 — 속성 설정'}
          </button>
          <button onClick={() => { setStep(1); setError('') }} style={btnSecondary}>← 이전으로</button>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: C.bg, borderRadius: '8px', padding: '10px 14px', fontSize: '11px', color: C.muted, lineHeight: 1.6 }}>
            각 DB에서 위젯에 표시할 속성을 선택해주세요. 자동으로 감지된 속성은 미리 선택되어 있어요.
          </div>

          {/* 졸업요건 DB 매핑 */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionTitle>졸업요건 DB 속성</SectionTitle>
            <PropSelect
              label="구분 / 카테고리"
              hint="전공·교양 등 학점 분류를 담은 속성"
              properties={gradProps}
              value={gradMapping.categoryProp}
              onChange={v => setGradMapping(m => ({ ...m, categoryProp: v }))}
              filterTypes={['select', 'multi_select']}
            />
            <PropSelect
              label="필요 학점"
              hint="각 요건의 이수 필요 학점 (숫자)"
              properties={gradProps}
              value={gradMapping.requiredCreditsProp}
              onChange={v => setGradMapping(m => ({ ...m, requiredCreditsProp: v }))}
              filterTypes={['number']}
            />
            <PropSelect
              label="이수 학점"
              hint="실제 취득한 학점 (숫자, 롤업, 수식)"
              properties={gradProps}
              value={gradMapping.earnedCreditsProp}
              onChange={v => setGradMapping(m => ({ ...m, earnedCreditsProp: v }))}
              filterTypes={['number', 'rollup', 'formula']}
            />
          </div>

          {/* 학기 DB 매핑 */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionTitle>학기 DB 속성</SectionTitle>
            <PropSelect
              label="진행 상태"
              hint="현재 학기를 나타내는 상태 속성"
              properties={semProps}
              value={semMapping.statusProp}
              onChange={v => setSemMapping(m => ({ ...m, statusProp: v }))}
              filterTypes={['status', 'select']}
            />
            <div>
              <label style={labelStyle}>진행 중 상태값</label>
              <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 5px' }}>위 속성에서 "현재 학기"를 나타내는 값</p>
              <input
                style={inputStyle}
                type="text"
                placeholder="진행 중"
                value={semMapping.currentStatusValue}
                onChange={e => setSemMapping(m => ({ ...m, currentStatusValue: e.target.value }))}
              />
            </div>
            <PropSelect
              label="학기 평점"
              properties={semProps}
              value={semMapping.gpaProp ?? ''}
              onChange={v => setSemMapping(m => ({ ...m, gpaProp: v || null }))}
              filterTypes={['number', 'formula']}
              optional
            />
          </div>

          {error && <ErrorBox msg={error} />}
          <button onClick={handleGenerate} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? '위젯 URL 생성 중…' : '위젯 만들기'}
          </button>
          <button onClick={() => { setStep(2); setError('') }} style={btnSecondary}>← 이전으로</button>
        </div>
      )}

      {/* ── STEP 4 ── */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: C.successBg, border: `1px solid ${C.accentLight}`, borderRadius: '8px', padding: '14px', fontSize: '12px', color: C.success, lineHeight: 1.6 }}>
            <strong style={{ display: 'block', marginBottom: '4px' }}>✓ 위젯이 준비됐어요!</strong>
            아래 URL을 노션 페이지에서 <code style={{ background: '#fff', padding: '1px 5px', borderRadius: '3px', fontSize: '11px' }}>/embed</code> 명령으로 붙여넣으세요.
          </div>
          <div>
            <label style={labelStyle}>임베드 URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <code style={{
                flex: 1, padding: '10px 12px', background: C.bg,
                border: `1.5px solid ${C.border}`, borderRadius: '6px',
                fontSize: '11px', wordBreak: 'break-all', color: C.text, lineHeight: 1.5,
              }}>
                {embedUrl}
              </code>
              <button onClick={copyUrl} style={{ ...btnPrimary, width: 'auto', padding: '0 16px', whiteSpace: 'nowrap', background: copied ? C.success : C.accentMid }}>
                {copied ? '✓ 복사됨' : '복사'}
              </button>
            </div>
          </div>
          <div style={{ background: C.bg, borderRadius: '8px', padding: '12px 14px', fontSize: '11px', color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color: C.accent }}>사용 방법</strong><br />
            1. 노션 페이지에서 <code style={{ background: '#fff', padding: '1px 4px', borderRadius: '3px' }}>/embed</code> 입력<br />
            2. URL 붙여넣기 → Embed link 클릭<br />
            3. 위젯 크기를 원하는 대로 조절
          </div>
          <button onClick={() => { setStep(3); setError('') }} style={btnSecondary}>← 속성 다시 설정</button>
        </div>
      )}
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ background: C.errorBg, border: `1px solid #E0B0B0`, borderRadius: '6px', padding: '10px 12px', fontSize: '12px', color: C.error }}>
      ⚠ {msg}
    </div>
  )
}
