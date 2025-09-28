const express = require('express');
const YouTubeService = require('../services/youtubeService');
const MockYouTubeService = require('../services/mockYouTubeService');
const logger = require('../utils/logger');
const Cache = require('../utils/cache');
const router = express.Router();

// 검색 결과 캐시 (5분 TTL)
const searchCache = new Cache(5 * 60 * 1000);

// YouTube API 서비스 인스턴스 생성
let youtubeService;
try {
    youtubeService = new YouTubeService();
} catch (error) {
    console.error('YouTube 서비스 초기화 실패:', error.message);
    console.log('🔄 Mock 서비스로 전환합니다.');
    youtubeService = new MockYouTubeService();
}

/**
 * POST /api/search - YouTube 영상 검색
 * @body {string} query - 검색어
 * @body {number} maxResults - 최대 결과 수 (선택사항, 기본값: 12)
 */
router.post('/search', async (req, res) => {
    try {
        // YouTube 서비스가 초기화되지 않은 경우
        if (!youtubeService) {
            return res.status(500).json({
                success: false,
                error: 'YouTube API가 설정되지 않았습니다. API 키를 확인해주세요.',
                message: '서버 관리자에게 문의하세요.'
            });
        }

        // 요청 데이터 검증
        const { query, maxResults = 12 } = req.body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: '검색어가 필요합니다.',
                message: '유효한 검색어를 입력해주세요.'
            });
        }

        // 검색어 길이 제한 (YouTube API 제한 고려)
        if (query.length > 100) {
            return res.status(400).json({
                success: false,
                error: '검색어가 너무 깁니다.',
                message: '검색어는 100자 이하로 입력해주세요.'
            });
        }

        // 최대 결과 수 검증
        const validMaxResults = Math.min(Math.max(parseInt(maxResults) || 12, 1), 50);

        const cacheKey = `${query.trim()}_${validMaxResults}`;
        
        // 캐시에서 검색 결과 확인
        let videos = searchCache.get(cacheKey);
        let fromCache = false;
        
        if (videos) {
            logger.info(`캐시에서 검색 결과 반환: "${query}"`);
            fromCache = true;
        } else {
            const startTime = Date.now();
            logger.searchQuery(query, validMaxResults, 0);

            // YouTube API 검색 실행
            videos = await youtubeService.searchVideos(query.trim(), validMaxResults);
            
            const duration = Date.now() - startTime;
            logger.searchQuery(query, videos.length, duration);
            
            // 검색 결과를 캐시에 저장
            searchCache.set(cacheKey, videos);
            logger.info(`검색 결과 캐시 저장: "${query}"`);
        }

        // 검색 결과 반환
        res.json({
            success: true,
            query: query.trim(),
            totalResults: videos.length,
            videos: videos,
            fromCache: fromCache,
            message: videos.length > 0 
                ? `${videos.length}개의 영상을 찾았습니다.${fromCache ? ' (캐시됨)' : ''}` 
                : '검색 결과가 없습니다. 다른 검색어를 시도해보세요.'
        });

    } catch (error) {
        logger.error('검색 API 오류', error);

        // 에러 타입별 응답
        if (error.message.includes('할당량이 초과')) {
            res.status(429).json({
                success: false,
                error: 'API 할당량 초과',
                message: 'YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.'
            });
        } else if (error.message.includes('API 키')) {
            res.status(500).json({
                success: false,
                error: 'API 키 오류',
                message: 'YouTube API 키 설정에 문제가 있습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                error: '검색 중 오류 발생',
                message: '영상 검색 중 오류가 발생했습니다. 다시 시도해주세요.'
            });
        }
    }
});

/**
 * GET /api/search - GET 방식으로도 검색 가능 (URL 파라미터)
 * @query {string} q - 검색어
 * @query {number} maxResults - 최대 결과 수 (선택사항)
 */
router.get('/search', async (req, res) => {
    try {
        const { q: query, maxResults = 12 } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: '검색어가 필요합니다.',
                message: 'q 파라미터를 제공해주세요.'
            });
        }

        // POST 방식과 동일한 로직 사용
        req.body = { query, maxResults };
        return router.handle({ ...req, method: 'POST' }, res);

    } catch (error) {
        console.error('GET 검색 API 오류:', error.message);
        res.status(500).json({
            success: false,
            error: '검색 중 오류 발생',
            message: '영상 검색 중 오류가 발생했습니다.'
        });
    }
});

/**
 * GET /api/health - API 상태 확인
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'YouTube Player API가 정상 작동 중입니다.',
        timestamp: new Date().toISOString(),
        youtubeService: youtubeService ? '연결됨' : '연결 안됨'
    });
});

/**
 * GET /api/video/:id - 특정 영상 상세 정보 조회
 */
router.get('/video/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: '영상 ID가 필요합니다.',
                message: '유효한 영상 ID를 제공해주세요.'
            });
        }

        if (!youtubeService) {
            return res.status(500).json({
                success: false,
                error: 'YouTube API가 설정되지 않았습니다.',
                message: '서버 관리자에게 문의하세요.'
            });
        }

        const videoDetails = await youtubeService.getVideoDetails(id);

        res.json({
            success: true,
            video: videoDetails,
            message: '영상 정보를 성공적으로 가져왔습니다.'
        });

    } catch (error) {
        console.error('영상 상세 조회 오류:', error.message);

        if (error.message.includes('찾을 수 없습니다')) {
            res.status(404).json({
                success: false,
                error: '영상을 찾을 수 없습니다.',
                message: '존재하지 않는 영상 ID입니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                error: '영상 정보 조회 중 오류 발생',
                message: '영상 정보를 가져오는 중 오류가 발생했습니다.'
            });
        }
    }
});

module.exports = router;
