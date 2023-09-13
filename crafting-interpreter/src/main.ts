import { GenerateAst } from "./GenerateAst";
import { Lox } from "./Lox";

const lox = new Lox();
const generateAst = new GenerateAst();

lox.runFile('./lox_files/file.lox')
lox.runFile('./lox_files/file.lox')