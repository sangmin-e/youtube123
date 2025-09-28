// 로깅 유틸리티
class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    info(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ℹ️  INFO: ${message}`);
        if (data && this.isDevelopment) {
            console.log('📊 데이터:', data);
        }
    }

    success(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ✅ SUCCESS: ${message}`);
        if (data && this.isDevelopment) {
            console.log('📊 데이터:', data);
        }
    }

    warning(message, data = null) {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] ⚠️  WARNING: ${message}`);
        if (data && this.isDevelopment) {
            console.warn('📊 데이터:', data);
        }
    }

    error(message, error = null) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ❌ ERROR: ${message}`);
        if (error) {
            console.error('🔍 에러 상세:', error);
            if (this.isDevelopment && error.stack) {
                console.error('📚 스택 트레이스:', error.stack);
            }
        }
    }

    apiRequest(method, url, status, duration) {
        const timestamp = new Date().toISOString();
        const statusIcon = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
        console.log(`[${timestamp}] ${statusIcon} API: ${method} ${url} - ${status} (${duration}ms)`);
    }

    searchQuery(query, resultCount, duration) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 🔍 SEARCH: "${query}" → ${resultCount}개 결과 (${duration}ms)`);
    }
}

module.exports = new Logger();
