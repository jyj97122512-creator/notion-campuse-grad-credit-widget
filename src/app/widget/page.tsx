import { decryptConfig } from '@/lib/crypto'
import { fetchGraduationRequirements, fetchSemesters } from '@/lib/notion'
import { calculateCreditSummary } from '@/lib/credit-calculator'
import { SavedConfig } from '@/types'
import CreditWidget from '@/components/CreditWidget'

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
        <div style={{ padding: '16px', background: 'transparent' }}>
          <CreditWidget summary={summary} title={config.title} updatedAt={new Date().toISOString()} />
        </div>
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
        <div style={{ padding: '16px', background: 'transparent' }}>
          <CreditWidget summary={summary} title={config.t ?? 'Credit Buddy'} updatedAt={new Date().toISOString()} />
        </div>
      )
    } catch {
      return <WidgetError message="설정 정보가 올바르지 않습니다." />
    }
  }

  return <WidgetError message="설정이 없습니다. 설정 페이지에서 임베드 URL을 생성하세요." />
}

function WidgetError({ message }: { message: string }) {
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ background: '#E8EDE0', borderRadius: '12px', padding: '20px' }}>
        <p style={{ fontSize: '12px', color: '#8B4040', margin: 0 }}>⚠ {message}</p>
      </div>
    </div>
  )
}
