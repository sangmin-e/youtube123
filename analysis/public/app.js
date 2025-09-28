// YouTube 분석 도구 - 클라이언트 사이드 JavaScript

class YouTubeAnalyzer {
    constructor() {
        this.analysisForm = document.getElementById('analysisForm');
        this.youtubeUrl = document.getElementById('youtubeUrl');
        this.progressSection = document.getElementById('progressSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.logContainer = document.getElementById('logContainer');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.progressPercent = document.getElementById('progressPercent');
        
        this.socket = null;
        this.currentCollectionId = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        // 폼 제출 이벤트
        this.analysisForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startAnalysis();
        });

        // 내보내기 버튼 이벤트
        document.getElementById('exportPdf').addEventListener('click', () => this.exportResults('pdf'));
        document.getElementById('exportExcel').addEventListener('click', () => this.exportResults('excel'));
        document.getElementById('shareResults').addEventListener('click', () => this.shareResults());

        // Socket.io 연결
        this.connectSocket();
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Socket.io 연결됨');
        });

        this.socket.on('analysis_progress', (data) => {
            this.updateProgress(data);
        });

        this.socket.on('analysis_complete', (data) => {
            this.showResults(data);
        });

        this.socket.on('analysis_error', (error) => {
            this.showError(error);
        });
    }

    async startAnalysis() {
        const url = this.youtubeUrl.value.trim();
        const period = document.getElementById('collectionPeriod').value;
        const interval = document.getElementById('collectionInterval').value;

        if (!url) {
            this.showMessage('YouTube URL을 입력해주세요.', 'error');
            return;
        }

        this.showLoading(true);
        this.progressSection.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');

        try {
            const response = await fetch('/analysis/collect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    options: {
                        period: parseInt(period),
                        interval: parseInt(interval)
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentCollectionId = data.collectionId;
                this.addLog('분석이 시작되었습니다.');
                this.startProgressMonitoring();
            } else {
                throw new Error(data.message || '분석 시작에 실패했습니다.');
            }

        } catch (error) {
            console.error('분석 시작 오류:', error);
            this.showMessage(error.message || '분석 시작 중 오류가 발생했습니다.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    startProgressMonitoring() {
        if (!this.currentCollectionId) return;

        const checkProgress = async () => {
            try {
                const response = await fetch(`/analysis/status/${this.currentCollectionId}`);
                const data = await response.json();

                if (data.success) {
                    this.updateProgress({
                        status: data.status,
                        progress: data.progress,
                        message: data.message
                    });

                    if (data.status === 'completed') {
                        this.loadResults();
                    } else if (data.status === 'failed') {
                        this.showError({ message: '분석에 실패했습니다.' });
                    } else {
                        // 계속 모니터링
                        setTimeout(checkProgress, 2000);
                    }
                }
            } catch (error) {
                console.error('진행 상황 확인 오류:', error);
                setTimeout(checkProgress, 5000);
            }
        };

        checkProgress();
    }

    updateProgress(data) {
        this.progressBar.style.width = `${data.progress}%`;
        this.progressPercent.textContent = `${data.progress}%`;
        this.progressText.textContent = data.message;
        
        this.addLog(data.message);
    }

    async loadResults() {
        if (!this.currentCollectionId) return;

        try {
            const response = await fetch(`/analysis/results/${this.currentCollectionId}`);
            const data = await response.json();

            if (data.success) {
                this.showResults(data.results);
            } else {
                throw new Error(data.message || '결과를 불러올 수 없습니다.');
            }
        } catch (error) {
            console.error('결과 로드 오류:', error);
            this.showError({ message: '결과를 불러오는 중 오류가 발생했습니다.' });
        }
    }

    showResults(results) {
        this.progressSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');

        // 기본 정보 표시
        this.displayBasicInfo(results.videoInfo);
        
        // 차트 생성
        this.createCharts(results.analysis);
        
        this.addLog('분석이 완료되었습니다.');
    }

    displayBasicInfo(videoInfo) {
        const basicInfo = document.getElementById('basicInfo');
        basicInfo.innerHTML = `
            <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-medium text-blue-800">영상 제목</h4>
                <p class="text-blue-600 text-sm mt-1">${videoInfo.title}</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
                <h4 class="font-medium text-green-800">채널</h4>
                <p class="text-green-600 text-sm mt-1">${videoInfo.channel}</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
                <h4 class="font-medium text-purple-800">조회수</h4>
                <p class="text-purple-600 text-sm mt-1">${this.formatNumber(videoInfo.views)}</p>
            </div>
            <div class="bg-orange-50 rounded-lg p-4">
                <h4 class="font-medium text-orange-800">좋아요</h4>
                <p class="text-orange-600 text-sm mt-1">${this.formatNumber(videoInfo.likes)}</p>
            </div>
        `;
    }

    createCharts(analysis) {
        // 조회수 변화 차트
        const viewsCtx = document.getElementById('viewsChart').getContext('2d');
        this.charts.views = new Chart(viewsCtx, {
            type: 'line',
            data: {
                labels: ['1일 전', '2일 전', '3일 전', '4일 전', '5일 전', '6일 전', '오늘'],
                datasets: [{
                    label: '조회수',
                    data: [850000, 920000, 880000, 950000, 1000000, 980000, 1000000],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // 참여도 분석 차트
        const engagementCtx = document.getElementById('engagementChart').getContext('2d');
        this.charts.engagement = new Chart(engagementCtx, {
            type: 'doughnut',
            data: {
                labels: ['좋아요', '댓글', '공유'],
                datasets: [{
                    data: [analysis.engagementRate * 20, 10, 5],
                    backgroundColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(168, 85, 247)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    async exportResults(format) {
        if (!this.currentCollectionId) {
            this.showMessage('내보낼 결과가 없습니다.', 'error');
            return;
        }

        try {
            const response = await fetch(`/analysis/export/${this.currentCollectionId}?format=${format}`);
            const data = await response.json();

            if (data.success) {
                // 파일 다운로드
                window.open(data.downloadUrl, '_blank');
                this.showMessage(`${format.toUpperCase()} 파일이 생성되었습니다.`, 'success');
            } else {
                throw new Error(data.message || '내보내기에 실패했습니다.');
            }
        } catch (error) {
            console.error('내보내기 오류:', error);
            this.showMessage(error.message || '내보내기 중 오류가 발생했습니다.', 'error');
        }
    }

    shareResults() {
        if (!this.currentCollectionId) {
            this.showMessage('공유할 결과가 없습니다.', 'error');
            return;
        }

        const shareUrl = `${window.location.origin}/analysis/results/${this.currentCollectionId}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'YouTube 분석 결과',
                text: 'YouTube 영상 분석 결과를 확인해보세요!',
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showMessage('링크가 클립보드에 복사되었습니다.', 'success');
            });
        }
    }

    addLog(message) {
        const logElement = document.createElement('div');
        logElement.className = 'text-sm text-gray-600 mb-1';
        logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        this.logContainer.appendChild(logElement);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    showLoading(show) {
        this.loadingSpinner.classList.toggle('hidden', !show);
    }

    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg text-white z-50 shadow-lg ${
            type === 'error' ? 'bg-red-500' : 
            type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`;
        
        const icon = type === 'error' ? '❌' : 
                    type === 'success' ? '✅' : 'ℹ️';
        
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <span>${icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showError(error) {
        this.showMessage(error.message || '오류가 발생했습니다.', 'error');
        this.progressSection.classList.add('hidden');
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// 앱 초기화
const youtubeAnalyzer = new YouTubeAnalyzer();
