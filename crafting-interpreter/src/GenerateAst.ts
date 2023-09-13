import * as fs from 'fs';

export class GenerateAst {

    runFile(path: string) {
        const file = fs.readFileSync(path).toString();
        this.interpretFile(file);
    }
    
    interpretFile(file: string) {
        const outputDir = file;
        
        this.defineAst(outputDir, "Expr", [
            "Binary   : Expr left, Token operator, Expr right",
            "Grouping : Expr expression",
            "Literal  : any value",
            "Unary    : Token operator, Expr right"
        ]);
    }

    defineAst(outputDir: string, baseName: string, types: string[]): void {
        const path = outputDir + "/" + baseName + ".ts";
    
        fs.writeFileSync(path, "export class " + baseName + " {");
        for (const type of types) {
          const className = type.split(":")[0].trim();
          const fields = type.split(":")[1].trim(); 
          this.defineType(path, baseName, className, fields);
        }
        fs.writeFileSync(path, "}");
    }

    defineType(path: string, baseName: string, className: string, fieldList: string): void {
        fs.writeFileSync(path, "  static class " + className + " extends " + baseName + " {");
    
        // Constructor.
        fs.writeFileSync(path, "constructor" + className + "(");
        // Store parameters in fields.
        const fields = fieldList.split(", ");

        for (const field of fields) {
            let name = field.split(" ")[1];
            fs.writeFileSync(path, "      this." + name + " = " + name + ";");
        }
    
        fs.writeFileSync(path, ") {}");
    }
}