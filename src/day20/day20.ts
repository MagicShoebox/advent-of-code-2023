import { main } from "../main"
import { every, filter, prod, sum } from "../util"

enum ModuleType {
    FlipFlop = "%",
    Conjunction = "&",
}

type Module = {
    type: ModuleType,
    name: string,
    targets: string[]
}

type ModuleStates = {
    [ModuleType.FlipFlop]: boolean,
    [ModuleType.Conjunction]: Map<string, boolean>
}

type Network = Map<string, Module>

type NetworkState = {
    [T in ModuleType]: Map<string, ModuleStates[T]>
}

type ModuleHandlerArgs<T extends ModuleType> = {
    name: string,
    src: string,
    pulse: boolean,
    state: ModuleStates[T],
    targets: string[]
}

function solver(input: string[]) {
    const network = new Map(input
        .map(parseModule)
        .map(m => [m.name, m]))
    return [
        part1(network).toString(),
        part2(network).toString()
    ]
}

function part1(network: Network) {
    const state = initialState(network)
    let low = 0
    let high = 0
    for (let i = 0; i < 1000; i++) {
        const { low: l, high: h } = pushButton(network, state)
        low += l
        high += h
    }
    return low * high
}

function part2(network: Network) {
    const parents = (name: string) =>
        Array.from(filter(
            network.values(),
            m => m.targets.includes(name)),
            m => m.name)
    const gears = parents(parents("rx")[0]).map(m => parents(parents(m)[0]))
    const gearsFlat = gears.flatMap(x => x)
    const gearsOrder = new Map()
    const state = initialState(network)
    let i = 0
    while (gearsOrder.size < gearsFlat.length) {
        pushButton(network, state)
        i++
        gearsFlat
            .filter(m => !gearsOrder.has(m) && state[ModuleType.FlipFlop].get(m))
            .forEach(m => gearsOrder.set(m, i))
    }
    return gears
        .map(gear => gear
            .map(tooth => gearsOrder.get(tooth))
            .reduce(sum))
        .reduce(prod)
}

function pushButton(network: Network, state: NetworkState) {
    let low = 1 // Button to broadcaster
    let high = 0
    const broadcast = network.get("broadcaster")!.targets
    const queue = broadcast.map(t => ({ src: "broadcaster", dest: t, pulse: false }))
    while (queue.length > 0) {
        const { src, dest, pulse } = queue.shift()!
        if (pulse)
            high++
        else
            low++
        if (!network.has(dest))
            continue
        const { type, targets } = network.get(dest)!
        const moduleArgs = {
            name: dest,
            src,
            pulse,
            state: state[type].get(dest)!,
            targets
        }
        let result
        switch (type) {
            case ModuleType.FlipFlop:
                result = handleFlipFlop(moduleArgs as ModuleHandlerArgs<ModuleType.FlipFlop>)
                state[type].set(dest, result.state)
                break
            case ModuleType.Conjunction:
                result = handleConjunction(moduleArgs as ModuleHandlerArgs<ModuleType.Conjunction>)
                state[type].set(dest, result.state)
                break
        }
        queue.push(...result.pulses)
    }
    return {
        low,
        high
    }
}

function handleFlipFlop({ name, pulse, state, targets }: ModuleHandlerArgs<ModuleType.FlipFlop>) {
    if (pulse)
        return {
            pulses: [],
            state
        }
    state = !state
    return {
        pulses: targets.map(dest => ({ src: name, dest, pulse: state })),
        state
    }
}

function handleConjunction({ name, src, pulse, state, targets }: ModuleHandlerArgs<ModuleType.Conjunction>) {
    state.set(src, pulse)
    const output = !every(state.values(), x => x)
    return {
        pulses: targets.map(dest => ({ src: name, dest, pulse: output })),
        state
    }
}

function initialState(network: Network): NetworkState {
    const state: NetworkState =
        Object.fromEntries(
            Object.values(ModuleType).map(k => [k, new Map()])) as NetworkState
    for (let m of network.values()) {
        if (m.type == ModuleType.FlipFlop) {
            state[m.type].set(m.name, false)
        }
        for (let t of m.targets) {
            const tm = network.get(t)
            if (tm?.type == ModuleType.Conjunction) {
                if (!state[tm.type].has(tm.name))
                    state[tm.type].set(tm.name, new Map())
                state[tm.type].get(tm.name)!.set(m.name, false)
            }
        }
    }
    return state
}

function parseModule(line: string): Module {
    const match = line.match(/^(%|&)?(\w+) -> ([\w, ]+)$/)
    if (match == null)
        throw Error(`Couldn't parse ${line}`)
    return {
        type: match[1] as ModuleType,
        name: match[2],
        targets: match[3].split(", ")
    }
}

main(solver)
