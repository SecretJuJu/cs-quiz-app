# GitHub Actions 환경변수 설정 가이드

이 문서는 CS 퀴즈 앱의 CI/CD 파이프라인을 위해 GitHub Secrets에 설정해야 하는 환경변수들을 설명합니다.

## 환경변수 설정 방법

1. GitHub 저장소에서 `Settings` 탭으로 이동합니다.
2. 왼쪽 메뉴에서 `Secrets and variables` > `Actions`를 선택합니다.
3. `New repository secret` 버튼을 클릭하여 각 환경변수를 추가합니다.

## 필요한 환경변수 목록

### AWS 배포를 위한 환경변수

| 이름 | 설명 | 예시 |
|------|------|------|
| `AWS_ACCESS_KEY_ID` | AWS IAM 사용자의 액세스 키 ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM 사용자의 비밀 액세스 키 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS 리전 | `us-east-1` |

### Cloudflare Pages 배포를 위한 환경변수

| 이름 | 설명 | 예시 |
|------|------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 | `your-cloudflare-api-token` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID | `your-cloudflare-account-id` |

### 프론트엔드 환경변수

| 이름 | 설명 | 예시 |
|------|------|------|
| `REACT_APP_API_URL` | 백엔드 API URL | `https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/api` |

## 환경변수 획득 방법

### AWS 환경변수
1. AWS Management Console에 로그인합니다.
2. IAM 서비스로 이동합니다.
3. 사용자를 생성하거나 기존 사용자를 선택합니다.
4. `보안 자격 증명` 탭에서 액세스 키를 생성합니다.
5. 생성된 액세스 키 ID와 비밀 액세스 키를 저장합니다.

### Cloudflare 환경변수
1. Cloudflare 대시보드에 로그인합니다.
2. 오른쪽 상단의 프로필 아이콘을 클릭하고 `내 프로필`을 선택합니다.
3. `API 토큰` 탭으로 이동합니다.
4. `토큰 생성`을 클릭하여 새 API 토큰을 생성합니다.
5. 계정 ID는 Cloudflare 대시보드 URL에서 확인할 수 있습니다: `https://dash.cloudflare.com/아이디/...`

## 주의사항

- 환경변수는 민감한 정보이므로 안전하게 관리해야 합니다.
- 실제 값을 코드에 직접 포함시키지 마세요.
- GitHub Secrets를 사용하면 워크플로우 로그에서 값이 마스킹됩니다. 