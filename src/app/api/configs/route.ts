import { NextRequest, NextResponse } from 'next/server'
import { encryptConfig } from '@/lib/crypto'

export async function POST(request: NextRequest) {
  try {
    const { apiKey, graduationDbId, semesterDbId, title, gradMapping, semMapping } = await request.json()

    if (!apiKey || !graduationDbId || !semesterDbId) {
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 })
    }

    const configId = encryptConfig({
      apiKey,
      graduationDbId,
      semesterDbId,
      title: title ?? 'Credit Buddy',
      gradMapping,
      semMapping,
    })
    return NextResponse.json({ configId })
  } catch {
    return NextResponse.json({ error: '설정 저장에 실패했습니다.' }, { status: 500 })
  }
}
