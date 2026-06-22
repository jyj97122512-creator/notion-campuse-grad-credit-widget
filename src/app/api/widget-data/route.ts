import { NextRequest, NextResponse } from 'next/server'
import { decryptConfig } from '@/lib/crypto'
import { fetchGraduationRequirements, fetchSemesters } from '@/lib/notion'
import { calculateCreditSummary } from '@/lib/credit-calculator'
import { SavedConfig } from '@/types'

export async function GET(request: NextRequest) {
  const configId = request.nextUrl.searchParams.get('config')
  if (!configId) {
    return NextResponse.json({ error: 'config 파라미터가 없습니다.' }, { status: 400 })
  }

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

    return NextResponse.json({ summary, updatedAt: new Date().toISOString(), title: config.title })
  } catch (err: any) {
    const msg = err?.message ?? ''
    if (msg.includes('bad decrypt') || msg.includes('Unsupported state')) {
      return NextResponse.json({ error: '설정이 만료되었거나 올바르지 않습니다.' }, { status: 400 })
    }
    return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 })
  }
}
