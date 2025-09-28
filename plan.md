# 유튜브 플레이어 웹앱 개발 계획

## 1. 기능 개요  
- **목표**: Node.js 기반의 빠르고 반응형인 유튜브 영상 검색 및 재생 도구 구현으로 사용자 친화적인 인터페이스 제공
- **범위**: 
  - ✅ 구현할 내용: 영상 검색, 영상 재생, 반응형 UI, 에러 처리
  - ❌ 구현하지 않을 내용: 사용자 계정 관리, 영상 업로드, 댓글 시스템

## 2. 기술 설계  
- **아키텍처**: 
  - 백엔드: Node.js + Express (API 요청 처리 및 비즈니스 로직)
  - 프론트엔드: HTML5 + Vanilla JavaScript + Tailwind CSS (반응형 UI)
  - 외부 API: YouTube Data API v3 (영상 검색)
  
- **데이터 모델**: 
  - 검색 결과: {videoId, title, thumbnail, channelTitle, publishedAt}
  - API 응답: YouTube API v3 search 엔드포인트 응답 구조
  
- **API 명세**: 
  - GET/POST `/api/search`: 검색어를 받아 유튜브 영상 목록 반환
  - 요청: `{query: string}`
  - 응답: `{videos: Array<{id, title, thumbnail, channelTitle}>}`

## 3. 변경 파일 목록  
- **생성할 파일들**:
  - `package.json` (Node.js 프로젝트 설정)
  - `server.js` (Express 서버 메인 파일)
  - `routes/api.js` (API 라우터)
  - `services/youtubeService.js` (YouTube API 서비스)
  - `views/index.ejs` (메인 템플릿)
  - `public/index.html` (클라이언트 HTML)
  - `public/app.js` (클라이언트 JavaScript)
  - `public/style.css` (Tailwind CSS 스타일)
  - `.env` (환경 변수)
  - `.gitignore` (Git 무시 파일)

## 4. 구현 단계 (Step-by-Step)  
- **1단계 - 기반 환경 설정**: 
  - Node.js 프로젝트 초기화 (npm init)
  - Express, EJS, dotenv, axios 설치
  - 기본 Express 서버 및 뷰 라우트 설정
  - 산출물: package.json, server.js, 기본 index.ejs

- **2단계 - YouTube API 설정**: 
  - Google Cloud Console에서 YouTube Data API v3 활성화
  - API 키 발급 및 .env 파일에 저장
  - API 요청 처리 서비스 모듈 생성
  - 산출물: .env 파일, youtubeService.js

- **3단계 - 검색 백엔드 구현**: 
  - /api/search 라우트 생성
  - 검색어를 받아 YouTube API 호출
  - 응답 데이터 정제하여 JSON 반환
  - 산출물: routes/api.js

- **4단계 - 프론트엔드 UI 구축**: 
  - 검색 폼 및 재생 영역 구현
  - Tailwind CSS로 반응형 디자인 적용
  - JavaScript 이벤트 리스너 추가
  - 산출물: public/index.html, public/style.css, public/app.js

- **5단계 - 동적 검색 및 재생 구현**: 
  - Fetch API로 /api/search 호출
  - 영상 목록을 카드 형태로 동적 렌더링
  - 카드 클릭 시 YouTube 임베드 플레이어에 영상 로드
  - 산출물: public/app.js (데이터 바인딩 및 이벤트 처리)

- **6단계 - 안정화 및 에러 처리**: 
  - API Rate Limit 및 네트워크 오류 처리
  - 검색 결과 없을 시 사용자 피드백
  - 로딩 상태 표시 (선택사항)
  - 산출물: 모든 파일에 에러 핸들링 로직 추가

## 5. 테스트 계획  
- **단위 테스트**: 
  - youtubeService.js의 API 호출 함수 테스트
  - Express 라우트 핸들러 테스트
  - 클라이언트 JavaScript 유틸리티 함수 테스트

- **통합 테스트**: 
  - 전체 검색 플로우 테스트 (검색어 입력 → API 호출 → 결과 표시)
  - 영상 재생 플로우 테스트 (영상 선택 → 플레이어 로드)
  - 에러 상황 시나리오 테스트

- **사용자 시나리오 테스트**: 
  - 모바일/데스크탑에서의 반응형 동작 확인
  - 다양한 검색어로 검색 결과 정확성 확인
  - 영상 재생 및 컨트롤 기능 확인
