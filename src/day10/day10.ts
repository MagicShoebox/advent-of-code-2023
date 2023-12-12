import { main } from "../main"
import { filter } from "../util"

type Point = {
    row: number,
    column: number
}

function solver(input: string[]) {
    const start = findStart(input)
    const loop = findLoop(input, start)
    const part1 = loop.size / 2
    const part2 = findArea(input, loop)
    return [
        part1.toString(),
        part2.toString()
    ]
}

function key(p: Point) {
    return `${p.row},${p.column}`
}

function findArea(grid: string[], loop: Set<string>) {
    let area = 0
    for (let r = 0; r < grid.length; r++) {
        let outside = true
        for (let c = 0; c < grid[r].length; c++) {
            if (loop.has(key({ row: r, column: c }))) {
                if (pipes(grid[r][c]).north && pipes(grid[r - 1][c]).south)
                    outside = !outside
                continue
            }
            if (!outside)
                area++
        }
    }
    return area
}

function findLoop(grid: string[], start: Point) {
    const loop = new Set([key(start)])
    let prev = start
    let curr = neighbors(grid, start).next().value!
    while (curr.row != start.row || curr.column != start.column) {
        loop.add(key(curr));
        [prev, curr] = [curr, next(grid, prev, curr)]
    }
    return loop
}

function next(grid: string[], prev: Point, curr: Point) {
    return filter(
        neighbors(grid, curr),
        n => n.row != prev.row || n.column != prev.column)
        .next()
        .value!
}

function* neighbors(grid: string[], { row: r, column: c }: Point) {
    const { north, east, south, west } = pipes(grid[r][c])
    if (r > 0 && north && pipes(grid[r - 1][c]).south)
        yield { row: r - 1, column: c }
    if (r < grid.length - 1 && south && pipes(grid[r + 1][c]).north)
        yield { row: r + 1, column: c }
    if (c > 0 && west && pipes(grid[r][c - 1]).east)
        yield { row: r, column: c - 1 }
    if (c < grid[0].length - 1 && east && pipes(grid[r][c + 1]).west)
        yield { row: r, column: c + 1 }
}

function pipes(p: string) {
    switch (p) {
        case "|":
            return { north: true, south: true }
        case "-":
            return { east: true, west: true }
        case "L":
            return { north: true, east: true }
        case "J":
            return { north: true, west: true }
        case "7":
            return { south: true, west: true }
        case "F":
            return { east: true, south: true }
        case "S":
            return { north: true, east: true, south: true, west: true }
        default:
            return {}
    }
}

function findStart(grid: string[]) {
    for (let r = 0; r < grid.length; r++)
        for (let c = 0; c < grid[r].length; c++)
            if (grid[r][c] == "S")
                return { row: r, column: c }
    throw Error("Can't find start")
}

main(solver)
