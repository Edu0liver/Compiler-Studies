import { interpretFile } from "./interpreter";
import * as fs from "fs"
import * as path from "path"

const pathFile = path.join(__dirname, "..", "lox_files", "file.lox");
const file = fs.readFileSync(pathFile).toString();

interpretFile(file as any)