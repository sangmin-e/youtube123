// 간단한 메모리 캐시 구현
class Cache {
    constructor(ttl = 5 * 60 * 1000) { // 기본 5분 TTL
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, value, customTtl = null) {
        const expiresAt = Date.now() + (customTtl || this.ttl);
        this.cache.set(key, {
            value,
            expiresAt
        });
    }

    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    has(key) {
        return this.get(key) !== null;
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }

    // 만료된 항목들 정리
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

module.exports = Cache;
