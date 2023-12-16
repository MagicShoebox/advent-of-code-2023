import { main } from "../main"
import { map, sum, takewhile, zip } from "../util"

function solver(input: string[]) {
    const grids = [...map(input, (line, _, arr) => [line, ...takewhile(arr, Boolean)])]
    let part1 = 0
    let part2 = 0
    for (let i = 0; i < grids.length; i++) {
        const horiz = [...findReflections(grids[i])]
        part1 += horiz.filter(({ dist }) => dist == 0).map(({ index }) => 100 * index).reduce(sum, 0)
        part2 += horiz.filter(({ dist }) => dist == 1).map(({ index }) => 100 * index).reduce(sum, 0)
        const vert = [...findReflections(transpose(grids[i]))]
        part1 += vert.filter(({ dist }) => dist == 0).map(({ index }) => index).reduce(sum, 0)
        part2 += vert.filter(({ dist }) => dist == 1).map(({ index }) => index).reduce(sum, 0)
    }
    return [
        part1.toString(),
        part2.toString()
    ]
}

function* findReflections(grid: string[]) {
    for (let i = 1; i < grid.length; i++) {
        const bottom = grid.slice(i, 2 * i).reverse()
        const top = grid.slice(Math.max(0, i - bottom.length), i)
        const dist = Array.from(zip(top, bottom), ([t, b]) => hamming(t, b)).reduce(sum)
        if (dist < 2)
            yield { index: i, dist }
    }
}

function hamming(str1: string, str2: string) {
    let dist = 0
    for (let i = 0; i < str1.length; i++)
        if (str1[i] != str2[i])
            dist++
    return dist
}

function transpose(grid: string[]) {
    const width = grid[0].length
    return Array.from(Array(width), (_, i) => grid.map(r => r[i]).join(""))
}

main(solver)
