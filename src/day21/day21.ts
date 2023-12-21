import { main } from "../main"

type Point = {
    x: number,
    y: number,
    r: number,
    c: number
}

function solver(input: string[]) {
    const part1 = countPossibleLocations(input, 64)
    const part2 = countPossibleLocations(input, 26501365)
    return [
        part1.toString(),
        part2.toString()
    ]
}

function countPossibleLocations(grid: string[], steps: number) {
    const start = findStart(grid)
    const side = grid.length
    const threshold = 3 * side - start.r - 1
    if (steps < threshold)
        return possibleLocations(grid, steps).size
    const counts = Array.from(Array(5), _ => Array(5).fill(0))
    for (let { x, y } of possibleLocations(grid, threshold).values())
        counts[x + 2][y + 2]++
    const radius = (start.r + 1 + steps) / side - 1
    const points = counts[0][2] + counts[2][0] + counts[4][2] + counts[2][4]
    const outer = radius * (counts[1][0] + counts[3][0] + counts[1][4] + counts[3][4])
    const middle = (radius - 1) * (counts[1][1] + counts[3][1] + counts[1][3] + counts[3][3])
    let inner = counts[2][2]
    for (let i = 1; i < radius; i++)
        inner += 4 * i * (i % 2 == 0 ? counts[2][2] : counts[1][2])
    return points + inner + middle + outer
}

function possibleLocations(grid: string[], steps: number) {
    const start = findStart(grid)
    let locations = new Map([[key(start), start]])
    for (let i = 0; i < steps; i++) {
        locations = takeStep(grid, locations)
    }
    return locations
}

function takeStep(grid: string[], locations: Map<string, Point>) {
    const newLocs = new Map()
    for (let p of locations.values())
        for (let n of neighbors(grid, p))
            newLocs.set(key(n), n)
    return newLocs
}

function* neighbors(grid: string[], { x, y, r, c }: Point) {
    const h = grid.length
    const w = grid[r].length
    if (grid[(h + r - 1) % h][c] != "#")
        yield { x, y: r > 0 ? y : y - 1, r: (h + r - 1) % h, c }
    if (grid[r][(w + c - 1) % w] != "#")
        yield { x: c > 0 ? x : x - 1, y, r, c: (w + c - 1) % w }
    if (grid[(h + r + 1) % h][c] != "#")
        yield { x, y: r < h - 1 ? y : y + 1, r: (h + r + 1) % h, c }
    if (grid[r][(w + c + 1) % w] != "#")
        yield { x: c < w - 1 ? x : x + 1, y, r, c: (w + c + 1) % w }
}

function key({ x, y, r, c }: Point) {
    return `${x},${y},${r},${c}`
}

function findStart(grid: string[]) {
    for (let r = 0; r < grid.length; r++)
        for (let c = 0; c < grid[r].length; c++)
            if (grid[r][c] == "S")
                return { x: 0, y: 0, r, c }
    throw new Error("Couldn't find start")
}

main(solver)
