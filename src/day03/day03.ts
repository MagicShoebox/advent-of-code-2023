import { main } from "../main"
import { partition, range, sum, prod } from "../util"

type Part = {
    y: number,
    x: number,
    length: number
}

function solver(input: string[]) {
    const numbers = []
    const symbols = new Set()
    for (let y = 0; y < input.length; y++) {
        let start = null
        for (let x = 0; x < input[y].length; x++) {
            if (/[0-9]/.test(input[y][x])) {
                if (start != null)
                    continue
                start = x
            } else {
                if (input[y][x] != ".")
                    symbols.add(JSON.stringify([y, x]))
                if (start == null)
                    continue
                numbers.push({ y, x: start, length: x - start })
                start = null
            }
        }
        if (start != null)
            numbers.push({ y, x: start, length: input[y].length - start })
    }

    const neighborFn = neighbors(input.length, input[0].length)
    const hasSymbolNeighbor = (n: Part) =>
        [...neighborFn(n)].some(({ y, x }) =>
            symbols.has(JSON.stringify([y, x])))
    const partNo = ({ y, x, length }: Part) => parseInt(input[y].substring(x, x + length))
    const part1 = numbers
        .filter(hasSymbolNeighbor)
        .map(partNo)
        .reduce(sum)
        .toString()

    const gearParts = partition(
        ({ key }) => key,
        numbers.flatMap(number =>
            [...neighborFn(number)]
                .filter(({ y, x }) => symbols.has(JSON.stringify([y, x])) && input[y][x] == "*")
                .map(({ y, x }) => ({ key: JSON.stringify([y, x]), part: partNo(number) }))))
    const part2 =
        [...gearParts.values()]
            .filter(ns => ns.length == 2)
            .map(ns => ns.map(n => n.part).reduce(prod))
            .reduce(sum)
            .toString()

    return [
        part1,
        part2
    ]
}

function neighbors(height: number, width: number) {
    return function* ({ y, x, length }: Part) {
        if (x > 0) {
            if (y > 0)
                yield { y: y - 1, x: x - 1 }
            yield { y, x: x - 1 }
            if (y + 1 < height)
                yield { y: y + 1, x: x - 1 }
        }
        if (x + length < width) {
            if (y > 0)
                yield { y: y - 1, x: x + length }
            yield { y, x: x + length }
            if (y + 1 < height)
                yield { y: y + 1, x: x + length }
        }
        if (y > 0)
            yield* [...range(x, x + length)].map(x => ({ y: y - 1, x }))
        if (y + 1 < height)
            yield* [...range(x, x + length)].map(x => ({ y: y + 1, x }))
    }
}

main(solver)
