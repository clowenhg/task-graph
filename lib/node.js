export default class Node {
  constructor() {
    this.criteria = [];
  }

  evaluate(subject) {
    let result = true;
    let i = 0;

    //Could use Array.Reduce, but this let's us short circuit on first failed criteria
    while (result && i < this.cretiera.length) {
      result = result && this.criteria[i];
      i++
    }

    return result;
  }
}
