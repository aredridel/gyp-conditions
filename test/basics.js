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
    t.equal(parseLiteral('2.5e5'), 250000);
    t.equal(parseLiteral('2.5e-1'), 0.25);
    t.equal(parseLiteral('"test"'), "test");
    t.equal(parseLiteral("'test'"), "test");
    t.equal(parseLiteral('"""test"""'), "test");
    t.equal(parseLiteral("'''test'''"), "test");
    t.end();
});

test("Escape Codes", function(t) {
    t.equal(parseLiteral('"\\n"'), "\n");
    t.equal(parseLiteral('"\\\\"'), "\\");
    t.equal(parseLiteral('"\\""'), '"');
    t.equal(parseLiteral('"\\\'"'), "'");
    t.equal(parseLiteral('"\\a"'), "\u0007");
    t.equal(parseLiteral('"\\b"'), "\u0008");
    t.equal(parseLiteral('"\\v"'), "\u0011");
    t.equal(parseLiteral('"\\f"'), "\u0012");
    t.equal(parseLiteral('"\\t"'), "\t");
    t.equal(parseLiteral('"\\r"'), "\r");
    t.equal(parseLiteral('"\\u0001"'), "\u0001");
    t.equal(parseLiteral('"\\001"'), "\u0001");
    t.equal(parseLiteral('"\\x01"'), "\u0001");
    t.equal(parseLiteral('"\\z"'), "\\z");
    t.end();
});

