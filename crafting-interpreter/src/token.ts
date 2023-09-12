
class Token {
    constructor(
        private type: TokenType,
        private lexeme: string,
        private literal: any,
        private line: number,
    ){}
  
    async toString(): Promise<String> {
      return this.type + " " + this.lexeme + " " + this.literal;
    }
}