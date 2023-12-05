import { main } from "../main"
import { map, partition, takewhile } from "../util"

type SeedRange = {
    start: number,
    length: number
}

type MapRange = {
    src: number,
    dest: number,
    length: number
}

function solver(input: string[]) {
    const blocks = [...map(input, (line, _, arr) => [line, ...takewhile(arr, Boolean)])]
    let seeds1 = parseSeeds1(blocks[0])
    let seeds2 = parseSeeds2(blocks[0])
    const maps = new Map(blocks.slice(1).map(parseMap).map(m => [m.from, m]))
    let stage = "seed"
    while (stage != "location") {
        const stageMap = maps.get(stage)
        if (!stageMap)
            throw new Error(`No map for stage ${stage}`)
        seeds1 = applyRanges(stageMap.ranges, seeds1)
        seeds2 = applyRanges(stageMap.ranges, seeds2)
        stage = stageMap.to
    }
    return [
        Math.min(...seeds1.map(x => x.start)).toString(),
        Math.min(...seeds2.map(x => x.start)).toString()
    ]
}

function applyRanges(maps: MapRange[], seeds: SeedRange[]) {
    const mapped = []
    let sIdx = 0
    let mIdx = 0
    while (sIdx < seeds.length && mIdx < maps.length) {
        const { start: ss, length: sl } = seeds[sIdx]
        const { src: ms, dest: md, length: ml } = maps[mIdx]
        if (sl == 0) {
            sIdx++
            continue
        }
        if (ss < ms) {
            // sssmmm
            if (ss + sl <= ms) {
                mapped.push(seeds[sIdx])
                sIdx++
                continue
            }
            // ssmmss
            // ssmsmm
            mapped.push({ start: ss, length: ms - ss })
            seeds[sIdx].length -= ms - ss
            seeds[sIdx].start = ms
            continue
        }
        // mmmsss
        if (ms + ml <= ss) {
            mIdx++
            continue
        }
        // mmssmm
        // mmsmss
        const end = Math.min(ss + sl, ms + ml)
        mapped.push({ start: ss - ms + md, length: end - ss })
        seeds[sIdx].length -= end - ss
        seeds[sIdx].start = end
        continue
    }
    while (sIdx < seeds.length)
        mapped.push(seeds[sIdx++])
    return mapped.sort(({ start: a }, { start: b }) => a - b)
}

function parseSeeds1(block: string[]) {
    return block[0]
        .split(":")[1]
        .split(" ")
        .filter(x => x)
        .map(x => ({ start: parseInt(x), length: 1 }))
        .sort(({ start: a }, { start: b }) => a - b)
}

function parseSeeds2(block: string[]) {
    return [...partition((_, i) => Math.floor(i / 2), block[0]
        .split(":")[1]
        .split(" ")
        .filter(x => x)
        .map(x => parseInt(x)))
        .values()]
        .map(([start, length]) => ({ start, length }))
        .sort(({ start: a }, { start: b }) => a - b)
}

function parseMap(block: string[]) {
    const [from, _, to] = block[0].split(" ", 2)[0].split("-")
    const ranges = block.slice(1).map(parseRange).sort(({ src: a }, { src: b }) => a - b)
    return {
        from,
        to,
        ranges
    }
}

function parseRange(line: string) {
    const [dest, src, length] = line.split(" ").map(x => parseInt(x))
    return {
        src,
        dest,
        length
    }
}

main(solver)
