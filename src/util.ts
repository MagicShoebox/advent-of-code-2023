// https://stackoverflow.com/a/73238135/3491874
export function assertRequired<T extends object>(obj: T): asserts obj is
    { [K in keyof T]: Exclude<T[K], null | undefined> } {
    Object.entries(obj).forEach(([k, v]) => {
        if (v === null || v === undefined)
            throw new Error(`OH NOEZ, PROP ${k} IS ${v}`);
    });
}

export function* range(start: number, stop?: number, step?: number) {
    if (stop === undefined) {
        stop = start
        start = 0
    }
    if (step === undefined)
        step = 1
    if (step <= 0)
        throw new Error("Not implemented")
    for (let i = start; i < stop; i += step)
        yield i
}

// https://stackoverflow.com/a/38863774
export function partition<T, K>(f: (arg0: T) => K, xs: T[]) {
    const append = function (ys: T[] = [], y: T) {
        ys.push(y)
        return ys
    }
    return xs.reduce((m, x) => {
        let v = f(x)
        return m.set(v, append(m.get(v), x))
    }, new Map<K, T[]>())
}

export function sum(t: number, x: number) {
    return t + x
}

export function prod(t: number, x: number) {
    return t * x
}
