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





