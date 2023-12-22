import { main } from "../main"

enum Axis {
    X = 0,
    Y = 1,
    Z = 2
}

type Point = number[]

type Block = {
    id: number,
    p0: Point,
    p1: Point
}

type Tower = Block[][]

function solver(input: string[]) {
    const tower: Tower = [[]] // Empty floor element simplifies indexing
    const blocks = input
        .map((line, i) => ({ id: i, ...parseBlock(line) }))
        .sort(({ p0: a }, { p0: b }) => a[Axis.Z] - b[Axis.Z])
    const supporters: number[][] = Array(blocks.length)
    for (let block of blocks) {
        drop(tower, block)
        supporters[block.id] =
            tower[block.p0[Axis.Z] - 1]
                .filter(q => overlaps(block, q))
                .map(q => q.id)
    }
    const supporting: number[][] = Array.from(Array(blocks.length), _ => [])
    for (let i = 0; i < supporters.length; i++) {
        for (let id of supporters[i])
            supporting[id].push(i)
    }
    return [
        part1(supporters, supporting).toString(),
        part2(supporters, supporting).toString(),
    ]
}

function part1(supporters: number[][], supporting: number[][]) {
    let count = 0
    for (let i = 0; i < supporters.length; i++)
        if (supporting[i].every(p => supporters[p].some(q => q != i)))
            count++
    return count
}

function part2(supporters: number[][], supporting: number[][]) {
    let count = 0
    for (let i = 0; i < supporters.length; i++) {
        const removed = new Set([i])
        let size = 0
        while (size != removed.size) {
            size = removed.size
            for (let r of removed)
                for (let s of supporting[r])
                    if (supporters[s].every(t => removed.has(t)))
                        removed.add(s)
        }
        count += size - 1
    }
    return count
}

function drop(tower: Tower, block: Block) {
    const { p0, p1 } = block
    let z = Math.min(tower.length, p0[Axis.Z])
    while (z > 1 && tower[z - 1].every(q => !overlaps(block, q)))
        z--
    const h = p1[Axis.Z] - p0[Axis.Z]
    p0[Axis.Z] = z
    p1[Axis.Z] = z + h
    for (let i = 0; i <= h; i++) {
        if (z + i >= tower.length)
            tower.push([])
        tower[z + i].push(block)
    }
}

function overlaps({ p0, p1 }: Block, { p0: q0, p1: q1 }: Block) {
    return [Axis.X, Axis.Y].every(axis =>
        p0[axis] < q0[axis] ? p1[axis] >= q0[axis] : q1[axis] >= p0[axis])
}

function parseBlock(line: string) {
    const [p0, p1] = line.split("~").map(p => p.split(",").map(c => parseInt(c)))
    return { p0, p1 }
}

main(solver)
