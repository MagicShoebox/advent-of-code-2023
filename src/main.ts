import fs from "node:fs"
import os from "node:os"

export function main(solver: (input: string[]) => string[]): void {
    let input = null
    try {
        input = fs.readFileSync(process.argv[2], 'utf-8').split(os.EOL)
        if (!input[input.length - 1])
            input.pop()
    } catch (err) {
        console.log(err)
    }
    if (input != null) {
        for (const line of solver(input))
            console.log(line)
    }
}
