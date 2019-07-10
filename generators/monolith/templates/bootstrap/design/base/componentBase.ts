const storage = require('node-persist');

import * as readline from "readline";
import chalk from "chalk";
import { injectable } from "inversify";

@injectable()
export abstract class ComponentBase {
    public initialize(): void {
    }

    protected notifyComplete(message: string, start: Date) {
        const duration = Math.abs(+new Date() - +start);

        readline.moveCursor(process.stdout, 0, -1);
        process.stdout.write(`--> \x1b[42m${message}: ${duration} ms\x1b[m\n`);
    }

    protected saveState(state: any) {
        return storage.setItem(this.constructor.name, JSON.stringify(state));
    }

    protected loadState() {
        return JSON.parse(storage.getItem(this.constructor.name));
    }
}
