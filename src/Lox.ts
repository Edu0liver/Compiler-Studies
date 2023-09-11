import * as fs from "fs";
import { exit } from "process";

export class Lox {
    private hadError = false;

    async runFile(path: string) {
        const file = fs.readFileSync(path).toString();

        await this.interpretFile(file);
        
        this.hadError = false;
    }
    
    async interpretFile(file: string) {
        const scanner = new Scanner(file);
        const tokens: Token[] = await scanner.scanTokens();

        if (this.hadError) exit(65);

        for (const token of tokens) {
            console.log(token);
        }
    }

    async error(line: number, message: string) {
        await this.report(line, "", message);
    }
    
    async report(line: number, where: string, message: string) {
        new Error( "[line " + line + "] Error" + where + ": " + message);
        this.hadError = true;
    }
}
