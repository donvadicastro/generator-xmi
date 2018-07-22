import * as readline from "readline";
import chalk from "chalk";

export abstract class ComponentBase {
    public initialize(): void {
    }

    protected notifyComplete(message: string, start: Date) {
        const duration = Math.abs(+new Date() - +start);
        readline.moveCursor(process.stdout, 0, -1);
        process.stdout.write(`--> ${chalk.bgGreen(message)}: ${duration} ms\n`);
    }
}