import 'node';

export default class Graph {
  constructor() {
    this.nodes[0] = new Node();
    this.children[0] = [];
  }

  evaluate(subject) {

  }

  addNode(node, parents) {
    parents.map((i) => {
      if (parents >= this.nodes.length) {
        throw new Error(`Invalid Parent Id: ${parent}`);
      }
    });

    let newIndex = this.nodes.push(node) - 1;
    this.children[newIndex] = [];
    parents.map((i) => {
      this.children[i].push(newIndex)
    });
  }
}
