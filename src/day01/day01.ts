import { main } from "../main"
import { assertRequired, sum } from "../util"

type Instruction = { first: string, last: string }

function solver(input: string[]) {
    const answer = (ds: Instruction[]) => ds
        .map(({ first, last }) => 10 * parseInt(first) + parseInt(last))
        .reduce(sum)
        .toString()

    return [
        answer(input.map(part1)),
        answer(input.map(part2))
    ]
}

function part1(line: string) {
    const digits = {
        first: line.match(/^.*?(\d)/)?.[1],
        last: line.match(/.*(\d).*?$/)?.[1]
    }
    assertRequired(digits)
    return digits
}

function part2(line: string) {
    const lexical = new Map([
        ["one", "1"],
        ["two", "2"],
        ["three", "3"],
        ["four", "4"],
        ["five", "5"],
        ["six", "6"],
        ["seven", "7"],
        ["eight", "8"],
        ["nine", "9"]
    ])
    const letters = [...lexical.keys()].join("|")
    const digits = {
        first: line.match(`^.*?(\\d|${letters})`)?.[1],
        last: line.match(`.*(\\d|${letters}).*?$`)?.[1]
    }
    assertRequired(digits)
    digits.first = lexical.get(digits.first) ?? digits.first
    digits.last = lexical.get(digits.last) ?? digits.last
    return digits
}

main(solver)
