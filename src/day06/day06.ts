import { main } from "../main"
import { prod, zip } from "../util"

type Race = {
    time: number,
    distance: number
}

function solver(input: string[]) {
    const part1 = Array.from(
        zip(...input.map(parsePart1)),
        ([t, d]) => ({ time: t, distance: d })
    )
    const part2 = {
        time: parsePart2(input[0]),
        distance: parsePart2(input[1])
    }
    return [
        part1
            .map(r => solutions(roots(r)))
            .reduce(prod)
            .toString(),
        solutions(roots(part2)).toString()
    ]
}

function solutions([r1, r2]: [number, number]) {
    const start = Number.isInteger(r1) ? r1 + 1 : Math.ceil(r1)
    const end = Number.isInteger(r2) ? r2 - 1 : Math.floor(r2)
    return end - start + 1
}

function roots({ time: t, distance: d }: Race): [number, number] {
    const x = Math.sqrt(t * t - 4 * d)
    return [(t - x) / 2, (t + x) / 2]
}

function parsePart1(line: string) {
    return line.split(/\s+/).slice(1).map(x => parseInt(x))
}

function parsePart2(line: string) {
    return parseInt(line.split(/\s+/).slice(1).join(""))
}

main(solver)
