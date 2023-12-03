// https://stackoverflow.com/a/73238135/3491874
export function assertRequired<T extends object>(obj: T): asserts obj is
    { [K in keyof T]: Exclude<T[K], null | undefined> } {
    Object.entries(obj).forEach(([k, v]) => {
        if (v === null || v === undefined)
            throw new Error(`OH NOEZ, PROP ${k} IS ${v}`);
    });
}

declare global {
    interface Array<T> {
        sum(): number
    }
}

Array.prototype.sum = function() {
    return this.reduce((t, x) => t + x, 0)
}
