# മലയാളം-LISP: A Malayalam-based LISP-inspired Programming Language

## Project Overview

മലയാളം-LISP (Malayalam-LISP) is an experimental programming language that combines the expressive power of LISP with the fun of malayalam words. This project aims to create a unique programming experience that is both familiar to LISP programmers and intuitive for Malayalam speakers.

**Note: This project is currently in progress and not yet complete.**

## Features (Planned)

- Syntax inspired by LISP, written in Manglish.
- Support for functional programming paradigms
- Malayalam keywords and function names
- Integration of Malayalam linguistic structures into programming concepts
- REPL (Read-Eval-Print Loop) for interactive programming

## Inspiration

This project draws inspiration from:
- The LISP programming language
- The [BHAI lang project](https://bhailang.js.org/)


## Current Status

The project is in active development. Key components under construction include:
- [x] Lexer for Malayalam tokens
- [x] Parser for LISP-like structure
- [ ] Basic interpreter
- [ ] Core library of Malayalam-named functions
- [ ] REPL interface

## Example (Conceptual)
```malayalam-LISP
\ this is a comment
kanikku("hello world!");
kanikku(2 + 3 * 4);

add = chadangu (n) n+1;

kanikku(add(15));

print_everything = chadangu(a,b)
						enganum a <=b aanengi {
							kanikku(a);
							enganum a + 1 <=b aanengi {
								kanikku(", ");
								print_everything(a + 1, b);
								} allengi kanikku("");
							};
print_everything(1, 5);
```
