const Criterion = require('../criterion');

//https://regex101.com/r/hkoHlx/10
const expRegex = /^\s*(?:[a-z_]\w*|\[[0-9]*\])(?:(?:\.(?:[a-z_]\w*))|(?:\[[0-9]*\]))*\s*(?:<|>|=|<=|>=|!=)\s*(?:(?:-?[0-9]*\.?[0-9]*)|(?:('|").*(\1)))\s*$/i;
const operatorRegex = /\s*(<=|>=|!=|<|>|=)\s*/i;
const keyRegex = /[a-z_]\w*/i
const indexRegex = /\[([0-9]+)\]/g;

const operators = {
  '=': (a, b) => { return a == b },
  '!=': (a, b) => { return a != b },
  '<': (a, b) => { return a < b },
  '<=': (a, b) => { return a <= b },
  '>': (a, b) => { return a > b },
  '>=': (a, b) => { return a >= b },
}

class Compare extends Criterion {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  set expression(expression) {
    expression = expression.trim();
    if (!expRegex.test(expression)) {
      throw new Error(`Invalid Expression: ${expression}`);
    }

    this._expression = expression;

    let split = expression.split(operatorRegex);
    this.path = split[0];
    this.operator = split[1];
    this.value = split[2];
  }

  evaluate(subject) {
    let subjectValue = this.processPath(subject);
    if (subjectValue == null) {
      return false;
    }

    return operators[this.operator](subjectValue, this.value);
  }

  processPath(subject) {
    return this.path.split('.').reduce((obj, pathItem) => {
      if (indexRegex.test(pathItem)) {
        indexRegex.lastIndex = 0;

        let key = keyRegex.exec(pathItem)[0];
        obj = obj[key];

        let matches = indexRegex.exec(pathItem);
        let result = obj;
        try {
          while (matches) {
            result = result[matches[1]];
            matches = indexRegex.exec(pathItem);
          }
        } catch (err) {
          result = null;
        }
        return result;
      }

      try {
        return obj[pathItem];
      } catch (err) {
        return null;
      }
    }, subject);
  }
}

module.exports = Compare;
