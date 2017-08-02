import '../criterion';

//https://regex101.com/r/hkoHlx/10
const expRegex = /^\s*(?:[a-z_]\w*|\[[0-9]*\])(?:(?:\.(?:[a-z_]\w*))|(?:\[[0-9]*\]))*\s*(?:<|>|=|<=|>=|!=)\s*(?:(?:-?[0-9]*\.?[0-9]*)|(?:('|").*(\1)))\s*$/i;
const operatorRegex = /(<=|>=|!=|<|>|=)/i;
const indexRegex = /\[([0-9]+?)\]*/;

const operators = {
  '=': (a, b) => { return a == b },
  '!=': (a, b) => { return a != b },
  '<': (a, b) => { return a < b },
  '<=': (a, b) => { return a <= b },
  '>': (a, b) => { return a > b },
  '>=': (a, b) => { return a >= b },
}

export default class Compare extends Criterion {
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

    let split = operatorRegex.split(expression);
    this.path = split[0];
    this.value = split[1];

    this.operator = operatorRegex.exec(expression)[0];
  }

  evaluate(subject) {
    let subjectValue = processPath(subject);
    if (subjectValue == null) {
      return false;
    }

    return operators[this.operator](subjectValue, this.value);
  }

  processPath(subject) {
    return this.path.split('.').reduce((obj, pathItem) => {
      if (indexRegex.test(pathItem)) {
        let matches = indexRegex.exec(pathItem);
        let result;
        try {
          while (matches) {
            result = obj[matches[1]];
            matches = indexRegex.exec(pathItem);
          }
        } catch (err) {
          result = null;
        }
        return result;
      }

      return obj[pathItem];
    }, subject);
  }
}


