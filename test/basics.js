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

test("Escape Codes", function(t) {
    t.equal(parseLiteral('"\\n"'), "\n", "newline escape");
    t.equal(parseLiteral('"\\\\"'), "\\", "escaped backslash");
    t.equal(parseLiteral('"\\""'), '"', "escaped double quote");
    t.equal(parseLiteral('"\\\'"'), "'", "escaped single quote");
    t.equal(parseLiteral('"\\a"'), "\u0007", "bell");
    t.equal(parseLiteral('r"\\a"'), "\\a", "raw modifier on bell escape");
    t.equal(parseLiteral('"\\b"'), "\u0008", "backspace");
    t.equal(parseLiteral('"\\v"'), "\u0011", "vtab");
    t.equal(parseLiteral('"\\f"'), "\u0012", "form feed");
    t.equal(parseLiteral('"\\t"'), "\t", "tab");
    t.equal(parseLiteral('"\\r"'), "\r", "carriage return");
    t.equal(parseLiteral('"\\u0001"'), "\\u0001", "unicode in plain string");
    t.equal(parseLiteral('u"\\u0001"'), "\u0001", "unicode in unicode string");
    t.equal(parseLiteral('r"\\u0001"'), "\\u0001", "unicode in raw string");
    t.equal(parseLiteral('ur"\\u0001"'), "\u0001", "unicode in raw unicode string");
    t.equal(parseLiteral('"\\001"'), "\u0001", "octal byte");
    t.equal(parseLiteral('"\\x01"'), "\u0001", "hex byte");
    t.equal(parseLiteral('"\\z"'), "\\z", "invalid escape");
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
