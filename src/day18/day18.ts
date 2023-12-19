import { main } from "../main"

type Point = {
    r: number,
    c: number
}

enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R"
}

type Step = {
    direction: Direction,
    distance: number,
}

function solver(input: string[]) {
    return [
        area(trace(input.map(part1))).toString(),
        area(trace(input.map(part2))).toString()
    ]
}

function area(vertices: Point[]) {
    let total = 0
    for (let i = 0; i < vertices.length; i++) {
        const { r, c } = vertices[i]
        const { r: nr, c: nc } = vertices[i + 1] ?? vertices[0]
        total += (c + nc) * (r - nr)
    }
    return Math.abs(total / 2)
}

function trace(steps: Step[]): Point[] {
    const vertices = []
    let minR = 0
    let minC = 0
    let loc = { r: 0, c: 0 }
    for (let i = 0; i < steps.length; i++) {
        const { direction: d1 } = steps[i]
        const { direction: d2 } = steps[i + 1] ?? steps[0]
        loc = applyStep(loc, steps[i])
        let { r, c } = loc
        if (d1 == Direction.Left || d2 == Direction.Left)
            r++
        if (d1 == Direction.Down || d2 == Direction.Down)
            c++
        minR = Math.min(minR, r)
        minC = Math.min(minC, c)
        vertices.push({ r, c })
    }
    return vertices.map(({ r, c }) => ({
        r: r - minR,
        c: c - minC,
    }))
}

function applyStep({ r, c }: Point, { direction, distance }: Step) {
    switch (direction) {
        case Direction.Up:
            return { r: r - distance, c }
        case Direction.Down:
            return { r: r + distance, c }
        case Direction.Left:
            return { r, c: c - distance }
        case Direction.Right:
            return { r, c: c + distance }
    }
}

function part1(line: string): Step {
    const match = line.match(/([UDLR]) (\d+)/)
    if (match == null)
        throw new Error(`Couldn't parse line: ${line}`)
    return {
        direction: match[1] as Direction,
        distance: parseInt(match[2]),
    }
}

function part2(line: string): Step {
    const match = line.match(/\(#([0-9a-f]{5})([0-3])\)/)
    if (match == null)
        throw new Error(`Couldn't parse line: ${line}`)
    return {
        distance: parseInt(match[1], 16),
        direction: "RDLU"[parseInt(match[2])] as Direction,
    }
}

main(solver)
