// YouTube API 서비스 테스트 스크립트
require('dotenv').config();
const YouTubeService = require('./services/youtubeService');

async function testYouTubeAPI() {
    console.log('🧪 YouTube API 서비스 테스트 시작...\n');
    
    try {
        // YouTubeService 인스턴스 생성
        const youtubeService = new YouTubeService();
        console.log('✅ YouTubeService 인스턴스 생성 성공');
        
        // API 키 유효성 검사
        console.log('🔑 API 키 유효성 검사 중...');
        const isValid = await youtubeService.validateApiKey();
        
        if (isValid) {
            console.log('✅ API 키가 유효합니다');
            
            // 테스트 검색 실행
            console.log('🔍 테스트 검색 실행 중...');
            const results = await youtubeService.searchVideos('Node.js tutorial', 3);
            
            console.log(`📊 검색 결과: ${results.length}개 영상 발견`);
            results.forEach((video, index) => {
                console.log(`\n${index + 1}. ${video.title}`);
                console.log(`   채널: ${video.channelTitle}`);
                console.log(`   ID: ${video.id}`);
            });
            
        } else {
            console.log('❌ API 키가 유효하지 않습니다. .env 파일을 확인해주세요.');
        }
        
    } catch (error) {
        console.error('❌ 테스트 실패:', error.message);
        
        if (error.message.includes('YOUTUBE_API_KEY가 설정되지 않았습니다')) {
            console.log('\n💡 해결 방법:');
            console.log('1. Google Cloud Console에서 YouTube Data API v3 활성화');
            console.log('2. API 키 발급');
            console.log('3. .env 파일에 YOUTUBE_API_KEY=your_api_key_here 추가');
        }
    }
}

// 테스트 실행
testYouTubeAPI();
