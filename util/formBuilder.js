let __i = 0;
const types = {
  Text: {
    Single: __i++,
    Multi: __i++
  },
  Number: {
    Integer: __i++,
    Float: __i++
  },
  Date: {
    DateOnly: __i++,
    TimeOnly: __i++,
    DateTime: __i++
  },
  Select: {
    Single: __i++,
    Multi: __i++
  },
  File: {
    Single: __i++,
    Multi: __i++
  }
};

module.exports = {
  Type: types
};