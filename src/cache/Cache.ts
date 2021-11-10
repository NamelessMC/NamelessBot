import { Collection } from "discord.js";

class Cache<T> {

    private values: Collection<string, T> = new Collection();
    private maxEntries: number = 20;

    public get(key: string): T | undefined {
        const hasKey = this.values.has(key);
        let entry: T | undefined;
        if (hasKey) {
            entry = this.values.get(key)!;
            this.values.delete(key);
            this.values.set(key, entry);
        }

        return entry;
    }

    public put(key: string, value: T) {
        if (this.values.size >= this.maxEntries) {
            const keyToDelete = this.values.keys().next().value;
            this.values.delete(keyToDelete);
        }

        this.values.set(key, value);
    }

    public clear() {
        this.values.clear();
    }
}

export default Cache;