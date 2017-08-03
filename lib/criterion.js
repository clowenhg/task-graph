'use strict';

class Criterion {
  evaluate(subject) {
    return !!subject; //Convert to boolean
  }
}

module.exports = Criterion;
