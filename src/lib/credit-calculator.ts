import { CreditSummary, GraduationRequirement, Semester } from '@/types'

export function calculateCreditSummary(
  requirements: GraduationRequirement[],
  semesters: Semester[],
  majorValues: string[] = [],
  liberalArtsValues: string[] = [],
  currentStatusValue: string = '진행 중'
): CreditSummary {
  const requiredCredits = requirements.reduce((s, r) => s + r.requiredCredits, 0)
  const earnedCredits = requirements.reduce((s, r) => s + r.earnedCredits, 0)
  const remainingCredits = Math.max(requiredCredits - earnedCredits, 0)
  const progressRate =
    requiredCredits === 0 ? 0 : Math.min(Math.round((earnedCredits / requiredCredits) * 100), 100)

  const majorItems = requirements.filter((r) => majorValues.includes(r.category))
  const liberalArtsItems = requirements.filter((r) => liberalArtsValues.includes(r.category))

  const major = {
    required: majorItems.reduce((s, r) => s + r.requiredCredits, 0),
    earned: majorItems.reduce((s, r) => s + r.earnedCredits, 0),
  }
  const liberalArts = {
    required: liberalArtsItems.reduce((s, r) => s + r.requiredCredits, 0),
    earned: liberalArtsItems.reduce((s, r) => s + r.earnedCredits, 0),
  }

  const current =
    semesters.find((s) => s.status === currentStatusValue) ??
    semesters.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0]

  return {
    requiredCredits,
    earnedCredits,
    remainingCredits,
    progressRate,
    major,
    liberalArts,
    currentSemester: current ? { name: current.name, gpa: current.gpa } : undefined,
  }
}

export function getStatusMessage(remaining: number): string {
  if (remaining <= 0) return '졸업 요건을 채웠어요 🎓'
  if (remaining <= 30) return `졸업까지 ${remaining}학점 남았어요`
  if (remaining <= 60) return '절반을 향해 가고 있어요'
  return '차근차근 학점을 채워가고 있어요'
}
