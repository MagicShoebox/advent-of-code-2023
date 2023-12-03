import { main } from "../main"
import { assertRequired } from "../util"

const colors = ["red", "green", "blue"] as const
type Color = typeof colors[number]
type Game = {
    id: number,
    sets: Array<Record<Color, number>>
}

function solver(input: string[]) {
    const games = input.map(parseGame)
    return [
        part1(games),
        part2(games)
    ]
}

function part1(games: Game[]) {
    const gameValid = ({ sets }: Game) => sets.every(setValid)
    const setValid = ({ red, green, blue }: Record<Color, number>) =>
        red <= 12
        && green <= 13
        && blue <= 14
    return games
        .filter(gameValid)
        .map(game => game.id)
        .sum()
        .toString()
}

function part2(games: Game[]) {
    return games.map(({ sets }) =>
        colors
            .map(c => Math.max(...sets.map(s => s[c])))
            .prod())
        .sum()
        .toString()
}

function parseGame(line: string): Game {
    const chunks = line.split(/:|;/)
    const id = parseInt(chunks[0].match(/Game (\d+)/)?.[1] ?? "")
    const sets = chunks.slice(1).map(parseSet)
    const game = {
        id,
        sets
    }
    assertRequired(game)
    return game
}

function parseSet(chunk: string): Record<Color, number> {
    return Object.assign(
        Object.fromEntries(
            colors.map(c => [c, 0])
        ) as Record<Color, number>,
        Object.fromEntries(
            chunk.split(",")
                .map(c => c.match(/(\d+) (\w+)/) ?? [])
                .map(([_, count, color]) => [color, parseInt(count)])
        )
    )
}

main(solver)
