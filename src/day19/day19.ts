import { main } from "../main"
import { map, prod, sum, takewhile } from "../util"

type Category = "x" | "m" | "a" | "s"

type Rule = {
    category: Category,
    maximum?: number,
    minimum?: number,
    next: string
}

type Workflow = {
    name: string,
    rules: Rule[],
    fallback: string
}

type Part = {
    [k in Category]: number
}

function solver(input: string[]) {
    const { workflows, parts } = parseInput(input)
    const part1 = parts
        .filter(p => isAccepted(workflows, p))
        .map(({ x, m, a, s }) => x + m + a + s)
        .reduce(sum)
    const part2 = acceptable(workflows)
        .map(bs => bs.map(b => b.max - b.min - 1).reduce(prod))
        .reduce(sum)
    return [
        part1.toString(),
        part2.toString()
    ]
}

function acceptable(workflows: Map<string, Workflow>) {
    type Bound = {
        min: number,
        max: number
    }
    type Node = {
        bounds: Bound[],
        workflow: string
    }
    const catMap = { x: 0, m: 1, a: 2, s: 3 }
    const accepted = []
    const startBounds = Array.from(Array(4), _ => ({ min: 0, max: 4001 }))
    const start: Node = { bounds: startBounds, workflow: "in" }
    let stack = [start]
    while (stack.length > 0) {
        let { bounds, workflow } = stack.pop()!
        if (workflow == "R"
            || bounds.some(({ min, max }) => max != undefined && min != undefined && max <= min + 1))
            continue
        if (workflow == "A") {
            accepted.push(bounds)
            continue
        }
        const { rules, fallback } = workflows.get(workflow)!
        for (let { category, maximum, minimum, next } of rules) {
            const success = bounds.map(x => ({ ...x }))
            const successBound = success[catMap[category]]
            const failBound = bounds[catMap[category]]
            if (maximum != undefined) {
                if (maximum < successBound.max)
                    successBound.max = maximum
                if (maximum - 1 > failBound.min)
                    failBound.min = maximum - 1
            } else {
                if (minimum! > successBound.min)
                    successBound.min = minimum!
                if (minimum! + 1 < failBound.max)
                    failBound.max = minimum! + 1
            }
            stack.push({ bounds: success, workflow: next })
        }
        stack.push({ bounds, workflow: fallback })
    }
    return accepted
}

function isAccepted(workflows: Map<string, Workflow>, part: Part) {
    let workflow = "in"
    while (workflow != "A" && workflow != "R") {
        const { rules, fallback } = workflows.get(workflow)!
        const rule = rules.find(
            ({ category, maximum, minimum }) =>
                (maximum != undefined && part[category] < maximum)
                || (minimum != undefined && part[category] > minimum))
        if (rule == undefined)
            workflow = fallback
        else
            workflow = rule.next
    }
    return workflow == "A"
}

function parseInput(input: string[]) {
    const [workflows, parts] = [...map(input, (line, _, arr) => [line, ...takewhile(arr, Boolean)])]
    return {
        workflows: new Map(workflows.map(parseWorkflow).map(w => [w.name, w])),
        parts: parts.map(parsePart)
    }
}

function parseWorkflow(line: string): Workflow {
    const match = line.match(/(\w+)\{(.+),(\w+)\}/)
    if (match == null)
        throw Error(`Couldn't parse ${line}`)
    const name = match[1]
    const rules = match[2]
        .split(",")
        .map(r => r.match(/([xmas])([<>])(\d+):(\w+)/))
        .map(m => ({
            category: m![1] as Category,
            maximum: m![2] == "<" ? parseInt(m![3]) : undefined,
            minimum: m![2] == ">" ? parseInt(m![3]) : undefined,
            next: m![4]
        }))
    const fallback = match[3]
    return {
        name,
        rules,
        fallback
    }
}

function parsePart(line: string): Part {
    const match = line.match(/x=(\d+),m=(\d+),a=(\d+),s=(\d+)/)
    if (match == null)
        throw Error(`Couldn't parse ${line}`)
    return {
        x: parseInt(match[1]),
        m: parseInt(match[2]),
        a: parseInt(match[3]),
        s: parseInt(match[4])
    }
}

main(solver)
