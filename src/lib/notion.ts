import { Client } from '@notionhq/client'
import { GraduationRequirement, Semester, DatabaseInfo, PropertyInfo, GradDbMapping, SemDbMapping } from '@/types'

function getClient(apiKey: string) {
  return new Client({ auth: apiKey })
}

export async function listDatabases(apiKey: string): Promise<DatabaseInfo[]> {
  const notion = getClient(apiKey)
  const res = await notion.search({
    filter: { property: 'object', value: 'database' },
    page_size: 50,
  })
  return res.results
    .filter((r: any) => r.object === 'database')
    .map((db: any) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text ?? '(제목 없음)',
    }))
}

export async function listDbProperties(apiKey: string, dbId: string): Promise<PropertyInfo[]> {
  const notion = getClient(apiKey)
  const db = await notion.databases.retrieve({ database_id: dbId }) as any
  return Object.values(db.properties).map((p: any) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    options: p.select?.options?.map((o: any) => o.name)
      ?? p.multi_select?.options?.map((o: any) => o.name)
      ?? p.status?.options?.map((o: any) => o.name)
      ?? undefined,
  }))
}

function getPropValue(props: Record<string, any>, propName: string): any {
  return props[propName]
}

function readText(prop: any): string {
  if (!prop) return ''
  if (prop.title) return prop.title?.[0]?.plain_text ?? ''
  if (prop.rich_text) return prop.rich_text?.[0]?.plain_text ?? ''
  return ''
}

function readSelect(prop: any): string {
  if (!prop) return ''
  if (prop.select) return prop.select?.name ?? ''
  if (prop.multi_select) return prop.multi_select?.[0]?.name ?? ''
  if (prop.status) return prop.status?.name ?? ''
  return ''
}

function readNumber(prop: any): number {
  if (!prop) return 0
  if (prop.number !== undefined && prop.number !== null) return prop.number
  if (prop.rollup?.number !== undefined) return prop.rollup.number
  if (prop.formula?.number !== undefined) return prop.formula.number
  return 0
}

// 하드코딩 fallback (레거시 configId 호환)
const DEFAULT_GRAD: GradDbMapping = {
  nameProp: '요건명',
  categoryProp: '구분',
  requiredCreditsProp: '필요 학점',
  earnedCreditsProp: '이수 학점',
  majorValues: ['전공필수', '전공선택', '복수전공', '부전공'],
  liberalArtsValues: ['교양필수', '교양선택', '기초교양', '핵심교양'],
}
const DEFAULT_SEM: SemDbMapping = {
  nameProp: '학기명',
  statusProp: '상태',
  currentStatusValue: '진행 중',
  gpaProp: '학기 평점',
}

export async function fetchGraduationRequirements(
  apiKey: string,
  databaseId: string,
  mapping: GradDbMapping = DEFAULT_GRAD
): Promise<GraduationRequirement[]> {
  const notion = getClient(apiKey)
  const response = await notion.databases.query({ database_id: databaseId })

  return response.results
    .filter((p: any) => p.object === 'page')
    .map((page: any) => {
      const props = page.properties
      const name = readText(getPropValue(props, mapping.nameProp))
      const category = readSelect(getPropValue(props, mapping.categoryProp))
      const requiredCredits = readNumber(getPropValue(props, mapping.requiredCreditsProp))
      // earned: try mapped prop, then fallback alternate name
      const earnedProp = getPropValue(props, mapping.earnedCreditsProp)
      const earnedCredits = readNumber(earnedProp) ||
        readNumber(getPropValue(props, '취득 학점'))
      return { name, category, requiredCredits, earnedCredits }
    })
}

export async function fetchSemesters(
  apiKey: string,
  databaseId: string,
  mapping: SemDbMapping = DEFAULT_SEM
): Promise<Semester[]> {
  const notion = getClient(apiKey)
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: '연도', direction: 'descending' }],
  })

  return response.results
    .filter((p: any) => p.object === 'page')
    .map((page: any) => {
      const props = page.properties
      const name = readText(getPropValue(props, mapping.nameProp))
      const year = (getPropValue(props, '연도'))?.number ?? undefined
      const term = readSelect(getPropValue(props, '학기 구분')) || undefined
      const status = readSelect(getPropValue(props, mapping.statusProp))
      const gpa = mapping.gpaProp
        ? (readNumber(getPropValue(props, mapping.gpaProp)) || null)
        : null
      return { name, year, term, status, gpa }
    })
}
