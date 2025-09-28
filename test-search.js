// 검색 기능 테스트 스크립트
const axios = require('axios');

async function testSearchFunction() {
    console.log('🧪 검색 기능 테스트 시작...\n');
    
    try {
        // 1. Health Check
        console.log('1️⃣ Health Check...');
        const healthResponse = await axios.get('http://localhost:3000/api/health');
        console.log('✅ Health Check 성공:', healthResponse.data.message);
        console.log('📊 YouTube 서비스 상태:', healthResponse.data.youtubeService);
        
        // 2. 검색 테스트
        console.log('\n2️⃣ 검색 기능 테스트...');
        const searchResponse = await axios.post('http://localhost:3000/api/search', {
            query: 'music',
            maxResults: 3
        });
        
        console.log('✅ 검색 성공:');
        console.log(`   - 검색어: ${searchResponse.data.query}`);
        console.log(`   - 결과 수: ${searchResponse.data.totalResults}개`);
        console.log(`   - 메시지: ${searchResponse.data.message}`);
        
        if (searchResponse.data.videos && searchResponse.data.videos.length > 0) {
            console.log('\n📺 검색된 영상들:');
            searchResponse.data.videos.forEach((video, index) => {
                console.log(`   ${index + 1}. ${video.title}`);
                console.log(`      채널: ${video.channelTitle}`);
                console.log(`      ID: ${video.id}`);
                console.log(`      썸네일: ${video.thumbnail}`);
            });
        }
        
        // 3. 영상 상세 정보 테스트
        if (searchResponse.data.videos && searchResponse.data.videos.length > 0) {
            const firstVideo = searchResponse.data.videos[0];
            console.log(`\n3️⃣ 영상 상세 정보 테스트 (ID: ${firstVideo.id})...`);
            
            try {
                const videoResponse = await axios.get(`http://localhost:3000/api/video/${firstVideo.id}`);
                console.log('✅ 영상 상세 정보 성공:');
                console.log(`   - 제목: ${videoResponse.data.video.title}`);
                console.log(`   - 채널: ${videoResponse.data.video.channelTitle}`);
                console.log(`   - 조회수: ${videoResponse.data.video.viewCount || 'N/A'}`);
            } catch (error) {
                console.log('⚠️ 영상 상세 정보 조회 실패:', error.response?.data?.message || error.message);
            }
        }
        
        console.log('\n🎉 검색 기능 테스트가 완료되었습니다!');
        console.log('\n💡 브라우저에서 http://localhost:3000 에 접속하여 실제 UI를 테스트해보세요.');
        
    } catch (error) {
        console.error('❌ 테스트 실패:', error.response?.data || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 해결 방법: 서버가 실행 중인지 확인해주세요.');
            console.log('   node server.js');
        }
    }
}

// 테스트 실행
testSearchFunction();
