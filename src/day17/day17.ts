import { main } from "../main"
import { Heap, sum } from "../util"

enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3
}

type Node = {
    row: number,
    column: number,
    loss: number,
    direction: Direction,
    blocks: number,
}

type Neighbors = (grid: number[][],
    { row, column, loss, blocks, direction }: Node) => Generator<Node>

function solver(input: string[]) {
    const grid = input.map(line => line.split("").map(x => parseInt(x)))
    return [
        shortestPath(grid, part1).toString(),
        shortestPath(grid, part2).toString()
    ]
}

function shortestPath(grid: number[][], neighbors: Neighbors) {
    const heap = Heap<{ score: number, node: Node }>(({ score }) => score)
    const visited = new Map<string, { loss: number, prev: Node }>()
    const start = { row: 0, column: 0, loss: 0, blocks: 0, direction: Direction.North }
    const queue = [{ score: 0, node: start }]
    while (queue.length > 0) {
        const { node } = heap.pop(queue)
        if (node.row == grid.length - 1 && node.column == grid[0].length - 1)
            return node.loss
        for (let nghbr of neighbors(grid, node)) {
            if (visited.get(key(nghbr))?.loss! <= nghbr.loss) {
                continue
            }
            visited.set(key(nghbr), { loss: nghbr.loss, prev: node })
            const score = nghbr.loss + grid.length - 1 - nghbr.row + grid[0].length - 1 - nghbr.column
            heap.push(queue, { score, node: nghbr })
        }
        // queue.sort(({ score: a }, { score: b }) => b - a)
    }
    throw new Error("No path")
}

function* part1(grid: number[][], { row, column, loss, blocks, direction }: Node) {
    if (direction != Direction.South
        && row > 0
        && (blocks < 3 || direction != Direction.North))
        yield {
            row: row - 1,
            column,
            loss: loss + grid[row - 1][column],
            blocks: direction == Direction.North ? blocks + 1 : 1,
            direction: Direction.North
        }
    if (direction != Direction.West
        && column < grid[0].length - 1
        && (blocks < 3 || direction != Direction.East))
        yield {
            row,
            column: column + 1,
            loss: loss + grid[row][column + 1],
            blocks: direction == Direction.East ? blocks + 1 : 1,
            direction: Direction.East
        }
    if (direction != Direction.North
        && row < grid.length - 1
        && (blocks < 3 || direction != Direction.South))
        yield {
            row: row + 1,
            column,
            loss: loss + grid[row + 1][column],
            blocks: direction == Direction.South ? blocks + 1 : 1,
            direction: Direction.South
        }
    if (direction != Direction.East
        && column > 0
        && (blocks < 3 || direction != Direction.West))
        yield {
            row,
            column: column - 1,
            loss: loss + grid[row][column - 1],
            blocks: direction == Direction.West ? blocks + 1 : 1,
            direction: Direction.West
        }
}

function* part2(grid: number[][], { row, column, loss, blocks, direction }: Node) {
    if (direction != Direction.South && direction != Direction.North && row > 3) {
        yield {
            row: row - 4,
            column,
            loss: loss + grid.slice(row - 4, row).map(r => r[column]).reduce(sum),
            blocks: 4,
            direction: Direction.North
        }
    }
    if (direction == Direction.North && row > 0 && blocks < 10)
        yield {
            row: row - 1,
            column,
            loss: loss + grid[row - 1][column],
            blocks: blocks + 1,
            direction: Direction.North
        }
    if (direction != Direction.West && direction != Direction.East && column < grid[0].length - 4) {
        yield {
            row,
            column: column + 4,
            loss: loss + grid[row].slice(column + 1, column + 5).reduce(sum),
            blocks: 4,
            direction: Direction.East
        }
    }
    if (direction == Direction.East && column < grid[0].length - 1 && blocks < 10)
        yield {
            row,
            column: column + 1,
            loss: loss + grid[row][column + 1],
            blocks: blocks + 1,
            direction: Direction.East
        }
    if (direction != Direction.North && direction != Direction.South && row < grid.length - 4) {
        yield {
            row: row + 4,
            column,
            loss: loss + grid.slice(row + 1, row + 5).map(r => r[column]).reduce(sum),
            blocks: 4,
            direction: Direction.South
        }
    }
    if (direction == Direction.South && row < grid.length - 1 && blocks < 10)
        yield {
            row: row + 1,
            column,
            loss: loss + grid[row + 1][column],
            blocks: blocks + 1,
            direction: Direction.South
        }
    if (direction != Direction.East && direction != Direction.West && column > 3) {
        yield {
            row,
            column: column - 4,
            loss: loss + grid[row].slice(column - 4, column).reduce(sum),
            blocks: 4,
            direction: Direction.West
        }
    }
    if (direction == Direction.West && column > 0 && blocks < 10)
        yield {
            row,
            column: column - 1,
            loss: loss + grid[row][column - 1],
            blocks: blocks + 1,
            direction: Direction.West
        }
}

function key({ row, column, direction, blocks }: Node) {
    return `${row},${column},${direction},${blocks}`
}

main(solver)
