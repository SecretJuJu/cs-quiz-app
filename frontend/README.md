# CS 퀴즈 앱 프론트엔드

CS 퀴즈 앱의 프론트엔드 웹 애플리케이션입니다.

## 기술 스택

- React
- TypeScript
- Material-UI
- React Router
- Axios

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm start

# 빌드
npm run build
```

## 환경 변수

`.env` 파일을 생성하여 다음 환경 변수를 설정하세요:

```
REACT_APP_API_URL=https://cs-quiz-api.secretjuju.kr/api
```

## Cloudflare Pages 배포 및 커스텀 도메인 설정

이 프로젝트는 `cs-quiz.secretjuju.kr` 도메인을 사용하여 웹 애플리케이션을 제공합니다. Cloudflare Pages에 배포하고 커스텀 도메인을 설정하려면 다음 단계를 따르세요:

### 1. Cloudflare Pages 프로젝트 생성

1. [Cloudflare 대시보드](https://dash.cloudflare.com/)에 로그인합니다.
2. "Workers & Pages"를 클릭합니다.
3. "Create application" > "Pages" 탭을 선택합니다.
4. "Connect to Git"을 클릭하고 GitHub 저장소를 연결합니다.
5. 프로젝트 이름을 "cs-quiz-app"으로 설정합니다.
6. 빌드 설정:
   - 프레임워크 프리셋: Create React App
   - 빌드 명령어: `npm run build`
   - 빌드 출력 디렉토리: `build`
7. 환경 변수 설정:
   - `REACT_APP_API_URL`: `https://cs-quiz-api.secretjuju.kr/api`
8. "Save and Deploy"를 클릭합니다.

### 2. 커스텀 도메인 설정

1. 배포가 완료되면 "Custom domains" 탭을 클릭합니다.
2. "Set up a custom domain"을 클릭합니다.
3. 도메인 이름에 `cs-quiz.secretjuju.kr`을 입력합니다.
4. "Continue"를 클릭합니다.
5. DNS 레코드 설정 방법을 선택합니다:
   - Cloudflare가 도메인을 관리하는 경우: "Activate domain"을 클릭합니다.
   - 다른 DNS 제공업체를 사용하는 경우: 제공된 CNAME 레코드를 DNS 설정에 추가합니다.
6. DNS 전파가 완료될 때까지 기다립니다 (최대 24시간 소요될 수 있습니다).

### 3. HTTPS 설정

Cloudflare Pages는 기본적으로 SSL/TLS 인증서를 자동으로 제공하므로 추가 설정이 필요하지 않습니다.

## GitHub Actions 배포

GitHub Actions를 사용하여 자동 배포를 설정한 경우, 다음 환경 변수를 GitHub Secrets에 추가해야 합니다:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID
- `REACT_APP_API_URL`: `https://cs-quiz-api.secretjuju.kr/api` 