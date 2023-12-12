import { main } from "../main"

type Point = {
    row: number,
    column: number
}

type Gaps = {
    rows: number[],
    columns: number[]
}

function solver(input: string[]) {
    const galaxies = findGalaxies(input)
    const gaps = findGaps(input)
    return [
        pairLengths(galaxies, gaps, 2).toString(),
        pairLengths(galaxies, gaps, 1e6).toString()
    ]
}

function pairLengths(galaxies: Point[], gaps: Gaps, mult: number) {
    let total = 0
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            let mn = Math.min(galaxies[i].row, galaxies[j].row)
            let mx = Math.max(galaxies[i].row, galaxies[j].row)
            const xd = mx - mn + (mult - 1) * gaps.rows.filter(r => r > mn && r < mx).length
            mn = Math.min(galaxies[i].column, galaxies[j].column)
            mx = Math.max(galaxies[i].column, galaxies[j].column)
            const yd = mx - mn + (mult - 1) * gaps.columns.filter(c => c > mn && c < mx).length
            total += xd + yd
        }
    }
    return total
}

function findGalaxies(grid: string[]) {
    const g: Point[] = []
    for (let r = 0; r < grid.length; r++)
        for (let c = 0; c < grid[r].length; c++)
            if (grid[r][c] == "#")
                g.push({ row: r, column: c })
    return g
}

function findGaps(grid: string[]) {
    const rows = []
    const columns = []
    for (let r = 0; r < grid.length; r++) {
        if (!grid[r].includes("#"))
            rows.push(r)
    }
    for (let c = 0; c < grid[0].length; c++) {
        if (!grid.map(r => r[c]).includes("#"))
            columns.push(c)
    }
    return { rows, columns }
}

main(solver)
