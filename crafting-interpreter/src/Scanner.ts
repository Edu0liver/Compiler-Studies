import { Lox } from "./Lox";

class Scanner {
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;
    private lox = new Lox();

    constructor(private source: String) {}

    async scanTokens(): Promise<Token[]> {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.add(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }

    async isAtEnd(): Promise<boolean> {
        return this.current >= this.source.length;
    }

    async scanToken(): Promise<void> {
        const c = await this.advance();

        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break;
            case '!':
                this.addToken(await this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
            break;
            case '=':
                this.addToken(await this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(await this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(await this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
          default:
            this.lox.error(this.line, "Unexpected character.");
            break;
        }
    }

    async match(expected: string): Promise<boolean> {
        if (await this.isAtEnd()) return false;
        if (this.source.charAt(this.current) != expected) return false;

        this.current++;
        return true;
    }

    async advance(): Promise<string> {
        return this.source.charAt(this.current++);
    }
    
    async addToken(type: TokenType): Promise<void> {
        await this.addTokens(type, null);
    }
    
    async addTokens(type: TokenType, literal: any): Promise<void> {
        const text = this.source.substring(this.start, this.current);
        this.tokens.add(new Token(type, text, literal, this.line));
    }
}