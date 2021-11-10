class Cache<T> {

    private value: T | undefined;
    private updatedAt: number | undefined;
    private expireTime: number = 60*1000*60*12; // 60*1000=60seconds*60=1hour*12=1day


    constructor(expireTime?: number) {
        if (expireTime) this.expireTime = expireTime;
    }

    public get(): T | undefined {
        
        if (!this.value || !this.updatedAt) {
            return undefined;
        }

        if ((Date.now() - this.updatedAt) > this.expireTime) {
            delete this.updatedAt;
            delete this.value;
        }
    }

    public put(value: T) {
        this.value = value;
        this.updatedAt = Date.now();
    }

    public clear() {
        delete this.value;
        delete this.updatedAt;
    }
}

export default Cache;