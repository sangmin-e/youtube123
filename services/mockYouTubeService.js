// Mock YouTube Service - API 키 없이 테스트용
class MockYouTubeService {
    constructor() {
        this.mockVideos = [
            {
                id: 'dQw4w9WgXcQ',
                title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
                description: 'The official video for "Never Gonna Give You Up" by Rick Astley',
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
                channelTitle: 'Rick Astley',
                publishedAt: '2009-10-25T06:57:33Z'
            },
            {
                id: 'jNQXAC9IVRw',
                title: 'Me at the zoo',
                description: 'The first video ever uploaded to YouTube',
                thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg',
                channelTitle: 'jawed',
                publishedAt: '2005-04-23T20:33:31Z'
            },
            {
                id: 'kJQP7kiw5Fk',
                title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
                description: 'Luis Fonsi - Despacito ft. Daddy Yankee',
                thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
                channelTitle: 'Luis Fonsi',
                publishedAt: '2017-01-13T04:00:00Z'
            },
            {
                id: '9bZkp7q19f0',
                title: 'PSY - GANGNAM STYLE (강남스타일) M/V',
                description: 'PSY - GANGNAM STYLE (강남스타일) M/V',
                thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
                channelTitle: 'officialpsy',
                publishedAt: '2012-07-15T07:00:00Z'
            },
            {
                id: 'YQHsXMglC9A',
                title: 'Adele - Hello',
                description: 'Adele - Hello',
                thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/mqdefault.jpg',
                channelTitle: 'Adele',
                publishedAt: '2015-10-23T07:00:00Z'
            },
            {
                id: 'kJQP7kiw5Fk',
                title: 'Ed Sheeran - Shape of You [Official Video]',
                description: 'Ed Sheeran - Shape of You [Official Video]',
                thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
                channelTitle: 'Ed Sheeran',
                publishedAt: '2017-01-30T14:00:00Z'
            }
        ];
    }

    async searchVideos(query, maxResults = 12) {
        // Mock 지연 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 검색어에 따라 필터링 (간단한 구현)
        const filteredVideos = this.mockVideos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.channelTitle.toLowerCase().includes(query.toLowerCase())
        );
        
        // 결과가 없으면 모든 비디오 반환
        const results = filteredVideos.length > 0 ? filteredVideos : this.mockVideos;
        
        return results.slice(0, maxResults);
    }

    async getVideoDetails(videoId) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const video = this.mockVideos.find(v => v.id === videoId);
        if (!video) {
            throw new Error('영상을 찾을 수 없습니다.');
        }
        
        return {
            ...video,
            viewCount: Math.floor(Math.random() * 1000000000).toString(),
            likeCount: Math.floor(Math.random() * 10000000).toString(),
            duration: 'PT3M33S'
        };
    }

    async validateApiKey() {
        return true; // Mock에서는 항상 유효
    }
}

module.exports = MockYouTubeService;
