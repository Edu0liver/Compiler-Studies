import { Lox } from "./Lox";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Scanner {
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;
    private lox = new Lox();
    private keywords: { [ key: string ]: TokenType } = {};

    constructor(private source: String) {
        this.keywords["and"] = TokenType.AND;
        this.keywords["class"] = TokenType.CLASS;
        this.keywords["else"] = TokenType.ELSE;
        this.keywords["false"] = TokenType.FALSE;
        this.keywords["for"] = TokenType.FOR;
        this.keywords["fun"] = TokenType.FUN;
        this.keywords["if"] = TokenType.IF;
        this.keywords["nil"] = TokenType.NIL;
        this.keywords["or"] = TokenType.OR;
        this.keywords["print"] = TokenType.PRINT;
        this.keywords["return"] = TokenType.RETURN;
        this.keywords["super"] = TokenType.SUPER;
        this.keywords["this"] = TokenType.THIS;
        this.keywords["true"] = TokenType.TRUE;
        this.keywords["var"] = TokenType.VAR;
        this.keywords["while"] = TokenType.WHILE;
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }

    isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    scanToken(): void {
        const c = this.advance();

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
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
            break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    while ((this.peek()) != '\n' && !(this.isAtEnd())) this.advance();
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case '"': this.string(); break;
          default:
            if (this.isDigit(c)) {
                this.number();
            } else if (this.isAlpha(c)) {
                this.identifier();
            } else {
                this.lox.error(this.line, "Unexpected character.");
            }
            this.lox.error(this.line, "Unexpected character.");
            break;
        }
    }

    match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) != expected) return false;

        this.current++;
        return true;
    }

    peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    advance(): string {
        return this.source.charAt(this.current++);
    }
    
    addToken(type: TokenType): void {
        this.addTokens(type, null);
    }
    
    addTokens(type: TokenType, literal: any): void {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    string(): void {
        while ((this.peek()) != '"' && !(this.isAtEnd())) {
            if ((this.peek()) == '\n') this.line++;
            this.advance();
        }
    
        if (this.isAtEnd()) {
            this.lox.error(this.line, "Unterminated string.");
            return;
        }
    
        this.advance();
    
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addTokens(TokenType.STRING, value);
    }

    isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    number(): void {
        while (this.isDigit(this.peek())) this.advance();
    
        if ((this.peek()) == '.' && (this.isDigit(this.peekNext()))) {
            this.advance();
        
            while (this.isDigit(this.peek())) this.advance();
        }
    
        this.addTokens(TokenType.NUMBER, Number(this.source.substring(this.start, this.current)));
    }

    peekNext(): string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.current + 1);
    }

    identifier(): void {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.substring(this.start, this.current);
        let type = this.keywords[text];

        if (type == null) type = TokenType.IDENTIFIER;

        this.addToken(type);
    }
    
    isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c == '_';
    }

    isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }
}