import { main } from "../main"

function solver(input: string[]) {
    const histories = input.map(line =>
        line.split(" ").map(x => parseInt(x)))

    let part1 = 0
    let part2 = 0
    for (let history of histories) {
        const layers = [history]
        while (last(layers).some(x => x != 0))
            layers.push(changes(last(layers)))
        for (let i = layers.length - 1; i > 0; i--) {
            layers[i - 1].push(last(layers[i - 1]) + last(layers[i]))
            layers[i - 1].unshift(layers[i - 1][0] - layers[i][0])
        }
        part1 += last(layers[0])
        part2 += layers[0][0]
    }
    return [
        part1.toString(),
        part2.toString()
    ]
}

function last<T>(arr: Array<T>) {
    return arr[arr.length - 1]
}

function changes(history: number[]) {
    return history.slice(1).map((x, i) => x - history[i])
}

main(solver)
