export type GraduationRequirement = {
  name: string
  category: string
  requiredCredits: number
  earnedCredits: number
}

export type Semester = {
  name: string
  year?: number
  term?: string
  status: string
  gpa: number | null
}

export type CreditSummary = {
  requiredCredits: number
  earnedCredits: number
  remainingCredits: number
  progressRate: number
  major: { required: number; earned: number }
  liberalArts: { required: number; earned: number }
  currentSemester?: { name: string; gpa: number | null }
}

export type WidgetConfig = {
  apiKey: string
  graduationDbId: string
  semesterDbId: string
  title?: string
}
