exports.areEqual = function (a, b) {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    return a.every((val, i) => areEqual(val, b[i]));
  }
  if (typeof a === "object") {
    if (!(typeof b === "object")) {
      return false;
    }
    if (!Object.keys(a).every((key) => key in b)) {
      return false;
    }
    if (!Object.keys(b).every((key) => key in a)) {
      return false;
    }
    return Object.keys(a).every((key) => areEqual(a[key], b[key]));
  }
  return false;
};
