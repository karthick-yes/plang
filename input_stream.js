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

function tokenStream(string) {
     let current = null;
     let keywords = " enganum anengi allengi chadangu seri thettu ";
     return {
        next: next,
        peek: peek,
        lastValue : lastValue,
        croak : string.croak
     };
    function checkKeyword(ch) {
        return keywords.indexOf(" " + ch + " ") >= 0;
    }
    function checkDigit(ch) {
        return /[0-9]/i.test(ch);
    }
    function checkIdStart(ch) {
        return /[a-z]/i.test(ch);
    }
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
        for (; !string.eof() && predicate(string.peek()); str += string.next()) {
     }
    return str;
    }
    
    function readNumber() {
        let has_dot = false;
        let number = readGiven(function(ch) {
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return checkDigit(ch);

        }); 
        return { type: "num", value: parseFloat(number)};
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
    



