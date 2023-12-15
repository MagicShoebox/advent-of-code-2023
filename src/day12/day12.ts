import { main } from "../main"
import { sum } from "../util"

enum Spring {
    Operational = ".",
    Damaged = "#",
    Unknown = "?"
}

type Record = {
    springs: string,
    damaged: number[]
}

type Block = {
    offset: number,
    length: number
}

function solver(input: string[]) {
    let records = input.map(line => parseRecord(line))
    const part1 = records.map(r => arrangements(r)).reduce(sum)
    records = records.map(r => unfoldRecord(r))
    const part2 = records.map(r => arrangements(r)).reduce(sum)
    return [
        part1.toString(),
        part2.toString()
    ]
}

function arrangements({ springs, damaged }: Record) {
    const blocks = damaged.map(x => ({
        offset: 0,
        length: x
    }))
    const makeValid = validFactory({ springs, damaged }, blocks)
    makeValid(blocks.length, springs.length + 1)
    const startPositions = blocks.map(x => x.offset)
    const cache = Array.from(Array(blocks.length), _ => Array<number>(springs.length + 1).fill(0))
    for (let blockIdx = blocks.length - 1; blockIdx >= 0; blockIdx--) {
        for (let i = blockIdx; i >= 0; i--)
            blocks[i].offset = startPositions[i]
        let end
        if (blockIdx == blocks.length - 1)
            end = springs.length + 1
        else
            end = blocks[blockIdx + 1].offset
        let lastValid = blocks[blockIdx].offset
        while (makeValid(blockIdx + 1, end)) {
            lastValid = blocks[blockIdx].offset
            if (blockIdx == blocks.length - 1) {
                cache[blockIdx][blocks[blockIdx].offset] = 1
            } else {
                cache[blockIdx][blocks[blockIdx].offset] =
                    cache[blockIdx + 1][blocks[blockIdx].offset + blocks[blockIdx].length + 1]
                const dmgIdx = springs.indexOf(Spring.Damaged, blocks[blockIdx].offset + blocks[blockIdx].length + 1)
                if (dmgIdx >= 0 && dmgIdx < blocks[blockIdx + 1].offset - 1)
                    cache[blockIdx][blocks[blockIdx].offset] -= cache[blockIdx + 1][dmgIdx + 1]
            }
            // console.log(display(springs, blocks, blockIdx, `${cache[blockIdx][blocks[blockIdx].offset]}`))
            blocks[blockIdx].offset++
        }
        blocks[blockIdx].offset = lastValid
        for (let i = springs.length - 1; i >= 0; i--) {
            cache[blockIdx][i] += cache[blockIdx][i + 1]
        }
    }
    return cache[0][0]
}

function validFactory({ springs, damaged }: Record, blocks: Block[]) {
    const remainingSprings = Array<number>(springs.length + 1)
    remainingSprings[springs.length] = 0
    for (let i = springs.length - 1; i >= 0; i--) {
        if (springs[i] == Spring.Damaged)
            remainingSprings[i] = remainingSprings[i + 1] + 1
        else
            remainingSprings[i] = remainingSprings[i + 1]
    }
    const remainingDamaged = Array<number>(damaged.length + 1)
    remainingDamaged[damaged.length] = 0
    for (let i = damaged.length - 1; i >= 0; i--) {
        remainingDamaged[i] = remainingDamaged[i + 1] + damaged[i]
    }
    const isValid = (idx: number) => {
        const block = blocks[idx]
        const remaining =
            (remainingSprings[block.offset + block.length] ?? 0)
            - remainingDamaged[idx + 1]
        return remaining <= 0
            && !springs
                .substring(block.offset, block.offset + block.length)
                .includes(Spring.Operational)
            && (block.offset == 0
                || springs[block.offset - 1] != Spring.Damaged)
            && (block.offset + block.length == springs.length
                || springs[block.offset + block.length] != Spring.Damaged)
    }
    const makeValid = (endIdx: number, endPos: number) => {
        for (let i = 0; i < endIdx; i++) {
            if (i > 0)
                blocks[i].offset = Math.max(blocks[i].offset, blocks[i - 1].offset + blocks[i - 1].length + 1)
            while (!isValid(i))
                blocks[i].offset++
            if (blocks[i].offset + blocks[i].length >= endPos)
                return false
            if (i == 0 && springs.substring(0, blocks[i].offset).includes(Spring.Damaged))
                return false
            for (let j = i - 1; j >= 0; j--) {
                while (!isValid(j) || springs
                    .substring(blocks[j].offset + blocks[j].length + 1, blocks[j + 1].offset - 1)
                    .includes(Spring.Damaged)) {
                    blocks[j].offset++
                    if (blocks[j].offset + blocks[j].length == blocks[j + 1].offset) {
                        i = j
                        j = 0
                        break
                    }
                }
            }
        }
        return true
    }
    return makeValid
}

function display(springs: string, blocks: Block[], idx: number, extra: string) {
    let foo = ""
    for (let i = 0; i < blocks.length; i++) {
        foo += " ".repeat(Math.max(0, blocks[i].offset - (blocks[i - 1]?.offset ?? 0) - (blocks[i - 1]?.length ?? 0)))
        if (i == idx)
            foo += "\x1b[37m"
        for (let j = 0; j < blocks[i].length; j++) {
            foo += "#"
        }
        if (i == idx)
            foo += "\x1b[0m"
    }
    return `${springs}\n${foo} ${extra}`
}

function unfoldRecord(record: Record) {
    const damaged = []
    for (let i = 0; i < 5; i++)
        damaged.push(...record.damaged)
    return {
        springs: Array(5).fill(record.springs).join(Spring.Unknown),
        damaged
    }
}

function parseRecord(line: string): Record {
    const [springs, damaged] = line.split(" ")
    return {
        springs,
        damaged: damaged.split(",").map(x => parseInt(x))
    }
}

main(solver)
