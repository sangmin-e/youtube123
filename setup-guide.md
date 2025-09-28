# YouTube API 설정 가이드

## 🔑 YouTube Data API v3 설정 방법

### 1단계: Google Cloud Console 설정
1. **Google Cloud Console** 접속: https://console.cloud.google.com/
2. **새 프로젝트 생성** 또는 기존 프로젝트 선택
3. **API 및 서비스 > 라이브러리** 이동
4. **"YouTube Data API v3"** 검색 후 **활성화**
5. **API 및 서비스 > 사용자 인증 정보** 이동
6. **"사용자 인증 정보 만들기" > "API 키"** 선택
7. **API 키 복사** (중요: 이 키를 안전하게 보관하세요)

### 2단계: .env 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# YouTube Data API v3 키 (위에서 발급받은 키로 교체)
YOUTUBE_API_KEY=your_actual_api_key_here

# 서버 포트
PORT=3000

# 환경 설정
NODE_ENV=development
```

### 3단계: API 키 테스트
```bash
# API 키가 올바르게 설정되었는지 테스트
node test-api.js
```

### 4단계: 서버 재시작
```bash
# 서버를 중지하고 다시 시작
node server.js
```

## ⚠️ 주의사항
- API 키는 절대 공개 저장소에 커밋하지 마세요
- .env 파일은 .gitignore에 포함되어 있습니다
- API 키는 Google Cloud Console에서 할당량을 관리할 수 있습니다

## 🧪 테스트 방법
1. 브라우저에서 http://localhost:3000 접속
2. 검색어 입력 후 검색 버튼 클릭
3. 검색 결과가 표시되는지 확인
4. 영상 카드 클릭하여 재생되는지 확인
