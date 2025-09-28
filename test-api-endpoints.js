// API 엔드포인트 테스트 스크립트
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPIEndpoints() {
    console.log('🧪 API 엔드포인트 테스트 시작...\n');
    
    try {
        // 1. Health Check 테스트
        console.log('1️⃣ Health Check 테스트...');
        const healthResponse = await axios.get(`${BASE_URL}/api/health`);
        console.log('✅ Health Check 성공:', healthResponse.data.message);
        
        // 2. 검색 API 테스트 (POST)
        console.log('\n2️⃣ 검색 API 테스트 (POST)...');
        const searchResponse = await axios.post(`${BASE_URL}/api/search`, {
            query: 'Node.js tutorial',
            maxResults: 3
        });
        
        console.log('✅ 검색 API 성공:');
        console.log(`   - 검색어: ${searchResponse.data.query}`);
        console.log(`   - 결과 수: ${searchResponse.data.totalResults}개`);
        console.log(`   - 메시지: ${searchResponse.data.message}`);
        
        if (searchResponse.data.videos.length > 0) {
            console.log('\n📺 검색된 영상들:');
            searchResponse.data.videos.forEach((video, index) => {
                console.log(`   ${index + 1}. ${video.title}`);
                console.log(`      채널: ${video.channelTitle}`);
                console.log(`      ID: ${video.id}`);
            });
            
            // 3. 영상 상세 정보 테스트
            const firstVideo = searchResponse.data.videos[0];
            console.log(`\n3️⃣ 영상 상세 정보 테스트 (ID: ${firstVideo.id})...`);
            
            const videoResponse = await axios.get(`${BASE_URL}/api/video/${firstVideo.id}`);
            console.log('✅ 영상 상세 정보 성공:');
            console.log(`   - 제목: ${videoResponse.data.video.title}`);
            console.log(`   - 채널: ${videoResponse.data.video.channelTitle}`);
            console.log(`   - 조회수: ${videoResponse.data.video.viewCount || 'N/A'}`);
        }
        
        // 4. GET 방식 검색 테스트
        console.log('\n4️⃣ GET 방식 검색 테스트...');
        const getSearchResponse = await axios.get(`${BASE_URL}/api/search?q=JavaScript&maxResults=2`);
        console.log('✅ GET 검색 성공:', getSearchResponse.data.message);
        
        console.log('\n🎉 모든 API 테스트가 성공적으로 완료되었습니다!');
        
    } catch (error) {
        console.error('❌ API 테스트 실패:', error.response?.data || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 해결 방법: 서버가 실행 중인지 확인해주세요.');
            console.log('   npm start 또는 node server.js');
        } else if (error.response?.status === 500) {
            console.log('\n💡 해결 방법: YouTube API 키를 설정해주세요.');
            console.log('   .env 파일에 YOUTUBE_API_KEY=your_api_key_here 추가');
        }
    }
}

// 테스트 실행
testAPIEndpoints();
