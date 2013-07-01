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
        return this._rule("pointfloat", false, [], null, this["pointfloat"]);
    }) || this._atomic(function() {
        return this._rule("intpart", false, [], null, this["intpart"]);
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
    var s, e;
    return (this._match("e") || this._match("E")) && this._optional(function() {
        return this._match("+") || this._match("-");
    }) && (s = this._getIntermediate(), true) && this._many(function() {
        return this._atomic(function() {
            return this._rule("digit", false, [], null, this["digit"]);
        });
    }) && (e = this._getIntermediate(), true) && this._exec((s ? s : "") + e.join(""));
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
    var sp;
    return this._optional(function() {
        return this._rule("stringprefix", false, [], null, this["stringprefix"]);
    }) && (sp = this._getIntermediate(), true) && this._exec(function() {
        this.stringMode = sp;
        return true;
    }.call(this)) && (this._atomic(function() {
        return this._rule("longstring", false, [], null, this["longstring"]);
    }) || this._atomic(function() {
        return this._rule("shortstring", false, [], null, this["shortstring"]);
    }));
};

Condition.prototype["stringprefix"] = function $stringprefix() {
    return this._match("r") || this._match("u") || this._match("ur") || this._match("R") || this._match("U") || this._match("UR") || this._match("Ur") || this._match("uR") || this._match("b") || this._match("B") || this._match("br") || this._match("Br") || this._match("bR") || this._match("BR");
};

Condition.prototype["shortstring"] = function $shortstring() {
    return this._atomic(function() {
        var v;
        return this._match("'") && this._any(function() {
            return this._atomic(function() {
                return this._rule("shortstringitem", false, [ "'" ], null, this["shortstringitem"]);
            });
        }) && (v = this._getIntermediate(), true) && this._match("'") && this._exec(v.join(""));
    }) || this._atomic(function() {
        var v;
        return this._match('"') && this._any(function() {
            return this._atomic(function() {
                return this._rule("shortstringitem", false, [ '"' ], null, this["shortstringitem"]);
            });
        }) && (v = this._getIntermediate(), true) && this._match('"') && this._exec(v.join(""));
    });
};

Condition.prototype["longstring"] = function $longstring() {
    return this._atomic(function() {
        var v;
        return this._rule("seq", false, [ "'''" ], null, this["seq"]) && this._any(function() {
            return this._atomic(function() {
                return !this._atomic(function() {
                    return this._rule("seq", false, [ "'''" ], null, this["seq"]);
                }, true) && this._rule("longstringitem", false, [], null, this["longstringitem"]);
            });
        }) && (v = this._getIntermediate(), true) && this._rule("seq", false, [ "'''" ], null, this["seq"]) && this._exec(v.join(""));
    }) || this._atomic(function() {
        var v;
        return this._rule("seq", false, [ '"""' ], null, this["seq"]) && this._any(function() {
            return this._atomic(function() {
                return !this._atomic(function() {
                    return this._rule("seq", false, [ '"""' ], null, this["seq"]);
                }, true) && this._rule("longstringitem", false, [], null, this["longstringitem"]);
            });
        }) && (v = this._getIntermediate(), true) && this._rule("seq", false, [ '"""' ], null, this["seq"]) && this._exec(v.join(""));
    });
};

Condition.prototype["shortstringitem"] = function $shortstringitem() {
    var q;
    return this._skip() && (q = this._getIntermediate(), true) && (this._atomic(function() {
        return this._rule("escapeseq", false, [], null, this["escapeseq"]);
    }) || this._atomic(function() {
        return this._rule("shortstringchar", false, [ q ], null, this["shortstringchar"]);
    }));
};

Condition.prototype["shortstringchar"] = function $shortstringchar() {
    var q;
    return this._skip() && (q = this._getIntermediate(), true) && !this._atomic(function() {
        return this._match("\\") || this._match("\n") || this._atomic(function() {
            return this._rule("seq", false, [ q ], null, this["seq"]);
        });
    }, true) && this._rule("char", false, [], null, this["char"]);
};

Condition.prototype["longstringitem"] = function $longstringitem() {
    return this._atomic(function() {
        return this._rule("escapeseq", false, [], null, this["escapeseq"]);
    }) || this._atomic(function() {
        return this._rule("longstringchar", false, [], null, this["longstringchar"]);
    });
};

Condition.prototype["longstringchar"] = function $longstringchar() {
    return !this._atomic(function() {
        return this._match("\\");
    }, true) && this._rule("char", false, [], null, this["char"]);
};

Condition.prototype["escapeseq"] = function $escapeseq() {
    return this._atomic(function() {
        var u;
        return this._rule("seq", false, [ "\\u" ], null, this["seq"]) && this._list(function() {
            return this._optional(function() {
                return this._rule("digit", false, [], null, this["digit"]);
            }) && this._optional(function() {
                return this._rule("digit", false, [], null, this["digit"]);
            }) && this._optional(function() {
                return this._rule("digit", false, [], null, this["digit"]);
            }) && this._rule("digit", false, [], null, this["digit"]);
        }, true) && (u = this._getIntermediate(), true) && this._exec(String.fromCharCode(parseInt(u, 10)));
    }) || this._atomic(function() {
        var o;
        return this._match("\\") && this._list(function() {
            return this._rule("octdigit", false, [], null, this["octdigit"]) && this._optional(function() {
                return this._rule("octdigit", false, [], null, this["octdigit"]);
            }) && this._optional(function() {
                return this._rule("octdigit", false, [], null, this["octdigit"]);
            });
        }, true) && (o = this._getIntermediate(), true) && this._exec(String.fromCharCode(parseInt(o, 8)));
    }) || this._atomic(function() {
        var x;
        return this._rule("seq", false, [ "\\x" ], null, this["seq"]) && this._list(function() {
            return this._rule("hexdigit", false, [], null, this["hexdigit"]) && this._rule("hexdigit", false, [], null, this["hexdigit"]);
        }, true) && (x = this._getIntermediate(), true) && this._exec(String.fromCharCode(parseInt(x, 16)));
    }) || this._atomic(function() {
        var v;
        return this._match("\\") && this._rule("char", false, [], null, this["char"]) && (v = this._getIntermediate(), 
        true) && this._exec(unescape(v));
    });
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

function unescape(c) {
    switch (c) {
      case "\n":
        return "";

      case "\\":
        return "\\";

      case '"':
        return '"';

      case "'":
        return "'";

      case "a":
        return "";

      case "b":
        return "\b";

      case "f":
        return "";

      case "n":
        return "\n";

      case "N":
        throw new Error("not supported");

      case "r":
        return "\r";

      case "t":
        return "	";

      case "v":
        return "";

      default:
        return "\\" + c;
    }
}

module.exports = function(str, variables) {
    var tree = Condition.matchAll(str, "expr", {
        variables: variables
    });
    return Evaluator.match(tree, "interp");
};

module.exports.parser = Condition;