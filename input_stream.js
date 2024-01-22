"use strict";
function InputStream(string) {
    if(!new.target) {
        return new InputStream(string);
    }
    let pos = 0, line = 1, col = 0;
    this.next = function() {
        let ch = string.charAt(pos++);
        if (ch == "\n") line++, col = 0; else col++;
        return ch;

    };
    this.peek = function() {
        return string.charAt(pos);
    };
    this.lastValue = function() {
        return peek() == "";
    };
    this.croak = function(msg) {
        throw new Error(msg + " (" + line + ":"+ col + ")");
    };
    
}
/* This is the tokenStream object which has all the methods to deal with the stream of inputs */

function tokenStream(string) {
     let current = null;
     let keywords = " enganum anengi allengi chadangu seri thettu ";
     return {
        next: next,
        peek: peek,
        lastValue : lastValue,
        croak : string.croak
     };
    //checks for keywords
    function checkKeyword(ch) {
        return keywords.indexOf(" " + ch + " ") >= 0;
    }
    //checks for the digits using regular expression
    function checkDigit(ch) {
        return /[0-9a-fA-F]/i.test(ch);
    }
    
    function checkIdStart(ch) {
        return /[a-z]/i.test(ch);
    }
    // checks for id , basically variables
    function checkId(ch) {
        return checkIdStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
    }
    function checkOpChar(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }
    function checkPunc(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }
    function check_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }

    function readGiven(predicate) {
        let str = "";
        for (; !string.lastValue() && predicate(string.peek()); str += string.next()) {
     }
    return str;
    }
    
    function readNumber() {
    let has_dot = false;
    let has_exponent = false;
    let is_hex = false;
    let is_octal = false;
    let number = readGiven(function(ch) {
        if (ch === ".") {
            if (has_dot) return false;
            has_dot = true;
            return true;
        } else if (/[eE]/.test(ch)) {
            if (has_exponent) return false;
            has_exponent = true;
            return true;
        } else if (/[xX]/.test(ch) && number === '0') { // Ensure 'x' or 'X' follows '0' for hex
            if (is_hex) return false;
            is_hex = true;
            return true;
        } else if (/[0-7]/.test(ch)) {
            if (is_octal || number === '0') { // Allow octal digits if already in octal or starts with '0'
                is_octal = true;
                return true;
            }
            return false;
        }
        return checkDigit(ch);
    });

    let numericValue;
    if (has_exponent) {
        numericValue = parseFloat(number);
    } else if (is_hex) {
        numericValue = parseInt(number, 16);
    } else if (is_octal) {
        numericValue = parseInt(number, 8);
    } else {
        numericValue = parseFloat(number);
    }

    return { type: "num", value: numericValue };
}

    function readId() {
        let id = readGiven(checkId);
        return { type: checkKeyword(id) ? "kw" : "var", 
                  value: id
                };
    }
    function readEscaped(end) {
        let escaped = false,
        str = "";
        string.next();
        while(!string.lastValue()){
            let ch = string.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;

    }
    function readString() {
        return { type: "str", value: readEscaped('"')};
    }
    function skipComment() {
        readGiven(function(ch) {
            return ch != "\n"
        })
        string.next();
    }

    function readNext() {
        readGiven(check_whitespace);
        if(string.lastValue()) return null;
        let ch = string.peek();
        if(ch == '"') return readString();
        if(checkDigit(ch)) return readNumber();
        if(checkIdStart(ch)) return readId();
        if(ch == "#") {
        skipComment(); 
        return readNext();
        }
        if(checkPunc(ch)) return {
        type: "punc",
        value: string.next()
        };
    
        if(checkOpChar(ch)) return {
        type: "op",
        value: readGiven(checkOpChar)
        };
        string.croak("can't handle character: " + ch);
    }
    function peek() {
        return current || (current = readNext());
    }
    function next() {
        var tok = current;
        current = null;
        return tok || readNext();
    }
    function lastValue() {
        return peek() == null;
    }

}
    
function parseAtom() {
    return maybeCall(function () {
        if (checkPunc("(")) {
            string.next();
            let exp = parseExpression();
            skipPunc(")");
            return exp;
        }
        if (checkPunc("{")) return parseProg();
        if (checkKeyword("aanengi")) return parseIf();
        if (checkKeyword("seri") || checkKeyword("thettu")) return parseBoolean();
        if (checkKeyword("chadangu")) {
            string.next();
            return parseLambda();
        }
        let tok = input.next();
        if (tok.type == 'var' || tok.type == "num" || tok.type == "str")
            return tok;
        unexpected();
    });
}