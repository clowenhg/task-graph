const Compare = require('../../lib/criteria/compare');

let compare = new Compare('a[0][1].i = 1');
let subject = { a: [[{}, { i: 1 }]] };

console.log(compare.evaluate(subject));
