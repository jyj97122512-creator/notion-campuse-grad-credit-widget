import { NextRequest, NextResponse } from 'next/server'
import { listDatabases } from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()
    if (!apiKey) return NextResponse.json({ error: 'apiKey가 필요합니다.' }, { status: 400 })

    const databases = await listDatabases(apiKey)
    return NextResponse.json({ databases })
  } catch (err: any) {
    const msg = err?.message ?? ''
    const isAuth = msg.includes('API token') || msg.includes('Unauthorized') || msg.includes('401')
    return NextResponse.json(
      { error: isAuth ? 'Notion API 키가 올바르지 않습니다.' : 'DB 목록을 불러오지 못했습니다.' },
      { status: isAuth ? 401 : 500 }
    )
  }
}
