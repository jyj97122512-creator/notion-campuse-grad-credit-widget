import { NextRequest, NextResponse } from 'next/server'
import { decryptConfig } from '@/lib/crypto'
import { fetchGraduationRequirements, fetchSemesters } from '@/lib/notion'
import { calculateCreditSummary } from '@/lib/credit-calculator'
import { SavedConfig } from '@/types'
import { renderWidgetHtml, wrapHtmlDocument, errorHtmlDocument } from '@/lib/widget-html'

const HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Content-Security-Policy': 'frame-ancestors *',
  'Cache-Control': 'private, no-cache, no-store',
}

export async function GET(request: NextRequest) {
  const configId = request.nextUrl.searchParams.get('config')
  const legacy   = request.nextUrl.searchParams.get('c')

  try {
    let summary, title: string, updatedAt: string

    if (configId) {
      const config = decryptConfig(configId) as SavedConfig
      const { apiKey, graduationDbId, semesterDbId, gradMapping, semMapping } = config
      const [requirements, semesters] = await Promise.all([
        fetchGraduationRequirements(apiKey, graduationDbId, gradMapping),
        fetchSemesters(apiKey, semesterDbId, semMapping),
      ])
      summary = calculateCreditSummary(
        requirements, semesters,
        gradMapping?.majorValues ?? [],
        gradMapping?.liberalArtsValues ?? [],
        semMapping?.currentStatusValue ?? '진행 중'
      )
      title = config.title
      updatedAt = new Date().toISOString()
    } else if (legacy) {
      const config = JSON.parse(Buffer.from(legacy, 'base64').toString())
      const [requirements, semesters] = await Promise.all([
        fetchGraduationRequirements(config.k, config.g),
        fetchSemesters(config.k, config.s),
      ])
      summary = calculateCreditSummary(requirements, semesters)
      title = config.t ?? 'Credit Buddy'
      updatedAt = new Date().toISOString()
    } else {
      return new NextResponse(
        errorHtmlDocument('설정이 없습니다. 설정 페이지에서 임베드 URL을 생성하세요.'),
        { headers: HEADERS }
      )
    }

    const widgetHtml = renderWidgetHtml(summary!, title!, updatedAt!)
    return new NextResponse(wrapHtmlDocument(widgetHtml), { headers: HEADERS })

  } catch (err: any) {
    const isDecryptError = err?.message?.includes('bad decrypt') || err?.message?.includes('Unsupported state')
    return new NextResponse(
      errorHtmlDocument(isDecryptError ? '설정이 만료되었거나 올바르지 않습니다.' : '데이터를 불러오지 못했습니다.'),
      { status: isDecryptError ? 400 : 500, headers: HEADERS }
    )
  }
}
