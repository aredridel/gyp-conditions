var cond = require('../index');
var test = require('tap').test;
var parseLiteral = function(s) {
    return cond.parser.matchAll(s, 'literal');
};

test("Basic conditions", function (t) {
    t.equal(cond('n>0', {n: 1}), true);
    t.equal(cond('n<1', {n: 1}), false);
    t.equal(cond('n<=1', {n: 1}), true);
    t.end();
});

test("Literals", function(t) {
    t.equal(parseLiteral('0'), 0);
    t.equal(parseLiteral('010'), 8);
    t.equal(parseLiteral('0o10'), 8);
    t.equal(parseLiteral('0x10'), 16);
    t.equal(parseLiteral('2.0'), 2.0);
    t.equal(parseLiteral('2.5'), 2.5);
    t.end();
});

