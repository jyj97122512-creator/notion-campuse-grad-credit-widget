import { decryptConfig } from '@/lib/crypto'
import { fetchGraduationRequirements, fetchSemesters } from '@/lib/notion'
import { calculateCreditSummary } from '@/lib/credit-calculator'
import { SavedConfig } from '@/types'
import CreditWidget from '@/components/CreditWidget'

export const dynamic = 'force-dynamic'

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: { config?: string; c?: string }
}) {
  const configId = searchParams.config
  const legacy   = searchParams.c

  // ── 새 방식: configId ────────────────────────────
  if (configId) {
    try {
      const config = decryptConfig(configId) as SavedConfig
      const { apiKey, graduationDbId, semesterDbId, gradMapping, semMapping } = config

      const [requirements, semesters] = await Promise.all([
        fetchGraduationRequirements(apiKey, graduationDbId, gradMapping),
        fetchSemesters(apiKey, semesterDbId, semMapping),
      ])

      const summary = calculateCreditSummary(
        requirements,
        semesters,
        gradMapping?.majorValues ?? [],
        gradMapping?.liberalArtsValues ?? [],
        semMapping?.currentStatusValue ?? '진행 중'
      )

      return (
        <WidgetShell>
          <CreditWidget summary={summary} title={config.title} updatedAt={new Date().toISOString()} />
        </WidgetShell>
      )
    } catch {
      return <WidgetError message="설정이 만료되었거나 올바르지 않습니다." />
    }
  }

  // ── 레거시: base64 config ────────────────────────
  if (legacy) {
    try {
      const config = JSON.parse(Buffer.from(legacy, 'base64').toString())
      const [requirements, semesters] = await Promise.all([
        fetchGraduationRequirements(config.k, config.g),
        fetchSemesters(config.k, config.s),
      ])
      const summary = calculateCreditSummary(requirements, semesters)
      return (
        <WidgetShell>
          <CreditWidget summary={summary} title={config.t ?? 'Credit Buddy'} updatedAt={new Date().toISOString()} />
        </WidgetShell>
      )
    } catch {
      return <WidgetError message="설정 정보가 올바르지 않습니다." />
    }
  }

  return <WidgetError message="설정이 없습니다. 설정 페이지에서 임베드 URL을 생성하세요." />
}

function WidgetShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px',
      background: '#eef3db',
      minHeight: '380px',
      boxSizing: 'border-box',
      display: 'inline-block',
    }}>
      {children}
    </div>
  )
}

function WidgetError({ message }: { message: string }) {
  return (
    <div style={{ padding: '16px', minHeight: '380px', background: '#eef3db', boxSizing: 'border-box' }}>
      <div style={{
        borderStyle: 'solid', borderWidth: '2px',
        borderColor: '#fff #9caf73 #9caf73 #fff',
        background: '#f5f7e7', padding: '20px',
      }}>
        <p style={{ fontSize: '12px', color: '#8B4040', margin: 0, fontFamily: 'DOSSaemmul, sans-serif' }}>⚠ {message}</p>
      </div>
    </div>
  )
}
