import { Client } from '@notionhq/client'
import { GraduationRequirement, Semester } from '@/types'

function getClient(apiKey: string) {
  return new Client({ auth: apiKey })
}

function getProp(props: Record<string, any>, key: string) {
  return props[key]
}

export async function fetchGraduationRequirements(
  apiKey: string,
  databaseId: string
): Promise<GraduationRequirement[]> {
  const notion = getClient(apiKey)
  const response = await notion.databases.query({ database_id: databaseId })

  return response.results
    .filter((p: any) => p.object === 'page')
    .map((page: any) => {
      const props = page.properties

      const name =
        getProp(props, '요건명')?.title?.[0]?.plain_text ?? ''
      const category =
        getProp(props, '구분')?.select?.name ?? ''
      const requiredCredits =
        getProp(props, '필요 학점')?.number ?? 0
      // 이수 학점은 Rollup(sum)으로 저장됨
      const earnedCredits =
        getProp(props, '이수 학점')?.rollup?.number ??
        getProp(props, '취득 학점')?.number ??
        0

      return { name, category, requiredCredits, earnedCredits }
    })
}

export async function fetchSemesters(
  apiKey: string,
  databaseId: string
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

      const name =
        getProp(props, '학기명')?.title?.[0]?.plain_text ?? ''
      const year =
        getProp(props, '연도')?.number ?? undefined
      const term =
        getProp(props, '학기 구분')?.select?.name ?? undefined
      const status =
        getProp(props, '상태')?.status?.name ??
        getProp(props, '상태')?.select?.name ??
        ''
      // 학기 평점: 사용자가 추가한 경우에만 존재
      const gpa =
        getProp(props, '학기 평점')?.formula?.number ??
        getProp(props, '학기 평점')?.number ??
        null

      return { name, year, term, status, gpa }
    })
}
