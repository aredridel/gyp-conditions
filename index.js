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

Condition.prototype["floatnumber"] = function $floatnumber() {
    var f;
    return (this._atomic(function() {
        return this._rule("exponentfloat", false, [], null, this["exponentfloat"]);
    }) || this._atomic(function() {
        return this._rule("pointfloat", false, [], null, this["pointfloat"]);
    })) && (f = this._getIntermediate(), true) && this._exec(parseFloat(f));
};

Condition.prototype["pointfloat"] = function $pointfloat() {
    return this._atomic(function() {
        var x, y;
        return this._optional(function() {
            return this._rule("intpart", false, [], null, this["intpart"]);
        }) && (x = this._getIntermediate(), true) && this._rule("fraction", false, [], null, this["fraction"]) && (y = this._getIntermediate(), 
        true) && this._exec(x + "." + y);
    }) || this._atomic(function() {
        var x;
        return this._rule("intpart", false, [], null, this["intpart"]) && (x = this._getIntermediate(), 
        true) && this._match(".") && this._exec(x + ".0");
    });
};

Condition.prototype["exponentfloat"] = function $exponentfloat() {
    var f, e;
    return (this._atomic(function() {
        return this._rule("intpart", false, [], null, this["intpart"]);
    }) || this._atomic(function() {
        return this._rule("pointfloat", false, [], null, this["pointfloat"]);
    })) && (f = this._getIntermediate(), true) && this._rule("exponent", false, [], null, this["exponent"]) && (e = this._getIntermediate(), 
    true) && this._exec(f + "e" + e);
};

Condition.prototype["intpart"] = function $intpart() {
    var v;
    return this._many(function() {
        return this._atomic(function() {
            return this._rule("digit", false, [], null, this["digit"]);
        });
    }) && (v = this._getIntermediate(), true) && this._exec(v.join(""));
};

Condition.prototype["fraction"] = function $fraction() {
    var y;
    return this._match(".") && this._many(function() {
        return this._atomic(function() {
            return this._rule("digit", false, [], null, this["digit"]);
        });
    }) && (y = this._getIntermediate(), true) && this._exec(y.join(""));
};

Condition.prototype["exponent"] = function $exponent() {
    var e;
    return (this._match("e") || this._match("E")) && this._optional(function() {
        return this._match("+") || this._match("-");
    }) && this._many(function() {
        return this._atomic(function() {
            return this._rule("digit", false, [], null, this["digit"]);
        });
    }) && (e = this._getIntermediate(), true);
};

Condition.prototype[""] = function $() {
    return this._exec(e.join(""));
};

Condition.prototype["longinteger"] = function $longinteger() {
    var i;
    return this._rule("integer", false, [], null, this["integer"]) && (i = this._getIntermediate(), 
    true) && (this._match("L") || this._match("l")) && this._exec(i);
};

Condition.prototype["integer"] = function $integer() {
    return this._atomic(function() {
        return this._rule("bininteger", false, [], null, this["bininteger"]);
    }) || this._atomic(function() {
        return this._rule("octinteger", false, [], null, this["octinteger"]);
    }) || this._atomic(function() {
        return this._rule("hexinteger", false, [], null, this["hexinteger"]);
    }) || this._atomic(function() {
        return this._rule("decimalinteger", false, [], null, this["decimalinteger"]);
    });
};

Condition.prototype["decimalinteger"] = function $decimalinteger() {
    return this._atomic(function() {
        var v;
        return this._atomic(function() {
            return this._rule("nonzerodigit", false, [], null, this["nonzerodigit"]) && this._any(function() {
                return this._atomic(function() {
                    return this._rule("digit", false, [], null, this["digit"]);
                });
            });
        }) && (v = this._getIntermediate(), true) && this._exec(parseInt(v, 10));
    }) || this._atomic(function() {
        return this._match("0") && this._exec(0);
    });
};

Condition.prototype["octinteger"] = function $octinteger() {
    return this._atomic(function() {
        var v;
        return this._seq(/^(0o)/i) && this._many(function() {
            return this._atomic(function() {
                return this._rule("octdigit", false, [], null, this["octdigit"]);
            });
        }) && (v = this._getIntermediate(), true) && this._exec(parseInt(v.join(""), 8));
    }) || this._atomic(function() {
        var v;
        return this._atomic(function() {
            return this._match("0") && this._many(function() {
                return this._atomic(function() {
                    return this._rule("octdigit", false, [], null, this["octdigit"]);
                });
            });
        }) && (v = this._getIntermediate(), true) && this._exec(parseInt(v, 8));
    });
};

Condition.prototype["hexinteger"] = function $hexinteger() {
    var v;
    return this._seq(/^(0x)/i) && this._many(function() {
        return this._atomic(function() {
            return this._rule("hexdigit", false, [], null, this["hexdigit"]);
        });
    }) && (v = this._getIntermediate(), true) && this._exec(parseInt(v.join(""), 16));
};

Condition.prototype["bininteger"] = function $bininteger() {
    var v;
    return this._seq(/^(0b)/i) && this._many(function() {
        return this._atomic(function() {
            return this._rule("bindigit", false, [], null, this["bindigit"]);
        });
    }) && (v = this._getIntermediate(), true) && this._exec(parseInt(v.join(""), 2));
};

Condition.prototype["nonzerodigit"] = function $nonzerodigit() {
    return this._seq(/^([1-9])/);
};

Condition.prototype["octdigit"] = function $octdigit() {
    return this._seq(/^([0-7])/);
};

Condition.prototype["bindigit"] = function $bindigit() {
    return this._seq(/^([01])/);
};

Condition.prototype["hexdigit"] = function $hexdigit() {
    return this._atomic(function() {
        return this._rule("digit", false, [], null, this["digit"]);
    }) || this._seq(/^([a-f])/i);
};

Condition.prototype["stringliteral"] = function $stringliteral() {
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
        return this._rule("stringliteral", false, [], null, this["stringliteral"]);
    }) || this._atomic(function() {
        return this._rule("floatnumber", false, [], null, this["floatnumber"]);
    }) || this._atomic(function() {
        return this._rule("longinteger", false, [], null, this["longinteger"]);
    }) || this._atomic(function() {
        return this._rule("integer", false, [], null, this["integer"]);
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

module.exports.parser = Condition;