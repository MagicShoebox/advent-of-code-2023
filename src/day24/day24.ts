import { main } from "../main"
import { sum } from "../util"

type Hailstone = {
    p: number[],
    v: number[]
}

function solver(input: string[]) {
    const hailstones = input.map(parseHailstone)
    return [
        part1(hailstones).toString(),
        part2(hailstones).toString()
    ]
}

function part1(hailstones: Hailstone[]) {
    const area = [200000000000000, 400000000000000]
    let count = 0
    for (let i = 0; i < hailstones.length; i++) {
        for (let j = i + 1; j < hailstones.length; j++) {
            const q = intersection2d(hailstones[i], hailstones[j])
            if (q != null && q.every(x => x >= area[0] && x <= area[1]))
                count++
        }
    }
    return count
}

function part2(hailstones: Hailstone[]) {
    const [a, b, c] = hailstones.slice(0, 3)
    //      0   1   2   3   4   5   6   7   8
    // x = [x0, x1, x2, v0, v1, v2, t0, t1, t2]
    const F = (x: number[]) => [
        x[0] + x[6] * x[3] - a.p[0] - x[6] * a.v[0],
        x[1] + x[6] * x[4] - a.p[1] - x[6] * a.v[1],
        x[2] + x[6] * x[5] - a.p[2] - x[6] * a.v[2],
        x[0] + x[7] * x[3] - b.p[0] - x[7] * b.v[0],
        x[1] + x[7] * x[4] - b.p[1] - x[7] * b.v[1],
        x[2] + x[7] * x[5] - b.p[2] - x[7] * b.v[2],
        x[0] + x[8] * x[3] - c.p[0] - x[8] * c.v[0],
        x[1] + x[8] * x[4] - c.p[1] - x[8] * c.v[1],
        x[2] + x[8] * x[5] - c.p[2] - x[8] * c.v[2]
    ]
    const J = (x: number[]) => [
        [1, 0, 0, x[6], 0, 0, x[3] - a.v[0], 0, 0],
        [0, 1, 0, 0, x[6], 0, x[4] - a.v[1], 0, 0],
        [0, 0, 1, 0, 0, x[6], x[5] - a.v[2], 0, 0],
        [1, 0, 0, x[7], 0, 0, 0, x[3] - b.v[0], 0],
        [0, 1, 0, 0, x[7], 0, 0, x[4] - b.v[1], 0],
        [0, 0, 1, 0, 0, x[7], 0, x[5] - b.v[2], 0],
        [1, 0, 0, x[8], 0, 0, 0, 0, x[3] - c.v[0]],
        [0, 1, 0, 0, x[8], 0, 0, 0, x[4] - c.v[1]],
        [0, 0, 1, 0, 0, x[8], 0, 0, x[5] - c.v[2]]
    ]
    // https://en.wikipedia.org/wiki/Newton%27s_method#k_variables,_k_functions
    let guess = [0, 0, 0, 1, 1, 1, 1, 2, 3]
    let loopCount = 0
    while (loopCount < 100 &&
        F(guess.map(x => Math.round(x))).some(x => x != 0)) {
        loopCount++
        guess = solveLinear(J(guess), F(guess).map(x => -x))
            .map((x, i) => x + guess[i])
    }
    return guess.slice(0, 3).map(x => Math.round(x)).reduce(sum)
}

function solveLinear(A: number[][], B: number[]) {
    // https://en.wikipedia.org/wiki/Gaussian_elimination#Pseudocode
    const swap = (i: number, j: number) =>
        [A[i], A[j], B[i], B[j]] = [A[j], A[i], B[j], B[i]]
    let h = 0
    let k = 0
    while (h < A.length && k < A[h].length) {
        let maxIdx = h
        for (let i = h + 1; i < A.length; i++)
            if (Math.abs(A[i][k]) > Math.abs(A[maxIdx][h]))
                maxIdx = i
        if (A[maxIdx][k] == 0) {
            k++
            continue
        }
        swap(h, maxIdx)
        for (let i = h + 1; i < A.length; i++) {
            const f = A[i][k] / A[h][k]
            A[i][k] = 0
            for (let j = k + 1; j < A[h].length; j++)
                A[i][j] -= f * A[h][j]
            B[i] -= f * B[h]
        }
        h++
        k++
    }
    const X = Array<number>(A.length)
    for (let i = A.length - 1; i >= 0; i--) {
        for (let j = A[i].length - 1; j > i; j--)
            B[i] -= A[i][j] * X[j]
        X[i] = B[i] / A[i][i]
    }
    return X
}

function intersection2d({ p: p1, v: v1 }: Hailstone, { p: p2, v: v2 }: Hailstone) {
    const m1 = v1[1] / v1[0]
    const m2 = v2[1] / v2[0]
    const x = (m1 * p1[0] - p1[1] - m2 * p2[0] + p2[1]) / (m1 - m2)
    const y = m1 * (x - p1[0]) + p1[1]
    const q = [x, y]
    if (!isFinite(x) || !isFinite(y))
        return null
    for (let i = 0; i < 2; i++) {
        if (Math.sign(q[i] - p1[i]) != Math.sign(v1[i])
            || Math.sign(q[i] - p2[i]) != Math.sign(v2[i]))
            return null
    }
    return q
}

function parseHailstone(line: string) {
    const [p, v] = line.split("@").map(part => part.split(",").map(x => parseInt(x)))
    return { p, v }
}

main(solver)
