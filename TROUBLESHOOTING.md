# Render 배포 문제 해결 가이드

## Swagger UI가 보이지 않는 경우

### 1. 서버 상태 확인

Render 대시보드에서 다음을 확인하세요:

1. **서비스 상태**: "Live" 상태인지 확인
2. **로그 확인**: "Logs" 탭에서 에러 메시지 확인
3. **서버 시작 확인**: 로그에 "서버가 http://localhost:PORT 에서 실행 중입니다." 메시지가 있는지 확인

### 2. URL 확인

다음 URL들을 순서대로 확인하세요:

1. **루트 경로**: `https://your-service.onrender.com/`
   - JSON 응답이 나와야 합니다
   - `docs` 필드에 Swagger UI URL이 포함되어 있어야 합니다

2. **Swagger UI**: `https://your-service.onrender.com/api-docs`
   - HTML 페이지가 표시되어야 합니다
   - 빈 페이지가 나오면 브라우저 개발자 도구(F12)에서 콘솔 에러 확인

3. **OpenAPI Spec**: `https://your-service.onrender.com/api-docs.json`
   - JSON 파일이 다운로드되거나 표시되어야 합니다

### 3. 일반적인 문제 해결

#### 문제: 404 에러가 발생하는 경우

**원인**: 서버가 제대로 시작되지 않았거나 라우트 설정 문제

**해결**:
1. Render 로그에서 에러 메시지 확인
2. `package.json`의 `start` 스크립트가 `node server.js`인지 확인
3. 서비스를 재시작

#### 문제: 빈 페이지가 표시되는 경우

**원인**: Swagger UI의 정적 리소스가 로드되지 않음

**해결**:
1. 브라우저 개발자 도구(F12) 열기
2. "Network" 탭에서 실패한 요청 확인
3. "Console" 탭에서 JavaScript 에러 확인
4. CORS 문제인 경우 Render 대시보드에서 환경 변수 확인

#### 문제: 서버가 시작되지 않는 경우

**원인**: 의존성 설치 실패 또는 코드 에러

**해결**:
1. Render 로그에서 빌드 에러 확인
2. `package.json`의 의존성 확인
3. 로컬에서 `npm install` 및 `npm start` 테스트

### 4. 디버깅 방법

#### 로컬에서 테스트

```bash
# 의존성 설치
npm install

# 서버 실행
npm start

# 브라우저에서 확인
# http://localhost:3001/api-docs
```

#### Render 로그 확인

1. Render 대시보드 → 서비스 선택
2. "Logs" 탭 클릭
3. 에러 메시지 확인

#### 환경 변수 확인

Render 대시보드에서:
1. 서비스 설정 → "Environment" 탭
2. 필요한 환경 변수가 설정되어 있는지 확인
3. 현재는 환경 변수가 필요하지 않지만, 나중에 추가할 수 있습니다

### 5. 확인 체크리스트

- [ ] 서비스가 "Live" 상태인가?
- [ ] 로그에 서버 시작 메시지가 있는가?
- [ ] 루트 경로(`/`)가 응답하는가?
- [ ] `/api-docs.json`이 JSON을 반환하는가?
- [ ] `/api-docs`에 접근할 수 있는가?
- [ ] 브라우저 콘솔에 에러가 없는가?

### 6. 추가 도움

문제가 계속되면 다음 정보를 확인하세요:

1. Render 서비스 URL
2. Render 로그의 에러 메시지
3. 브라우저 개발자 도구의 에러 메시지
4. 서비스 설정 스크린샷
