# 🎬 YouTube Player Web App

Node.js 기반의 유튜브 영상 검색 및 재생 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🔍 **영상 검색**: YouTube Data API v3를 통한 실시간 영상 검색
- 📺 **영상 재생**: 웹 페이지 내에서 YouTube 영상 재생
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크탑 최적화
- ⚡ **캐싱 시스템**: 검색 결과 캐싱으로 성능 최적화
- 🛡️ **에러 처리**: 포괄적인 에러 처리 및 사용자 피드백

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd youtube
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 YouTube API 키를 설정하세요:

```bash
# YouTube Data API v3 키
YOUTUBE_API_KEY=your_youtube_api_key_here

# 서버 포트
PORT=3000

# 환경 설정
NODE_ENV=development
```

### 3. 서버 실행

```bash
# 개발 모드
npm start

# 또는 직접 실행
node server.js
```

### 4. 브라우저에서 접속

http://localhost:3000 에 접속하여 애플리케이션을 사용하세요.

## 🔧 YouTube API 설정

### Google Cloud Console 설정

1. **Google Cloud Console** 접속: https://console.cloud.google.com/
2. **새 프로젝트 생성** 또는 기존 프로젝트 선택
3. **API 및 서비스 > 라이브러리** 이동
4. **"YouTube Data API v3"** 검색 후 **활성화**
5. **API 및 서비스 > 사용자 인증 정보** 이동
6. **"사용자 인증 정보 만들기" > "API 키"** 선택
7. **API 키 복사** 후 `.env` 파일에 설정

### API 키 없이 테스트

API 키가 설정되지 않은 경우, Mock 서비스가 자동으로 활성화되어 테스트용 데이터로 기능을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
youtube/
├── server.js                 # Express 서버 메인 파일
├── package.json              # 프로젝트 설정 및 의존성
├── .env                      # 환경 변수 (생성 필요)
├── .gitignore               # Git 무시 파일
├── README.md                # 프로젝트 문서
├── setup-guide.md           # API 설정 가이드
├── memory_bank/             # 메모리 뱅크 (Plan/Act 워크플로우)
│   ├── projectbrief.md
│   ├── techContext.md
│   ├── systemPatterns.md
│   ├── productContext.md
│   ├── activeContext.md
│   └── progress.md
├── routes/                  # API 라우터
│   └── api.js
├── services/                # 비즈니스 로직 서비스
│   ├── youtubeService.js    # YouTube API 서비스
│   └── mockYouTubeService.js # Mock 서비스
├── utils/                   # 유틸리티
│   ├── logger.js            # 로깅 시스템
│   └── cache.js             # 캐싱 시스템
├── views/                   # EJS 템플릿
│   └── index.ejs
├── public/                  # 정적 파일
│   ├── app.js              # 클라이언트 JavaScript
│   └── style.css           # 커스텀 CSS
└── test-*.js               # 테스트 스크립트
```

## 🛠️ 기술 스택

### 백엔드
- **Node.js**: JavaScript 런타임
- **Express.js**: 웹 프레임워크
- **EJS**: 템플릿 엔진
- **Axios**: HTTP 클라이언트
- **dotenv**: 환경 변수 관리

### 프론트엔드
- **HTML5**: 마크업
- **CSS3**: 스타일링
- **Tailwind CSS**: CSS 프레임워크
- **Vanilla JavaScript**: 클라이언트 로직

### 외부 API
- **YouTube Data API v3**: 영상 검색 및 정보 조회

## 🔍 API 엔드포인트

### 검색 API
- **POST** `/api/search` - 영상 검색
- **GET** `/api/search?q=검색어` - URL 파라미터로 검색

### 영상 상세 정보 API
- **GET** `/api/video/:id` - 특정 영상 상세 정보

### 헬스 체크 API
- **GET** `/api/health` - API 상태 확인

## 🧪 테스트

### API 테스트
```bash
# 검색 기능 테스트
node test-search.js

# API 엔드포인트 테스트
node test-api-endpoints.js

# YouTube API 서비스 테스트
node test-api.js
```

### 수동 테스트
1. 브라우저에서 http://localhost:3000 접속
2. 검색어 입력 후 검색 버튼 클릭
3. 검색 결과 확인
4. 영상 카드 클릭하여 재생 확인

## ⚡ 성능 최적화

- **캐싱**: 검색 결과 5분 캐싱
- **로깅**: 구조화된 로깅 시스템
- **에러 처리**: 포괄적인 에러 처리
- **타임아웃**: 요청 타임아웃 설정

## 🛡️ 보안

- **환경 변수**: API 키 등 민감한 정보 환경 변수로 관리
- **입력 검증**: 사용자 입력 검증 및 제한
- **에러 처리**: 상세한 에러 정보 노출 방지

## 📝 개발 가이드

### Plan/Act 워크플로우

이 프로젝트는 Plan/Act 기반 개발 워크플로우를 따릅니다:

1. **Plan**: 계획 수립 및 설계
2. **Act**: 실제 구현
3. **Review**: 결과 검토
4. **Update**: 메모리 뱅크 업데이트

### 메모리 뱅크 활용

- `memory_bank/` 디렉토리의 문서들을 참조하여 일관성 유지
- 새로운 기능 개발 시 `plan.md` 생성
- 중요한 변경사항은 `progress.md`에 기록

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

---

**개발자**: AI Assistant  
**버전**: 1.0.0  
**최종 업데이트**: 2025-09-28
