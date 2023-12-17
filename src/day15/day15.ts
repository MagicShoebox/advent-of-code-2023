import { main } from "../main"
import { sum } from "../util"

type Lens = {
    label: string,
    focalLength: number
}

function solver(input: string[]) {
    const steps = input[0].split(",")
    const part1 = steps.map(hash).reduce(sum)
    const boxes: Lens[][] = Array.from(Array(256), _ => [])
    for (let step of steps.map(parseStep)) {
        const box = boxes[hash(step.label)]
        const idx = box.findIndex(({ label }) => label == step.label)
        if (idx == -1) {
            if (step.focalLength !== undefined)
                box.push(step)
            continue
        }
        box.splice(idx, 1, ...(step.focalLength !== undefined ? [step] : []))
    }
    const part2 = boxes
        .flatMap((box, i) =>
            box.map(({ focalLength }, j) =>
                (i + 1) * (j + 1) * focalLength))
        .reduce(sum)
    return [
        part1.toString(),
        part2.toString()
    ]
}

function hash(str: string) {
    return str.split("").reduce((t, x) => (t + x.charCodeAt(0)) * 17 % 256, 0)
}

function parseStep(step: string) {
    if (step.endsWith("-"))
        return { label: step.substring(0, step.length - 1), remove: true }
    const [label, focalLength] = step.split("=")
    return { label, focalLength: parseInt(focalLength) }
}

main(solver)
