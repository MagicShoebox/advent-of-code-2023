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
export function partition<T, K>(f: (value: T, index: number) => K, xs: T[]) {
    const append = function (ys: T[] = [], y: T) {
        ys.push(y)
        return ys
    }
    return xs.reduce((m, x, i) => {
        let v = f(x, i)
        return m.set(v, append(m.get(v), x))
    }, new Map<K, T[]>())
}

export function* takewhile<T>(
    itr: Iterable<T> | Iterator<T>,
    predicate: (value: T, index: number, iterable: Iterator<T>) => boolean) {
    if (Symbol.iterator in itr)
        itr = itr[Symbol.iterator]()
    let index = 0
    let next = itr.next()
    while (!next.done && predicate(next.value, index, itr)) {
        yield next.value
        index++
        next = itr.next()
    }
}

export function* map<T, U>(
    itr: Iterable<T> | Iterator<T>,
    callback: (value: T, index: number, iterable: Iterator<T>) => U) {
    if (Symbol.iterator in itr)
        itr = itr[Symbol.iterator]()
    let index = 0
    let next = itr.next()
    while (!next.done) {
        yield callback(next.value, index, itr)
        index++
        next = itr.next()
    }
}

// https://stackoverflow.com/a/48293566/3491874
export function* zip<T>(...arr: Array<Iterable<T>>) {
    const itrs = arr.map(itr => itr[Symbol.iterator]())
    let next = itrs.map(itr => itr.next())
    while (next.every(n => !n.done)) {
        yield next.map(n => n.value)
        next = itrs.map(itr => itr.next())
    }
}

export function sum(t: number, x: number) {
    return t + x
}

export function prod(t: number, x: number) {
    return t * x
}
