`json-lang` lets you write programs in json.

The goal of this project is to make a very simple functional programming language that is written entirely in json.

Here's a program that returns the sum of two numbers

```json
{
  "type": "function",
  "instructions": [],
  "return": {
    "type": "add",
    "a": { "type": "literal", "value": 1 },
    "b": { "type": "literal", "value": 2 }
  }
}
```

Currently, the only way to run a program in json-lang is to use the javascript API:

```js
import { evalJsonLang } from "json-lang";

const program = {
  type: "function",
  instructions: [],
  return: {
    type: "add",
    a: { type: "ref", name: "input" },
    b: { type: "literal", value: 3 },
  },
};
const argument = 10;
console.log(evalJsonLang(program, argument));
// prints 13
```

Each program in `json-lang` is a function that takes a single json object as input and returns a single json object.

Metaprogramming in `json-lang` is entirely complete and very easy because you can create a json object in a program and call that object as a function.

Since I'm lazy, documentation is the single test file `test/index.js`. For the most part, each test runs a program and checks the result. I implemented factorial in one of the tests if you want to see how to define a complex function.
