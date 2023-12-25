import { main } from "../main"

type Graph = Map<string, string[]>

type Traffic = {
    src: string,
    dest: string,
    count: number
}

function solver(input: string[]) {
    const graph = buildGraph(input)
    const wires = Array
        .from(edgeTraffic(graph).values())
        .sort(({ count: a }, { count: b }) => b - a)
        .slice(0, 3)
    for (let { src, dest } of wires) {
        let edges = graph.get(src)!
        edges.splice(edges.indexOf(dest), 1)
        edges = graph.get(dest)!
        edges.splice(edges.indexOf(src), 1)
    }
    const part1 =
        component(graph, wires[0].src).size *
        component(graph, wires[0].dest).size
    return [
        part1.toString(),
    ]
}

function component(graph: Graph, start: string) {
    const component = new Set([start])
    const stack = [start]
    while (stack.length > 0) {
        const curr = stack.pop()!
        for (let node of graph.get(curr)!.filter(n => !component.has(n))) {
            component.add(node)
            stack.push(node)
        }
    }
    return component
}

function edgeTraffic(graph: Graph) {
    const traffic = new Map<string, Traffic>()
    for (let start of graph.keys()) {
        const visited = new Set()
        const queue = [[start]]
        while (queue.length > 0) {
            const trail = queue.shift()!
            const curr = trail[trail.length - 1]
            for (let node of graph.get(curr)!.filter(n => !visited.has(n))) {
                visited.add(node)
                const newTrail = [...trail, node]
                queue.push(newTrail)
                for (let i = 1; i < newTrail.length; i++) {
                    const [a, b] = [newTrail[i - 1], newTrail[i]].sort()
                    const k = `${a}/${b}`
                    if (!traffic.has(k))
                        traffic.set(k, { src: a, dest: b, count: 0 })
                    traffic.get(k)!.count++
                }
            }
        }
    }
    return traffic
}

function buildGraph(input: string[]) {
    const graph: Graph = new Map()
    for (let line of input) {
        const [node1, block] = line.split(": ")
        if (!graph.has(node1))
            graph.set(node1, [])
        for (let node2 of block.split(" ")) {
            if (!graph.has(node2))
                graph.set(node2, [])
            graph.get(node1)!.push(node2)
            graph.get(node2)!.push(node1)
        }
    }
    return graph
}

main(solver)
