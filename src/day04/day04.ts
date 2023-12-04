import { main } from "../main"
import { sum } from "../util"

function solver(input: string[]) {
    const scores = input.map(parseCard)
        .map(({ winning, ours }) => ours.filter(x => winning.has(x)).length)
    const part1 = scores.map(score => Math.trunc(2 ** (score - 1)))
        .reduce(sum)
        .toString()

    const counts = new Array(scores.length).fill(1)
    for (let i = 0; i < counts.length; i++) {
        for (let j = 0; j < scores[i]; j++) {
            counts[i + j + 1] += counts[i]
        }
    }
    const part2 = counts
        .reduce(sum)
        .toString()

    return [
        part1,
        part2
    ]
}

function parseCard(line: string) {
    const [winning, ours] = line.split(/:|\|/).slice(1)
    return {
        winning: new Set(winning.split(" ").filter(x => x.length > 0).map(x => parseInt(x))),
        ours: ours.split(" ").filter(x => x.length > 0).map(x => parseInt(x))
    }
}

main(solver)
