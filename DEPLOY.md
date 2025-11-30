# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비

1. [Vercel 계정 생성](https://vercel.com/signup)
2. [Vercel CLI 설치](https://vercel.com/docs/cli) (선택사항)

## 배포 방법

### 방법 1: Vercel 웹 대시보드를 통한 배포 (권장)

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub/GitLab/Bitbucket 저장소 연결 또는 코드 업로드
4. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (기본값)
   - **Build Command**: (비워둠)
   - **Output Directory**: (비워둠)
   - **Install Command**: `npm install`
5. "Deploy" 버튼 클릭

### 방법 2: Vercel CLI를 통한 배포

```bash
# Vercel CLI 로그인
vercel login

# 프로젝트 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 배포 후 확인

배포가 완료되면 Vercel에서 제공하는 URL로 접근할 수 있습니다.

### 주요 엔드포인트

- **루트**: `https://your-project.vercel.app/`
- **Swagger UI**: `https://your-project.vercel.app/api-docs`
- **OpenAPI Spec**: `https://your-project.vercel.app/api-docs.json`
- **API 엔드포인트**: `https://your-project.vercel.app/v3/api/posts`

## 환경 변수 설정

현재 프로젝트는 환경 변수가 필요하지 않지만, 필요시 Vercel 대시보드에서 설정할 수 있습니다:

1. 프로젝트 설정 → "Environment Variables"
2. 변수 추가 후 "Save"
3. 재배포 필요

## 주의사항

- **데이터 저장**: 현재 메모리 기반 저장소를 사용하므로 서버 재시작 시 데이터가 초기화됩니다.
- **무료 티어 제한**: Vercel 무료 티어는 일일 요청 수와 실행 시간에 제한이 있습니다.
- **Cold Start**: 서버리스 함수는 일정 시간 비활성 후 첫 요청 시 지연이 발생할 수 있습니다.

## 로컬 개발

로컬에서 개발하려면:

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 모드 실행
npm start
```

로컬 서버는 `http://localhost:3001`에서 실행됩니다.

## 문제 해결

### 배포 실패 시

1. Vercel 대시보드의 "Deployments" 탭에서 로그 확인
2. 빌드 에러 확인
3. `package.json`의 의존성 확인

### API가 동작하지 않을 때

1. Vercel 함수 로그 확인
2. `vercel.json` 설정 확인
3. 라우트 경로 확인

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Express on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#using-express)
