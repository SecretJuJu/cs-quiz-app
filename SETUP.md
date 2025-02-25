# CS 퀴즈 앱 설정 가이드

이 문서는 CS 퀴즈 앱의 전체 설정 과정을 설명합니다.

## 1. 사전 요구사항

- AWS 계정
- Cloudflare 계정
- GitHub 계정
- 도메인 (예: secretjuju.kr)

## 2. 백엔드 설정

### 2.1. AWS 설정

1. AWS IAM 사용자 생성
   - 프로그래밍 방식 액세스 권한 부여
   - 필요한 권한: Lambda, API Gateway, DynamoDB, Route 53, Certificate Manager

2. AWS Certificate Manager에서 인증서 발급
   - 도메인: `cs-quiz-api.secretjuju.kr`
   - 검증 방법: DNS 검증

3. Route 53 호스팅 영역 설정
   - 도메인: `secretjuju.kr`
   - 인증서 검증을 위한 DNS 레코드 추가

### 2.2. 백엔드 코드 설정

1. `backend/package.json` 파일에 필요한 의존성 추가

   ```json
   "devDependencies": {
     "serverless-domain-manager": "^7.1.1",
     "serverless-offline": "^12.0.4",
     "serverless-plugin-typescript": "^2.1.5"
   }
   ```

2. `backend/serverless.yml` 파일 설정

   ```yaml
   plugins:
     - serverless-plugin-typescript
     - serverless-offline
     - serverless-domain-manager

   custom:
     customDomain:
       domainName: cs-quiz-api.secretjuju.kr
       basePath: 'api'
       stage: ${self:provider.stage}
       createRoute53Record: true
       endpointType: 'regional'
       securityPolicy: tls_1_2
       apiType: rest
       autoDomain: true
       certificateName: 'cs-quiz-api.secretjuju.kr'
   ```

## 3. 프론트엔드 설정

### 3.1. Cloudflare 설정

1. Cloudflare 계정 생성 및 도메인 추가
   - 도메인: `secretjuju.kr`

2. Cloudflare Pages 프로젝트 생성
   - 프로젝트 이름: `cs-quiz-app`
   - 빌드 설정:
     - 프레임워크 프리셋: Create React App
     - 빌드 명령어: `npm run build`
     - 빌드 출력 디렉토리: `build`

3. 커스텀 도메인 설정
   - 도메인: `cs-quiz.secretjuju.kr`

### 3.2. 프론트엔드 코드 설정

1. `frontend/.env` 파일 생성

   ```
   REACT_APP_API_URL=https://cs-quiz-api.secretjuju.kr/api
   ```

## 4. CI/CD 파이프라인 설정

### 4.1. GitHub Secrets 설정

1. AWS 관련 시크릿
   - `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
   - `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키
   - `AWS_REGION`: AWS 리전 (예: `us-east-1`)

2. Cloudflare 관련 시크릿
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID

3. 기타 시크릿
   - `REACT_APP_API_URL`: 백엔드 API URL (예: `https://cs-quiz-api.secretjuju.kr/api`)

### 4.2. GitHub Actions 워크플로우 설정

1. 백엔드 배포 워크플로우 (`.github/workflows/backend-deploy.yml`)

   ```yaml
   name: Backend Deploy

   on:
     push:
       branches: [ main ]
       paths:
         - 'backend/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       defaults:
         run:
           working-directory: ./backend
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Use Node.js 18.x
         uses: actions/setup-node@v3
         with:
           node-version: 18.x
           cache: 'npm'
           cache-dependency-path: './backend/package-lock.json'
       
       - name: Install dependencies
         run: npm ci
       
       - name: Build
         run: npm run build
       
       - name: Install Serverless Framework
         run: npm install -g serverless
       
       - name: Create custom domain
         run: serverless create_domain --stage prod
         env:
           AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
           AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
           AWS_REGION: ${{ secrets.AWS_REGION }}
       
       - name: Deploy to AWS
         run: serverless deploy --stage prod
         env:
           AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
           AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
           AWS_REGION: ${{ secrets.AWS_REGION }}
   ```

2. 프론트엔드 배포 워크플로우 (`.github/workflows/frontend-deploy.yml`)

   ```yaml
   name: Frontend Deploy

   on:
     push:
       branches: [ main ]
       paths:
         - 'frontend/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       defaults:
         run:
           working-directory: ./frontend
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Use Node.js 18.x
         uses: actions/setup-node@v3
         with:
           node-version: 18.x
           cache: 'npm'
           cache-dependency-path: './frontend/package-lock.json'
       
       - name: Install dependencies
         run: npm ci
       
       - name: Build
         run: npm run build
         env:
           REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
       
       - name: Deploy to Cloudflare Pages
         uses: cloudflare/pages-action@v1
         with:
           apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
           accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
           projectName: cs-quiz-app
           directory: ./frontend/build
           gitHubToken: ${{ secrets.GITHUB_TOKEN }}
   ```

## 5. 배포 및 테스트

1. 백엔드 배포

   ```bash
   cd backend
   npm install
   serverless create_domain --stage prod
   serverless deploy --stage prod
   ```

2. 프론트엔드 배포

   ```bash
   cd frontend
   npm install
   npm run build
   # Cloudflare Pages 대시보드를 통해 배포
   ```

3. 테스트
   - 백엔드 API 테스트: `https://cs-quiz-api.secretjuju.kr/api/health`
   - 프론트엔드 테스트: `https://cs-quiz.secretjuju.kr`
