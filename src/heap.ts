// Original JS implementation from my BitBurner save
// TS version and API inspired by
// https://github.com/ignlg/heap-js/blob/master/src/Heap.ts

export type Comparator<T> = (a: T, b: T) => number

export class Heap<T> implements Iterable<T> {
    arr: T[] = []

    constructor(public compareFn: Comparator<T> = Heap.minComparator) { }

    static heapify<T>(arr: T[], compareFn?: Comparator<T>): Heap<T> {
        const heap = new Heap(compareFn)
        heap.arr = arr
        for (let i = Math.floor(arr.length / 2); i >= 0; i--)
            heap.sift(i)
        return heap
    }

    static minComparator<T>(a: T, b: T): number {
        if (a < b)
            return -1
        if (b > a)
            return 1
        return 0
    }

    private static left(i: number) {
        return 2 * i + 1
    }

    private static right(i: number) {
        return 2 * i + 2
    }

    private static parent(i: number) {
        return Math.floor((i - 1) / 2)
    }

    *[Symbol.iterator](): Iterator<T> {
        while (this.size) {
            yield this.pop()!
        }
    }

    get size(): number {
        return this.arr.length
    }

    peek(): T | undefined {
        return this.arr[0]
    }

    push(item: T) {
        let i = this.arr.push(item) - 1
        let swap
        do {
            swap = false
            let parent = Heap.parent(i)
            if (parent >= 0
                && this.compareFn(item, this.arr[parent]) < 0) {
                [this.arr[i], this.arr[parent]] = [this.arr[parent], item]
                swap = true
                i = parent
            }
        } while (swap)
        return this
    }

    pop(): T | undefined {
        let item = this.arr[0]
        if (this.arr.length > 1) {
            this.arr[0] = this.arr.pop()!
            this.sift(0)
        }
        else {
            this.arr.pop()
        }
        return item
    }

    private sift(i: number) {
        let swap
        do {
            swap = false
            const left = Heap.left(i)
            const right = Heap.right(i)
            let min = i
            if (left < this.arr.length
                && this.compareFn(this.arr[left], this.arr[min]) < 0)
                min = left
            if (right < this.arr.length
                && this.compareFn(this.arr[right], this.arr[min]) < 0)
                min = right
            if (min != i) {
                [this.arr[i], this.arr[min]] = [this.arr[min], this.arr[i]]
                swap = true
                i = min
            }
        } while (swap)
    }
}
