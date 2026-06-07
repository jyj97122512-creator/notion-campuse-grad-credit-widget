@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   Credit Buddy - GitHub + Vercel 배포 스크립트
echo ============================================
echo.

:: 현재 폴더를 프로젝트 루트로 사용
cd /d "%~dp0"

:: Git 초기화
echo [1/5] Git 초기화 중...
git init -b main
git add .
git commit -m "feat: initial Credit Buddy widget - MVP"
echo.

:: GitHub 레포 URL 입력
echo [2/5] GitHub 레포지토리 연결
echo.
echo GitHub에서 먼저 아래 레포를 생성해주세요:
echo   https://github.com/new
echo   이름: notion-campuse-grad-credit-widget
echo.
set /p REPO_URL="GitHub 레포 URL 입력 (예: https://github.com/계정명/notion-campuse-grad-credit-widget): "
echo.

:: Remote 추가 후 Push
echo [3/5] GitHub에 코드 푸시 중...
git remote add origin %REPO_URL%
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠ Push 실패. GitHub 로그인 상태를 확인해주세요.
    pause
    exit /b 1
)
echo ✓ GitHub 푸시 완료!
echo.

:: Node.js / npm 확인
echo [4/5] 의존성 설치 중...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ npm이 설치되어 있지 않습니다. Node.js를 먼저 설치해주세요.
    pause
    exit /b 1
)
npm install
echo.

:: Vercel 배포
echo [5/5] Vercel 배포 중...
echo.
echo Vercel CLI로 배포합니다. 처음 실행 시 로그인이 필요합니다.
echo.
npx vercel --prod
if %errorlevel% neq 0 (
    echo.
    echo ⚠ Vercel 배포 실패.
    echo   대안: vercel.com/new 에서 GitHub 레포를 직접 import 하세요.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   ✓ 배포 완료!
echo   위에 표시된 URL을 노션에 임베드하세요.
echo ============================================
echo.
pause
