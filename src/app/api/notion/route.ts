import { NextRequest, NextResponse } from 'next/server'
import { fetchGraduationRequirements, fetchSemesters } from '@/lib/notion'
import { calculateCreditSummary } from '@/lib/credit-calculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, graduationDbId, semesterDbId } = body

    if (!apiKey || !graduationDbId || !semesterDbId) {
      return NextResponse.json(
        { error: 'apiKey, graduationDbId, semesterDbId 값이 모두 필요합니다.' },
        { status: 400 }
      )
    }

    const [requirements, semesters] = await Promise.all([
      fetchGraduationRequirements(apiKey, graduationDbId),
      fetchSemesters(apiKey, semesterDbId),
    ])

    const summary = calculateCreditSummary(requirements, semesters)

    return NextResponse.json({
      summary,
      updatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    const message = err?.message ?? '알 수 없는 오류가 발생했습니다.'
    const isAuthError = message.includes('API token') || message.includes('Unauthorized')
    return NextResponse.json(
      { error: isAuthError ? 'Notion API 키가 올바르지 않습니다.' : message },
      { status: isAuthError ? 401 : 500 }
    )
  }
}
