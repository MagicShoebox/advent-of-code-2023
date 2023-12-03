import fs from "node:fs"
import os from "node:os"

export function main(solver: (input: string[]) => string[]): void {
    try {
        const input = fs.readFileSync(process.argv[2], 'utf-8').split(os.EOL)
        if (!input[input.length - 1])
            input.pop()
        for (const line of solver(input))
            console.log(line)
    } catch (err) {
        console.log(err)
    }
}
