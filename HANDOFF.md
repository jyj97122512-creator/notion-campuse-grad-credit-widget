# Credit Buddy — 클로드 코드 인수인계 문서

## 현재 상태 요약

이 프로젝트는 **노션 학점 관리 대시보드용 임베드 위젯**이다.
Cowork 세션에서 소스코드 작성까지 완료했고, **GitHub 푸시 + Vercel 배포만 남은 상태**다.

---

## 완료된 작업

### 1. 노션 대시보드 (별도 작업, 위젯과 무관)
- 노션 페이지: `대학생 학점 관리 대시보드 템플릿`
- 4개 DB 인라인 뷰 생성 완료:
  - `① 이번 학기 현황` — 학기 DB 테이블 뷰
  - `② 수강 과목 현황` — 과목 DB 보드 뷰 (이수구분 그룹)
  - `③ 과제·시험 일정` — 과제·시험 DB 보드 뷰 (유형 그룹)
  - `④ 졸업요건 달성 현황` — 졸업요건 DB 테이블 뷰

### 2. Credit Buddy 위젯 소스코드 (이 폴더)
- Next.js 14 + TypeScript + Tailwind CSS
- Notion API 연동 (`@notionhq/client`)
- 설정 페이지(`/`) + 위젯 페이지(`/widget`) 구성
- 크림/픽셀 레트로 디자인 시스템 적용

---

## 프로젝트 구조

```
notion-campuse-grad-credit-widget/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 설정 폼 (API키, DB ID 입력 → 임베드 URL 생성)
│   │   ├── widget/page.tsx       # 노션 임베드용 위젯 페이지
│   │   ├── api/notion/route.ts   # Notion API 서버 프록시
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── CreditWidget.tsx      # 메인 위젯 UI 컴포넌트
│   │   └── SetupForm.tsx         # 설정 폼 컴포넌트
│   ├── lib/
│   │   ├── notion.ts             # Notion API 호출 (졸업요건 DB, 학기 DB)
│   │   └── credit-calculator.ts  # 학점 계산 로직
│   └── types/index.ts            # TypeScript 타입 정의
├── package.json
├── next.config.ts                # /widget iframe 허용 헤더 설정
├── tailwind.config.ts
├── deploy.bat                    # Windows 자동 배포 스크립트
└── HANDOFF.md                    # 이 파일
```

---

## 다음에 해야 할 작업

### Step 1: GitHub 레포 생성 후 푸시

```bash
# 이 폴더에서 실행
cd "C:\Users\jyj12\AppData\Roaming\Claude\local-agent-mode-sessions\e19cae35-1cc0-46d1-a14b-3455dc12d734\861f1695-7fec-48a0-a73e-ea3ac4e0b275\local_751fd94e-b711-4326-9616-b68ac7c4c2f6\outputs\notion-campuse-grad-credit-widget"

git init -b main
git add .
git commit -m "feat: initial Credit Buddy widget - MVP"
git remote add origin https://github.com/<계정>/notion-campuse-grad-credit-widget.git
git push -u origin main
```

> GitHub 레포 먼저 생성: https://github.com/new  
> 이름: `notion-campuse-grad-credit-widget`

또는 `deploy.bat` 더블클릭으로 자동 실행 가능.

### Step 2: Vercel 배포

방법 A — Vercel 웹에서 import (권장):
1. https://vercel.com/new 접속
2. GitHub 레포 `notion-campuse-grad-credit-widget` 선택
3. 환경변수 없이 바로 Deploy
4. 배포 완료 URL 확인

방법 B — CLI:
```bash
npm install
npx vercel --prod
```

---

## 노션 DB 정보 (API 연동용)

| DB | Collection ID |
|---|---|
| 과목 DB | `1ec1cd54-75c4-4689-b279-aec6e29339f5` |
| 과제·시험 DB | `38de5abb-b183-4e99-bf5a-2d9866ca2c78` |
| 졸업요건 DB | `956f2c67-634e-4ceb-bc17-71e1b03d52b6` |
| 학기 DB | `b8a96ad5-9b20-4907-a575-33b863d652b0` |

노션 페이지 ID: `377bde77-18aa-812e-b57c-f7ebd3bd631a`

---

## 위젯 동작 방식

1. 사용자가 `https://<배포URL>/` 접속
2. Notion API Key + 졸업요건 DB ID + 학기 DB ID 입력
3. 연결 테스트 후 임베드 URL 생성 (`/widget?c=<base64_config>`)
4. 이 URL을 노션 페이지에 `/embed`로 붙여넣기
5. 위젯이 자동으로 학점 현황 표시 (30분마다 자동 갱신)

---

## 알려진 이슈 / 개선 필요 사항

1. **학기 평점(GPA)**: 현재 사용자의 학기 DB에 `학기 평점` 속성이 없음.
   - `src/lib/notion.ts`의 `fetchSemesters()`에서 null 처리됨 → 위젯에 `—` 표시
   - 해결: 학기 DB에 수동으로 `학기 평점` Number 속성 추가

2. **MVP 제외 기능** (추후 구현):
   - GPA 시뮬레이터
   - 재수강 반영 계산
   - 복수전공 세부 분류
   - 학교별 졸업요건 자동 진단

---

## 클로드 코드에서 이어받는 방법

```bash
# 프로젝트 폴더로 이동
cd "C:\Users\jyj12\AppData\Roaming\Claude\...\notion-campuse-grad-credit-widget"

# Claude Code 실행
claude
```

첫 프롬프트 예시:
> "HANDOFF.md를 읽고 Credit Buddy 위젯 프로젝트를 GitHub에 푸시하고 Vercel에 배포해줘."
