import { main } from "../main"
import { gcd } from "../util"

type Node = {
    key: string,
    left: string,
    right: string
}

function solver(input: string[]) {
    const instructions = input[0]
    const graph = new Map(input
        .slice(2)
        .map(parseNode)
        .map(x => [x.key, x]))

    const part1 = pathLength(instructions, graph, "AAA")
    const part2 = [...graph.keys()]
        .filter(n => n.endsWith("A"))
        .map(n => pathLength(instructions, graph, n))
        .reduce((t, x) => t * x / gcd(t, x))

    return [
        part1.toString(),
        part2.toString()
    ]
}

function pathLength(
    instructions: string,
    graph: Map<string, Node>,
    start: string) {
    let i = 0
    let n = start
    while (!n.endsWith("Z")) {
        const node = graph.get(n)!
        if (instructions[i % instructions.length] == "L")
            n = node.left
        else
            n = node.right
        i++
    }
    return i
}

function parseNode(line: string): Node {
    const match = line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/)!
    const [_, key, left, right] = match
    return { key, left, right }
}

main(solver)
