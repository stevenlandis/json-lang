const { areEqual } = require("../src/areEqual");

const testInfo = {
  tests: [],
  count: 0,
};
exports.test = function (name, fcn) {
  testInfo.tests.push({ name, fcn });
};

exports.runTests = function () {
  testInfo.tests.forEach(({ name, fcn }) => {
    try {
      fcn();
      testInfo.count++;
    } catch (error) {
      console.log(`${name} failed:`);
      throw error;
    }
  });

  console.log(
    `Passed ${testInfo.count} test${testInfo.count === 1 ? "" : "s"}`
  );
};

exports.assertEq = function (a, b) {
  if (!areEqual(a, b)) {
    throw new Error();
  }
};
