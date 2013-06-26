var cond = require('../index');
var test = require('tap').test;

test("Basic conditions", function (t) {
    t.equal(cond('n>0', {n: 1}), true);
    t.equal(cond('n<1', {n: 1}), false);
    t.equal(cond('n<=1', {n: 1}), true);
    t.end();
});
