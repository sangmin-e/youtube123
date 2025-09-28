// YouTube Player App - 클라이언트 사이드 JavaScript

class YouTubePlayer {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.playerContainer = document.getElementById('playerContainer');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        this.init();
    }

    init() {
        // 검색 폼 이벤트 리스너
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        
        if (!query) {
            this.showMessage('검색어를 입력해주세요.', 'error');
            return;
        }

        // 검색어 길이 제한
        if (query.length > 100) {
            this.showMessage('검색어는 100자 이하로 입력해주세요.', 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            // 요청 타임아웃 설정 (10초)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, maxResults: 12 }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.displaySearchResults(data.videos);
                this.showMessage(data.message, 'success');
            } else {
                throw new Error(data.message || '검색에 실패했습니다.');
            }
            
        } catch (error) {
            console.error('검색 오류:', error);
            
            // 에러 타입별 처리
            if (error.name === 'AbortError') {
                this.showMessage('검색 시간이 초과되었습니다. 다시 시도해주세요.', 'error');
            } else if (error.message.includes('Failed to fetch')) {
                this.showMessage('네트워크 연결을 확인해주세요.', 'error');
            } else {
                this.showMessage(error.message || '검색 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
            }
        } finally {
            this.showLoading(false);
        }
    }

    displaySearchResults(videos) {
        if (!videos || videos.length === 0) {
            this.searchResults.innerHTML = `
                <p class="text-gray-500 col-span-full text-center py-8">
                    검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                </p>
            `;
            return;
        }

        this.searchResults.innerHTML = videos.map(video => `
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                 onclick="youtubePlayer.playVideo('${video.id}', '${video.title}')">
                <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">${video.title}</h3>
                    <p class="text-gray-600 text-xs mb-1">${video.channelTitle}</p>
                    <p class="text-gray-500 text-xs">${this.formatDate(video.publishedAt)}</p>
                </div>
            </div>
        `).join('');
    }

    playVideo(videoId, title) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        this.playerContainer.innerHTML = `
            <div class="w-full h-full">
                <iframe 
                    src="${embedUrl}" 
                    title="${title}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    class="w-full h-full rounded-lg">
                </iframe>
            </div>
        `;
        
        // 재생 영역으로 스크롤
        this.playerContainer.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading(show) {
        this.loadingSpinner.classList.toggle('hidden', !show);
    }

    showMessage(message, type = 'info') {
        // 기존 토스트 메시지 제거
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }

        // 새로운 토스트 메시지 생성
        const toast = document.createElement('div');
        toast.className = `toast-message fixed top-4 right-4 px-4 py-3 rounded-lg text-white z-50 shadow-lg transform transition-all duration-300 ${
            type === 'error' ? 'bg-red-500' : 
            type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`;
        
        // 아이콘 추가
        const icon = type === 'error' ? '❌' : 
                    type === 'success' ? '✅' : 'ℹ️';
        
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <span>${icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // 애니메이션 효과
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// 앱 초기화
const youtubePlayer = new YouTubePlayer();
