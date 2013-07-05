require('ometajs');
var cond = require('../index.ometajs');
var test = require('tap').test;
var parseLiteral = function(s) {
    return cond.parser.matchAll(s, 'literal');
};
var parseExpr = function(s) {
    return cond.parser.matchAll(s, 'expr');
};

test("Basic conditions", function (t) {
    t.equal(cond('n>0', {n: 1}), true);
    t.equal(cond('n<1', {n: 1}), false);
    t.equal(cond('n<=1', {n: 1}), true);
    t.end();
});

test("Fail on invalid", function(t) {
    t.throws(function() {
        parseExpr("1hello");
    });
    t.throws(function() {
        parseExpr("hello1");
    });
    t.throws(function() {
        parseExpr("hello 1");
    });
    t.throws(function() {
        parseExpr("1 hello");
    });
    t.end();
});

test("Arithmetic", function (t) {
    t.equals(cond('1+1'), 2, "Addition");
    t.equals(cond('1-1'), 0, "Subtraction");
    t.equals(cond('1 + -1'), 0, "Addition of negative number");
    t.equals(cond('1 * 2'), 2, "Multiplication");
    t.equals(cond('2 + 2 * 3'), 8, "Multiplication with precedence");
    t.end();
});

test("If expression", function (t) {
    t.equals(cond("1 if 1 else 2"), 1, "If true");
    t.equals(cond("1 if 0 else 2"), 2, "If false");
    t.end();
});
