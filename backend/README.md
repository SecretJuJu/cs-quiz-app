# CS 퀴즈 앱 백엔드

CS 퀴즈 앱의 백엔드 API 서버입니다.

## 기술 스택

- Node.js
- TypeScript
- Express
- Serverless Framework
- AWS Lambda
- DynamoDB

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 빌드
npm run build

# 배포
npm run deploy
```

## 커스텀 도메인 설정

이 프로젝트는 `cs-quiz-api.secretjuju.kr` 도메인을 사용하여 API를 제공합니다. 커스텀 도메인을 설정하려면 다음 단계를 따르세요:

### 사전 요구사항

1. AWS Route 53에 등록된 도메인 (secretjuju.kr)
2. AWS Certificate Manager(ACM)에서 발급된 SSL 인증서

### 설정 단계

1. **SSL 인증서 발급**

   AWS Certificate Manager에서 `*.secretjuju.kr` 또는 `cs-quiz-api.secretjuju.kr` 도메인에 대한 인증서를 발급받습니다.

2. **도메인 생성**

   ```bash
   # 도메인 생성 (최초 1회만 실행)
   npx serverless create_domain --stage prod
   ```

3. **배포**

   ```bash
   # 배포
   npm run deploy
   ```

4. **DNS 확인**

   배포가 완료되면 Route 53에서 `cs-quiz-api.secretjuju.kr`에 대한 A 레코드가 자동으로 생성됩니다. DNS 전파에는 몇 분이 소요될 수 있습니다.

## API 엔드포인트

- `GET /api/questions`: 모든 문제 조회
- `GET /api/questions/:id`: 특정 문제 조회
- `GET /api/questions/quiz/random`: 퀴즈용 랜덤 문제 조회
- `POST /api/users`: 사용자 생성
- `GET /api/users/:nickname`: 특정 사용자 조회
- `POST /api/results`: 퀴즈 결과 제출
- `GET /api/results/leaderboard/top`: 리더보드 조회
- `GET /api/results/user/:nickname`: 사용자별 결과 조회 