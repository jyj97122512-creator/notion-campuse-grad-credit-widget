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

export type DatabaseInfo = {
  id: string
  title: string
}

export type PropertyInfo = {
  id: string
  name: string
  type: string
  options?: string[]
}

export type GradDbMapping = {
  nameProp: string
  categoryProp: string
  requiredCreditsProp: string
  earnedCreditsProp: string
  majorValues: string[]
  liberalArtsValues: string[]
}

export type SemDbMapping = {
  nameProp: string
  statusProp: string
  currentStatusValue: string
  gpaProp: string | null
}

export type SavedConfig = {
  apiKey: string
  graduationDbId: string
  semesterDbId: string
  title: string
  gradMapping?: GradDbMapping
  semMapping?: SemDbMapping
}
