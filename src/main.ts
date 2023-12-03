import fs from "node:fs"
import os from "node:os"

export function main(part1: (input: string[]) => string, part2?: (input: string[]) => string): void {
    try {
        const input = fs.readFileSync(process.argv[2], 'utf-8').split(os.EOL)
        if (!input[input.length - 1])
            input.pop()
        console.log(part1(input))
        if (part2)
            console.log(part2(input))
    } catch (err) {
        console.log(err)
    }
}
