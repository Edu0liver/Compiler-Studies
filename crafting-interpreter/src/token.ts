import { TokenType } from "./token-type";

export class Token {
  constructor(
    private type: TokenType,
    private lexeme: string,
    private literal: any,
    private line: number,
  ){}

  toString(): String {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}