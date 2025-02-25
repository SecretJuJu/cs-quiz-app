# CS 퀴즈 앱

CS 퀴즈 앱은 컴퓨터 과학 지식을 테스트할 수 있는 웹 애플리케이션입니다. 이 프로젝트는 백엔드와 프론트엔드로 구성되어 있으며, CI/CD 파이프라인을 통해 자동으로 배포됩니다.

## 프로젝트 구조

```
cs-quiz-app/
├── backend/         # 백엔드 코드 (Node.js, TypeScript, Serverless Framework)
├── frontend/        # 프론트엔드 코드 (React, TypeScript)
└── .github/         # GitHub Actions 워크플로우 설정
```

## 기술 스택

### 백엔드
- Node.js
- TypeScript
- Express
- Serverless Framework
- AWS Lambda
- AWS API Gateway
- AWS DynamoDB
- AWS Route 53
- AWS Certificate Manager

### 프론트엔드
- React
- TypeScript
- Material-UI
- React Router
- Axios

### CI/CD
- GitHub Actions
- Cloudflare Pages

## 배포 인프라

### 백엔드
- AWS Lambda + API Gateway를 통해 서버리스 API 배포
- 커스텀 도메인: `cs-quiz-api.secretjuju.kr`

### 프론트엔드
- Cloudflare Pages를 통해 정적 웹 사이트 배포
- 커스텀 도메인: `cs-quiz.secretjuju.kr`

## CI/CD 파이프라인

### 백엔드 CI/CD
1. GitHub 저장소의 `main` 브랜치에 `backend/` 디렉토리 내 파일이 변경되면 워크플로우 실행
2. 의존성 설치 및 빌드
3. 커스텀 도메인 생성 (필요한 경우)
4. AWS Lambda에 배포

### 프론트엔드 CI/CD
1. GitHub 저장소의 `main` 브랜치에 `frontend/` 디렉토리 내 파일이 변경되면 워크플로우 실행
2. 의존성 설치 및 빌드
3. Cloudflare Pages에 배포

## 환경 변수 설정

### GitHub Secrets
백엔드 배포를 위한 환경 변수:
- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키
- `AWS_REGION`: AWS 리전 (예: `us-east-1`)

프론트엔드 배포를 위한 환경 변수:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID
- `REACT_APP_API_URL`: 백엔드 API URL (예: `https://cs-quiz-api.secretjuju.kr/api`)

## 로컬 개발 환경 설정

### 백엔드
```bash
cd backend
npm install
npm run dev
```

### 프론트엔드
```bash
cd frontend
npm install
npm start
```

## 커스텀 도메인 설정

### 백엔드 커스텀 도메인 설정
백엔드 커스텀 도메인 설정에 대한 자세한 내용은 [백엔드 README](./backend/README.md)를 참조하세요.

### 프론트엔드 커스텀 도메인 설정
프론트엔드 커스텀 도메인 설정에 대한 자세한 내용은 [프론트엔드 README](./frontend/README.md)를 참조하세요.
