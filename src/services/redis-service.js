const {connectToRedis} = require('./../config/redis')

class RedisService {
    constructor() {
        this.client = null;
    }

    async init() {
        if (!this.client) {
            this.client = await connectToRedis();
        }
    }

    async get(key) {
        await this.init();
        return await this.client.get(key);
    }

    async set(key, value, expiry = 300) {
        await this.init();
        const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;

        return await this.client.set(key, serializedValue, {
            EX: expiry,
        });
    }

    async delete(key) {
        await this.init();
        return await this.client.del(key);
    }

    async exists(key) {
        await this.init();
        return await this.client.exists(key);
    }
}

module.exports = RedisService;