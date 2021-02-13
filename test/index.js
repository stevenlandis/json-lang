const { evalJsonLang } = require("../src/index");
const { test, runTests, assertEq } = require("./utils");

test("basic addition", () => {
  assertEq(
    evalJsonLang(
      {
        type: "function",
        instructions: [
          { type: "let", name: "a", value: { type: "literal", value: 5 } },
        ],
        return: {
          type: "add",
          a: { type: "ref", name: "input" },
          b: { type: "ref", name: "a" },
        },
      },
      6
    ),
    11
  );
});

test("call the argument as a function", () => {
  assertEq(
    evalJsonLang(
      {
        type: "function",
        instructions: [],
        return: {
          type: "call",
          function: { type: "ref", name: "input" },
          argument: { type: "literal", value: 5 },
        },
      },
      {
        type: "function",
        instructions: [],
        return: {
          type: "add",
          a: { type: "ref", name: "input" },
          b: { type: "literal", value: 6 },
        },
      }
    ),
    11
  );
});

test("declare a function and call on argument", () => {
  assertEq(
    evalJsonLang(
      {
        type: "function",
        instructions: [
          {
            type: "let",
            name: "add_five",
            value: {
              type: "literal",
              value: {
                type: "function",
                instructions: [],
                return: {
                  type: "add",
                  a: { type: "literal", value: 5 },
                  b: { type: "ref", name: "input" },
                },
              },
            },
          },
        ],
        return: {
          type: "call",
          function: { type: "ref", name: "add_five" },
          argument: { type: "ref", name: "input" },
        },
      },
      6
    ),
    11
  );
});

test("declare recursive factorial function and call on input", () => {
  assertEq(
    evalJsonLang(
      {
        type: "function",
        instructions: [
          {
            type: "let",
            name: "factorial",
            value: {
              type: "literal",
              value: {
                type: "function",
                instructions: [],
                return: {
                  type: "if",
                  condition: {
                    type: "eq",
                    a: { type: "ref", name: "input" },
                    b: { type: "literal", value: 0 },
                  },
                  true: { type: "literal", value: 1 },
                  false: {
                    type: "mul",
                    a: { type: "ref", name: "input" },
                    b: {
                      type: "call",
                      function: { type: "ref", name: "factorial" },
                      argument: {
                        type: "sub",
                        a: { type: "ref", name: "input" },
                        b: { type: "literal", value: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
        return: {
          type: "call",
          function: { type: "ref", name: "factorial" },
          argument: { type: "ref", name: "input" },
        },
      },
      5
    ),
    120
  );
});

runTests();
