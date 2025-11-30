# 배포 가이드

이 프로젝트를 Render에 배포하는 방법을 안내합니다.

## Render 배포

### 사전 준비

1. [Render 계정 생성](https://render.com/signup) (GitHub 계정으로 간편 가입)
2. GitHub 저장소 준비 완료

### 배포 방법

#### 방법 1: Render 웹 대시보드를 통한 배포 (권장)

1. [Render 대시보드](https://dashboard.render.com)에 로그인
2. "New +" → "Web Service" 클릭
3. GitHub 저장소 연결:
   - "Connect account" 또는 "Connect repository" 클릭
   - GitHub 인증 및 저장소 선택 (`taejin0618/sampleapi`)
4. 서비스 설정:
   - **Name**: `sampleapi` (원하는 이름)
   - **Region**: `Singapore` (가장 가까운 지역 선택)
   - **Branch**: `main`
   - **Root Directory**: (비워둠, 루트 디렉토리 사용)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (무료 티어)
5. "Create Web Service" 클릭

#### 방법 2: render.yaml 파일 사용 (선택사항)

프로젝트에 `render.yaml` 파일이 있으면 Render가 자동으로 설정을 읽어옵니다.

### 배포 후 확인

배포가 완료되면 Render에서 제공하는 URL로 접근할 수 있습니다.

#### 주요 엔드포인트

- **루트**: `https://sampleapi.onrender.com/`
- **Swagger UI**: `https://sampleapi.onrender.com/api-docs`
- **OpenAPI Spec**: `https://sampleapi.onrender.com/api-docs.json`
- **API 엔드포인트**: `https://sampleapi.onrender.com/v3/api/posts`

### Render 무료 티어 특징

- ✅ 무료 SSL 인증서
- ✅ 자동 HTTPS
- ✅ GitHub 연동 자동 배포
- ⚠️ **슬리프 모드**: 15분간 요청이 없으면 서버가 슬리프 모드로 전환
- ⚠️ **Cold Start**: 슬리프 모드에서 첫 요청 시 약 30초~1분 지연 가능

### 환경 변수 설정

현재 프로젝트는 환경 변수가 필요하지 않지만, 필요시 Render 대시보드에서 설정할 수 있습니다:

1. 서비스 설정 → "Environment" 탭
2. "Add Environment Variable" 클릭
3. 변수 추가 후 "Save Changes"
4. 자동 재배포됨

### 문제 해결

#### 배포 실패 시

1. Render 대시보드의 "Events" 탭에서 로그 확인
2. 빌드 에러 확인
3. `package.json`의 의존성 확인
4. Start Command가 `npm start`인지 확인

#### API가 동작하지 않을 때

1. Render 로그 확인 (대시보드 → "Logs" 탭)
2. 서비스가 "Live" 상태인지 확인
3. 슬리프 모드인 경우 첫 요청 시 지연될 수 있음

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

### 주요 엔드포인트 (로컬)

- **루트**: `http://localhost:3001/`
- **Swagger UI**: `http://localhost:3001/api-docs`
- **OpenAPI Spec**: `http://localhost:3001/api-docs.json`
- **API 엔드포인트**: `http://localhost:3001/v3/api/posts`

## 주의사항

- **데이터 저장**: 현재 메모리 기반 저장소를 사용하므로 서버 재시작 시 데이터가 초기화됩니다.
- **환경 변수**: Render 대시보드에서 환경 변수 설정을 지원합니다.
- **자동 배포**: GitHub에 푸시하면 자동으로 재배포됩니다.
