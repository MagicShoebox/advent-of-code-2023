import { main } from "../main"
import { sum } from "../util"

type Point = {
    r: number,
    c: number
}

function solver(input: string[]) {
    return [
        part1(input).toString(),
        part2(input).toString()
    ]
}

function part1(input: string[]) {
    let { rollers, cubes } = parseGrid(input)
    rollers = tiltNorth(rollers, cubes)
    return calcLoad(rollers, input.length)
}

function part2(input: string[]) {
    const cache = new Map()
    const height = input.length
    const width = input[0].length
    let { rollers, cubes } = parseGrid(input)
    for (let cycle = 0; cycle < 1e9; cycle++) {
        const load = calcLoad(rollers, height)
        if (cache.has(load)) {
            const length = cycle - cache.get(load)
            if (length < 1e9 - cycle) {
                cycle += length * Math.floor((1e9 - 1 - cycle) / length)
                cache.clear()
            }
        }
        cache.set(load, cycle)
        for (let i = 0; i < 4; i++) {
            rollers = tiltNorth(rollers, cubes)
            const rotated = rotate(rollers, cubes, i % 2 == 0 ? height : width)
            rollers = rotated.rollers
            cubes = rotated.cubes
        }
    }
    return calcLoad(rollers, height)
}

function calcLoad(rollers: Point[], height: number) {
    return rollers.map(({ r }) => height - r).reduce(sum)
}

function rotate(rollers: Point[], cubes: Point[], height: number) {
    return {
        rollers: rollers.map(({ r, c }) => ({ r: c, c: height - 1 - r })),
        cubes: cubes.map(({ r, c }) => ({ r: c, c: height - 1 - r }))
    }
}

function tiltNorth(rollers: Point[], cubes: Point[]) {
    const newRollers = []
    const columns = new Map<number, number[]>()
    for (let { r, c } of cubes) {
        const arr = columns.get(c) ?? []
        arr.push(r)
        columns.set(c, arr)
    }
    columns.forEach(v => v.sort((a, b) => a - b))
    rollers.sort(({ r: a }, { r: b }) => a - b)
    for (let { r, c } of rollers) {
        if (!columns.has(c))
            columns.set(c, [])
        const column = columns.get(c) ?? []
        const i = column.findLastIndex(x => x < r)
        r = i == -1 ? 0 : column[i] + 1
        column.splice(i + 1, 0, r)
        newRollers.push({ r, c })
    }
    return newRollers
}

function display(rollers: Point[], cubes: Point[]) {
    const grid: string[][] = []
    for (let { r, c } of rollers) {
        for (let i = grid.length; i <= r; i++)
            grid.push([])
        for (let i = grid[r].length; i <= c; i++)
            grid[r].push(".")
        grid[r][c] = "O"
    }
    for (let { r, c } of cubes) {
        for (let i = grid.length; i <= r; i++)
            grid.push([])
        for (let i = grid[r].length; i <= c; i++)
            grid[r].push(".")
        grid[r][c] = "#"
    }
    return grid.map(x => x.join("")).join("\n")
}

function parseGrid(input: string[]) {
    const rollers = []
    const cubes = []
    for (let r = 0; r < input.length; r++) {
        for (let c = 0; c < input[r].length; c++) {
            if (input[r][c] == "O")
                rollers.push({ r, c })
            else if (input[r][c] == "#")
                cubes.push({ r, c })
        }
    }
    return { rollers, cubes }
}

main(solver)
