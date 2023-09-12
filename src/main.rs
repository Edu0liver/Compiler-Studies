// https://ruslanspivak.com/lsbasi-part1/
use std::{fmt::{self, Formatter, Display}, io};

#[derive(Debug, Clone, PartialEq)]
enum TokenTypes {
    Integer,
    Plus,
    Minus,
    Multiplication,
    Division,
    EOF,
    InvalidType
}

#[derive(Debug, Clone, PartialEq)]
struct Token {
    token_type: TokenTypes,
    value: Option<String>,
}

impl Token {
    fn new(token_type: TokenTypes, value: Option<String>) -> Self {
        Token {
            token_type,
            value
        }
    }
}

impl Display for Token {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        let binding = String::new();

        let token_type = match self.token_type {
            TokenTypes::Integer=> "Integer",
            TokenTypes::Plus=> "Plus",
            TokenTypes::Minus=> "Minus",
            TokenTypes::Multiplication=> "Multiplication",
            TokenTypes::Division=> "Division",
            TokenTypes::EOF => "EOF",
            TokenTypes::InvalidType => "InvalidType",
        };

        let value = match &self.value {
            Some(v) => v,
            None => &binding
        };

        write!(f, "Token({}, {}", token_type, value)
    }
}

#[derive(Debug, Clone)]
struct Interpreter {
    text: String,
    pos: i32,
    current_token: Option<Token>,
}

impl Interpreter {
    fn new(text: String) -> Self {
        Interpreter {
            text: text.trim().chars().filter(|c| !c.is_whitespace()).collect(),
            pos: 0,
            current_token: None,
        }
    }

    fn error(&self) {
        panic!("Error parsing input")
    }

    fn get_next_token(&mut self) -> Result<Token, ()> {
        let text = &self.text;

        if self.pos > text.len() as i32 - 1 {
            return Ok(Token::new(TokenTypes::EOF, None))
        }

        let current_char = text.chars().nth(self.pos as usize).unwrap();
        let next_char = text.chars().nth(self.pos as usize + 1).unwrap_or('a');

        if current_char.is_numeric() && next_char.is_numeric() {
            let token = Token::new(TokenTypes::Integer, format!("{}{}", current_char, next_char).into());
            self.pos += 2;
            return Ok(token)
        }

        if current_char.is_numeric() {
            let token = Token::new(TokenTypes::Integer, Some(current_char.to_string()));
            self.pos += 1;
            return Ok(token)
        }

        let token_type = match current_char {
            '+' => TokenTypes::Plus,
            '-' => TokenTypes::Minus,
            '*' => TokenTypes::Multiplication,
            '/' => TokenTypes::Division,
            _ => TokenTypes::InvalidType
        };

        if token_type == TokenTypes::InvalidType {
            return Err(self.error())
        }

        let token = Token::new(token_type, Some(current_char.to_string()));
        self.pos += 1;

        Ok(token)
    }

    fn expr(&mut self) -> i32 {
        self.current_token = Some(self.get_next_token().unwrap());

        let left = self.current_token.clone().unwrap();
        self.current_token = Some(self.get_next_token().unwrap());

        let op = self.current_token.clone().unwrap();
        self.current_token = Some(self.get_next_token().unwrap());
        
        let right = self.current_token.clone().unwrap();
        self.current_token = Some(self.get_next_token().unwrap());

        let left_value = left.value.unwrap().parse::<i32>().unwrap();
        let right_value = right.value.unwrap().parse::<i32>().unwrap();

        match op.token_type {
            TokenTypes::Plus => left_value + right_value,
            TokenTypes::Minus => left_value - right_value,
            _ => panic!("Invalid operation")
        }

        // let mut a = Vec::new();
        // self.current_token = Some(self.get_next_token().unwrap());

        // while self.current_token.clone().unwrap().token_type != TokenTypes::EOF {
        //     a.push(self.current_token.clone().unwrap());
        //     self.current_token = Some(self.get_next_token().unwrap());
        //     println!("{:?}", a);
        // }

        // return a;


    }
}

fn main() {
    loop {
        let mut text = String::new();

        println!("calc>");
        io::stdin().read_line(&mut text).unwrap();

        if text.trim().len() == 0 {
            continue
        }

        let mut interpreter = Interpreter::new(text);
        let result = interpreter.expr();

        println!("{}", result);
    }
}
