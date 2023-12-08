import { main } from "../main"
import { sum } from "../util"

type Hand = {
    value: number,
    bet: number
}

enum HandRank {
    FiveOfAKind = 6,
    FourOfAKind = 5,
    FullHouse = 4,
    ThreeOfAKind = 3,
    TwoPair = 2,
    OnePair = 1,
    HighCard = 0
}

function solver(input: string[]) {
    const part1 = input
        .map(parseHand)
    const part2 = input
        .map(x => x.replaceAll("J", "W"))
        .map(parseHand)
    return [part1, part2]
        .map(part => part
            .sort(({ value: a }, { value: b }) => a - b)
            .map(({ bet }, i) => bet * (i + 1))
            .reduce(sum)
            .toString()
        )
}

function parseHand(line: string): Hand {
    const [hand, betStr] = line.split(" ")
    return {
        value: valueHand(hand),
        bet: parseInt(betStr)
    }
}

function valueHand(hand: string): number {
    const count = new Map()
    let value = 0
    for (let card of hand) {
        value = value * 14 + rankCard(card)
        count.set(card, 1 + (count.get(card) ?? 0))
    }
    const rank = rankHand([...count.values()], count.get("W") ?? 0)
    return 14 ** 5 * rank + value
}

function rankHand(counts: number[], jokers: number): HandRank {
    switch (counts.length) {
        case 1:
            return HandRank.FiveOfAKind
        case 2:
            if (jokers > 0)
                return HandRank.FiveOfAKind
            if (counts[0] == 1 || counts[1] == 1)
                return HandRank.FourOfAKind
            return HandRank.FullHouse
        case 3:
            if (counts[0] == 2 || counts[1] == 2) {
                if (jokers == 2)
                    return HandRank.FourOfAKind
                if (jokers == 1)
                    return HandRank.FullHouse
                return HandRank.TwoPair
            }
            if (jokers > 0)
                return HandRank.FourOfAKind
            return HandRank.ThreeOfAKind
        case 4:
            if (jokers > 0)
                return HandRank.ThreeOfAKind
            return HandRank.OnePair
        case 5:
            if (jokers > 0)
                return HandRank.OnePair
            return HandRank.HighCard
        default:
            throw new Error(`Could't determine hand: ${counts}`)
    }
}

function rankCard(card: string): number {
    switch (card) {
        case "W":
            return 0
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            return parseInt(card) - 1
        case "T":
            return 9
        case "J":
            return 10
        case "Q":
            return 11
        case "K":
            return 12
        case "A":
            return 13
        default:
            throw new Error(`Couldn't determine card: ${card}`)
    }
}

main(solver)
