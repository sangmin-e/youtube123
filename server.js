const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 서빙 (CSS, JS, 이미지 등)
app.use(express.static(path.join(__dirname, 'public')));

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트 연결
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Mock 서비스 활성화 (API 키가 없을 때)
if (!process.env.YOUTUBE_API_KEY) {
    console.log('⚠️  YouTube API 키가 설정되지 않았습니다. Mock 서비스를 사용합니다.');
    console.log('💡 실제 YouTube API를 사용하려면 .env 파일에 YOUTUBE_API_KEY를 설정하세요.');
}

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'YouTube Player',
        message: '유튜브 영상을 검색하고 재생해보세요!'
    });
});

// 404 에러 처리 (모든 라우트를 처리한 후 마지막에 실행)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: '페이지를 찾을 수 없습니다',
        message: '요청하신 페이지가 존재하지 않습니다.',
        path: req.originalUrl
    });
});

// 전역 에러 처리 미들웨어
app.use((error, req, res, next) => {
    console.error('🚨 서버 에러:', error);
    
    res.status(500).json({
        success: false,
        error: '서버 내부 오류',
        message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`📁 정적 파일: ${path.join(__dirname, 'public')}`);
    console.log(`📄 뷰 파일: ${path.join(__dirname, 'views')}`);
});

// Graceful shutdown 처리
process.on('SIGTERM', () => {
    console.log('🛑 서버 종료 신호를 받았습니다. 서버를 종료합니다.');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 서버 종료 신호를 받았습니다. 서버를 종료합니다.');
    process.exit(0);
});

module.exports = app;
