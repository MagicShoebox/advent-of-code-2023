import { main } from "../main"
import { map } from "../util"

enum Tile {
    Empty = ".",
    Forward = "/",
    Backward = "\\",
    Vertical = "|",
    Horizontal = "-"
}

enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3
}

type Beam = {
    r: number,
    c: number,
    d: Direction
}

function solver(input: string[]) {
    const part1 = energized(input, { r: 0, c: 0, d: Direction.East })
    const part2 = Math.max(...map(edges(input), b => energized(input, b)))
    return [
        part1.toString(),
        part2.toString()
    ]
}

function* edges(grid: string[]) {
    for (let r = 0; r < grid.length; r++) {
        yield { r, c: 0, d: Direction.East }
        yield { r, c: grid[r].length - 1, d: Direction.West }
    }
    for (let c = 0; c < grid[0].length; c++) {
        yield { r: 0, c, d: Direction.South }
        yield { r: grid.length - 1, c, d: Direction.North }
    }
}

function energized(grid: string[], start: Beam) {
    const history = new Map()
    const beams: Beam[] = [start]
    while (beams.length > 0) {
        const current = beams.pop()!
        history.set(key(current), current)
        for (let beam of propagate(grid, current).filter(b => !history.has(key(b)))) {
            history.set(key(beam), beam)
            beams.push(beam)
        }
    }
    return new Set(map(history.values(), ({ r, c }) => `${r},${c}`)).size
}

function propagate(grid: string[], { r, c, d }: Beam) {
    const tileMap = {
        [Tile.Empty]: {
            [Direction.North]: [Direction.North],
            [Direction.East]: [Direction.East],
            [Direction.South]: [Direction.South],
            [Direction.West]: [Direction.West]
        },
        [Tile.Forward]: {
            [Direction.North]: [Direction.East],
            [Direction.East]: [Direction.North],
            [Direction.South]: [Direction.West],
            [Direction.West]: [Direction.South]
        },
        [Tile.Backward]: {
            [Direction.North]: [Direction.West],
            [Direction.East]: [Direction.South],
            [Direction.South]: [Direction.East],
            [Direction.West]: [Direction.North]
        },
        [Tile.Vertical]: {
            [Direction.North]: [Direction.North],
            [Direction.East]: [Direction.North, Direction.South],
            [Direction.South]: [Direction.South],
            [Direction.West]: [Direction.North, Direction.South]
        },
        [Tile.Horizontal]: {
            [Direction.North]: [Direction.East, Direction.West],
            [Direction.East]: [Direction.East],
            [Direction.South]: [Direction.East, Direction.West],
            [Direction.West]: [Direction.West]
        },
    }
    const dirMap: { [d in Direction]: Beam } = {
        [Direction.North]: { r: r - 1, c, d: Direction.North },
        [Direction.East]: { r, c: c + 1, d: Direction.East },
        [Direction.South]: { r: r + 1, c, d: Direction.South },
        [Direction.West]: { r, c: c - 1, d: Direction.West }
    }
    return tileMap[grid[r][c] as Tile][d]
        .map(x => dirMap[x])
        .filter(({ r, c }) =>
            r >= 0 && r < grid.length
            && c >= 0 && c < grid[r].length)
}

function key({ r, c, d }: Beam) {
    return `${r},${c},${d}`
}

main(solver)
