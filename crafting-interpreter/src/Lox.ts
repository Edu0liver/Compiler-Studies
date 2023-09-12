import * as fs from "fs";
import { exit } from "process";
import { Scanner } from "./Scanner";
import { Token } from "./token";

export class Lox {
    private hadError = false;

    runFile(path: string) {
        const file = fs.readFileSync(path).toString();
        console.log(file);
        this.interpretFile(file);
        
        this.hadError = false;
    }
    
    interpretFile(file: string) {
        const scanner = new Scanner(file);
        const tokens: Token[] = scanner.scanTokens();

        if (this.hadError) exit(65);

        for (const token of tokens) {
            console.log(token);
        }
    }

    error(line: number, message: string) {
        this.report(line, "", message);
    }
    
    report(line: number, where: string, message: string) {
        new Error( "[line " + line + "] Error" + where + ": " + message);
        this.hadError = true;
    }
}
