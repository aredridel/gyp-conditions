var ometajs_ = require("ometajs");

var AbstractGrammar = ometajs_.grammars.AbstractGrammar;

var BSJSParser = ometajs_.grammars.BSJSParser;

var BSJSIdentity = ometajs_.grammars.BSJSIdentity;

var BSJSTranslator = ometajs_.grammars.BSJSTranslator;

var Condition = function Condition(source, opts) {
    AbstractGrammar.call(this, source, opts);
};

Condition.grammarName = "Condition";

Condition.match = AbstractGrammar.match;

Condition.matchAll = AbstractGrammar.matchAll;

exports.Condition = Condition;

require("util").inherits(Condition, AbstractGrammar);

Condition.prototype["expr"] = function $expr() {
    var l, op, r;
    return this._rule("atom", false, [], null, this["atom"]) && (l = this._getIntermediate(), 
    true) && this._rule("operator", false, [], null, this["operator"]) && (op = this._getIntermediate(), 
    true) && this._rule("atom", false, [], null, this["atom"]) && (r = this._getIntermediate(), 
    true) && this._exec([ op, l, r ]);
};

Condition.prototype["operator"] = function $operator() {
    return this._seq("<=") || this._match("<") || this._seq(">=") || this._match(">") || this._seq("==") || this._seq("!=");
};

Condition.prototype["identifier"] = function $identifier() {
    var v;
    return this._list(function() {
        return (this._atomic(function() {
            return this._rule("letter", false, [], null, this["letter"]);
        }) || this._match("_")) && this._any(function() {
            return this._atomic(function() {
                return this._atomic(function() {
                    return this._rule("letter", false, [], null, this["letter"]);
                }) || this._atomic(function() {
                    return this._rule("digit", false, [], null, this["digit"]);
                }) || this._match("_");
            });
        });
    }, true) && (v = this._getIntermediate(), true) && this._exec(this._options.variables[v]);
};

Condition.prototype["number"] = function $number() {
    return this._atomic(function() {
        return this._many(function() {
            return this._atomic(function() {
                return this._rule("digit", false, [], null, this["digit"]);
            });
        }) && this._match(".") && this._many(function() {
            return this._atomic(function() {
                return this._rule("digit", false, [], null, this["digit"]);
            });
        });
    }) || this._atomic(function() {
        return this._many(function() {
            return this._atomic(function() {
                return this._rule("digit", false, [], null, this["digit"]);
            });
        });
    });
};

Condition.prototype["string"] = function $string() {
    var q, v;
    return (this._match("'") || this._match('"')) && (q = this._getIntermediate(), true) && this._atomic(function() {
        return !this._atomic(function() {
            return this._rule("seq", false, [ q ], null, this["seq"]);
        }, true) && this._rule("char", false, [], null, this["char"]);
    }) && (v = this._getIntermediate(), true) && this._rule("q", false, [], null, this["q"]) && this._exec(v);
};

Condition.prototype["atom"] = function $atom() {
    return this._atomic(function() {
        return this._rule("identifier", false, [], null, this["identifier"]);
    }) || this._atomic(function() {
        return this._rule("literal", false, [], null, this["literal"]);
    });
};

Condition.prototype["literal"] = function $literal() {
    return this._atomic(function() {
        return this._rule("string", false, [], null, this["string"]);
    }) || this._atomic(function() {
        return this._rule("number", false, [], null, this["number"]);
    });
};

var Evaluator = function Evaluator(source, opts) {
    AbstractGrammar.call(this, source, opts);
};

Evaluator.grammarName = "Evaluator";

Evaluator.match = AbstractGrammar.match;

Evaluator.matchAll = AbstractGrammar.matchAll;

exports.Evaluator = Evaluator;

require("util").inherits(Evaluator, AbstractGrammar);

Evaluator.prototype["interp"] = function $interp() {
    return this._atomic(function() {
        var x, y;
        return this._list(function() {
            return this._match(">") && this._skip() && (x = this._getIntermediate(), true) && this._skip() && (y = this._getIntermediate(), 
            true);
        }) && this._exec(x > y);
    }) || this._atomic(function() {
        var x, y;
        return this._list(function() {
            return this._match("<") && this._skip() && (x = this._getIntermediate(), true) && this._skip() && (y = this._getIntermediate(), 
            true);
        }) && this._exec(x < y);
    }) || this._atomic(function() {
        var x, y;
        return this._list(function() {
            return this._match(">=") && this._skip() && (x = this._getIntermediate(), true) && this._skip() && (y = this._getIntermediate(), 
            true);
        }) && this._exec(x >= y);
    }) || this._atomic(function() {
        var x, y;
        return this._list(function() {
            return this._match("<=") && this._skip() && (x = this._getIntermediate(), true) && this._skip() && (y = this._getIntermediate(), 
            true);
        }) && this._exec(x <= y);
    }) || this._atomic(function() {
        var x, y;
        return this._list(function() {
            return this._match("!=") && this._skip() && (x = this._getIntermediate(), true) && this._skip() && (y = this._getIntermediate(), 
            true);
        }) && this._exec(x != y);
    }) || this._atomic(function() {
        var x, y;
        return this._list(function() {
            return this._match("==") && this._skip() && (x = this._getIntermediate(), true) && this._skip() && (y = this._getIntermediate(), 
            true);
        }) && this._exec(x == y);
    });
};

module.exports = function(str, variables) {
    var tree = Condition.matchAll(str, "expr", {
        variables: variables
    });
    return Evaluator.match(tree, "interp");
};