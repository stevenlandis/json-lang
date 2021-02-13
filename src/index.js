/*
JSON-lang: a toy language that's a love letter to JSON
*/
// const fs = require("fs");

// function main() {
//   console.log(
//     jsonEval(
//       JSON.parse(fs.readFileSync("main.json")),
//       JSON.parse(fs.readFileSync("argument.json"))
//     )
//   );
// }
const { areEqual } = require("./areEqual");

exports.evalJsonLang = function (func, argument) {
  return callFunction(undefined, func, argument);
};

function assert(cond) {
  if (!cond) {
    throw new Error();
  }
}

function callFunction(parentFunction, func, argument) {
  const functionState = new FunctionState(parentFunction);
  const result = functionState.run(func, argument);
  return result;
}

class FunctionState {
  constructor(parent) {
    this.parent = parent;
    this.variables = {};
  }
  run(func, argument) {
    this.variables["input"] = argument;
    func.instructions.forEach((instruction) => {
      this.runInstruction(instruction);
    });
    return this.calculate(func.return);
  }
  calculate(obj) {
    switch (obj.type) {
      case "literal":
        return obj.value;
      case "ref":
        return this.getRefValue(obj.name);
      case "if":
        return this.calculate(obj.condition)
          ? this.calculate(obj.true)
          : this.calculate(obj.false);
      case "eq":
        return areEqual(this.calculate(obj.a), this.calculate(obj.b));
      case "or":
        return this.calculate(obj.a) || this.calculate(obj.b);
      case "and":
        return this.calculate(obj.a) && this.calculate(obj.b);
      case "add":
        return this.calculate(obj.a) + this.calculate(obj.b);
      case "sub":
        return this.calculate(obj.a) - this.calculate(obj.b);
      case "mul":
        return this.calculate(obj.a) * this.calculate(obj.b);
      case "mod":
        return this.calculate(obj.a) % this.calculate(obj.b);
      case "call":
        return callFunction(
          this,
          this.calculate(obj.function),
          this.calculate(obj.argument)
        );
      default:
        assert(false);
    }
  }
  getRefValue(name) {
    if (name in this.variables) {
      return this.variables[name];
    }
    if (this.parent) {
      return this.parent.getRefValue(name);
    }
    assert(false);
  }
  runInstruction(instruction) {
    switch (instruction.type) {
      case "let": {
        assert(!(instruction.name in this.variables));
        this.variables[instruction.name] = this.calculate(instruction.value);
        break;
      }
      default:
        assert(false);
    }
  }
}

class RefCountingObjStore {
  constructor() {
    this.objects = {};
  }
  getNewId() {
    while (true) {
      const id = Math.floor((1 << 30) * Math.random());
      if (!(id in this.objects)) {
        return id;
      }
    }
  }

  create(value) {
    const id = this.getNewId();
    this.objects[id] = { value: value, refCount: 0 };
    return id;
  }

  getValue(id) {
    return this.objects[id].value;
  }

  claim(id) {
    this.objects[id].refCount++;
  }

  release(id) {
    this.objects[id].refCount--;
    if (this.objects[id].refCount === 0) {
      delete this.objects[id];
    }
  }
}

// main();
