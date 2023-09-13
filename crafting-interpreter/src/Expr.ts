import { Token } from "./token";

export class Expr {}

export class Binary extends Expr {
    constructor(
        private left: Expr,
        private operator: Token,
        private right: Expr,
    ){
        super();
    }
}

export class Grouping extends Expr {
    constructor(private expression: Expr){
        super();
    }
}

export class Literal extends Expr {
    constructor(private value: Expr){
        super();
    }
}

export class Unary extends Expr {
    constructor(
        private operator: Token,
        private right: Expr,
    ){
        super();
    }
}
