import { main } from "../main"
import { filter } from "../util"

interface Point {
    r: number,
    c: number
}

type Graph = Map<string, { dest: string, dist: number }[]>

function solver(input: string[]) {
    const { start, goal } = findStartAndGoal(input)
    const graph = gridToGraph(input, start, goal)
    const part1 = longestPath(graph, key(start), key(goal))
    const part2 = longestPath(undirected(graph), key(start), key(goal))
    return [
        part1.toString(),
        part2.toString()
    ]
}

function longestPath(graph: Graph, start: string, goal: string) {
    let maxDist = 0
    const queue = [{ dist: 0, trail: [start] }]
    while (queue.length > 0) {
        const { dist, trail } = queue.pop()!
        let curr = trail[trail.length - 1]
        if (curr == goal) {
            maxDist = Math.max(maxDist, dist)
            continue
        }
        for (let { dest, dist: nd } of graph.get(curr)!) {
            if (trail.includes(dest))
                continue
            queue.push({ dist: dist + nd, trail: [...trail, dest] })
        }
    }
    return maxDist
}

function key({ r, c }: Point) {
    return `${r},${c}`
}

function findStartAndGoal(grid: string[]) {
    return {
        start: {
            r: 0,
            c: grid[0].indexOf(".")
        },
        goal: {
            r: grid.length - 1,
            c: grid[grid.length - 1].indexOf(".")
        }
    }
}

function gridToGraph(grid: string[], start: Point, goal: Point) {
    const nodes: Graph = new Map([[key(start), []], [key(goal), []]])
    const queue = [{ origin: start, curr: start, dist: 0 }]
    const visited = new Set([key(start), key(goal)])
    while (queue.length > 0) {
        let { origin, curr, dist } = queue.shift()!
        let nhbrs = Array.from(filter(gridNeighbors(grid, curr),
            nhbr => !visited.has(key(nhbr))))
        while (nhbrs.length == 1) {
            visited.add(key(nhbrs[0]))
            curr = nhbrs[0]
            dist++
            nhbrs = Array.from(filter(gridNeighbors(grid, curr),
                nhbr => !visited.has(key(nhbr))))
        }
        if (nhbrs.length > 0) {
            nodes.set(key(curr), [])
            nodes.get(key(origin))!.push({ dest: key(curr), dist })
            for (let nhbr of nhbrs) {
                if (nhbr.r < curr.r || nhbr.c < curr.c)
                    continue
                visited.add(key(nhbr))
                queue.push({ origin: curr, curr: nhbr, dist: 1 })
            }
            continue
        }
        dist++
        nhbrs = Array.from(filter(gridNeighbors(grid, curr),
            nhbr => nodes.has(key(nhbr))))
        for (let nhbr of nhbrs) {
            nodes.get(key(origin))!.push({ dest: key(nhbr), dist })
        }
    }
    return nodes
}

function* gridNeighbors(grid: string[], { r, c }: Point) {
    if (grid[r][c] == "v") {
        yield { r: r + 1, c }
        return
    }
    if (grid[r][c] == ">") {
        yield { r, c: c + 1 }
        return
    }
    if (r > 0 && grid[r - 1][c] != "#")
        yield { r: r - 1, c }
    if (c > 0 && grid[r][c - 1] != "#")
        yield { r, c: c - 1 }
    if (r < grid.length - 1 && grid[r + 1][c] != "#")
        yield { r: r + 1, c }
    if (c < grid[r].length - 1 && grid[r][c + 1] != "#")
        yield { r, c: c + 1 }
}

function undirected(graph: Graph) {
    const undir: Graph = new Map()
    for (let [origin, edges] of graph) {
        if (!undir.has(origin))
            undir.set(origin, [])
        for (let { dest, dist } of edges) {
            if (!undir.has(dest))
                undir.set(dest, [])
            undir.get(origin)!.push({ dest, dist })
            undir.get(dest)!.push({ dest: origin, dist })
        }
    }
    return undir
}

main(solver)
