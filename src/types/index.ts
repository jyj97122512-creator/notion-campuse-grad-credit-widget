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

// 레거시 (base64 방식)
export type WidgetConfig = {
  apiKey: string
  graduationDbId: string
  semesterDbId: string
  title?: string
}

// 새 방식 — 서버 측 암호화 configId 기반
export type SavedConfig = {
  apiKey: string
  graduationDbId: string
  semesterDbId: string
  title: string
}

export type DatabaseInfo = {
  id: string
  title: string
}
