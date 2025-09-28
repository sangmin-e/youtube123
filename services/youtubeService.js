const axios = require('axios');

class YouTubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
        
        if (!this.apiKey) {
            throw new Error('YOUTUBE_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
        }
    }

    /**
     * YouTube 영상 검색
     * @param {string} query - 검색어
     * @param {number} maxResults - 최대 결과 수 (기본값: 12)
     * @returns {Promise<Array>} 검색된 영상 목록
     */
    async searchVideos(query, maxResults = 12) {
        try {
            const response = await axios.get(`${this.baseUrl}/search`, {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: maxResults,
                    key: this.apiKey,
                    order: 'relevance'
                }
            });

            if (!response.data.items) {
                return [];
            }

            // 검색 결과를 정제하여 반환
            return response.data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt
            }));

        } catch (error) {
            console.error('YouTube API 검색 오류:', error.response?.data || error.message);
            
            // API 오류 타입별 처리
            if (error.response?.status === 403) {
                throw new Error('YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
            } else if (error.response?.status === 400) {
                throw new Error('잘못된 API 요청입니다. API 키를 확인해주세요.');
            } else if (error.response?.status === 404) {
                throw new Error('YouTube API를 찾을 수 없습니다.');
            } else {
                throw new Error('YouTube API 요청 중 오류가 발생했습니다.');
            }
        }
    }

    /**
     * 특정 영상의 상세 정보 조회
     * @param {string} videoId - 영상 ID
     * @returns {Promise<Object>} 영상 상세 정보
     */
    async getVideoDetails(videoId) {
        try {
            const response = await axios.get(`${this.baseUrl}/videos`, {
                params: {
                    part: 'snippet,statistics',
                    id: videoId,
                    key: this.apiKey
                }
            });

            if (!response.data.items || response.data.items.length === 0) {
                throw new Error('영상을 찾을 수 없습니다.');
            }

            const video = response.data.items[0];
            return {
                id: video.id,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
                channelTitle: video.snippet.channelTitle,
                publishedAt: video.snippet.publishedAt,
                viewCount: video.statistics.viewCount,
                likeCount: video.statistics.likeCount,
                duration: video.contentDetails?.duration
            };

        } catch (error) {
            console.error('YouTube API 영상 상세 조회 오류:', error.response?.data || error.message);
            throw new Error('영상 정보를 가져오는 중 오류가 발생했습니다.');
        }
    }

    /**
     * API 키 유효성 검사
     * @returns {Promise<boolean>} API 키 유효성
     */
    async validateApiKey() {
        try {
            const response = await axios.get(`${this.baseUrl}/search`, {
                params: {
                    part: 'snippet',
                    q: 'test',
                    type: 'video',
                    maxResults: 1,
                    key: this.apiKey
                }
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

module.exports = YouTubeService;
