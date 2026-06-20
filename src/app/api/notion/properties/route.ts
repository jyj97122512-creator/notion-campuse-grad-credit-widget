import { NextRequest, NextResponse } from 'next/server'
import { listDbProperties } from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    const { apiKey, dbId } = await request.json()
    if (!apiKey || !dbId) {
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 })
    }
    const properties = await listDbProperties(apiKey, dbId)
    return NextResponse.json({ properties })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? '속성 목록을 가져오지 못했습니다.' }, { status: 500 })
  }
}
