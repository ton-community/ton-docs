/**
 * @file Prism.js definition for FunC
 * @link https://docs.ton.org/develop/func/overview
 * @version 0.4.4
 * @author Novus Nota (https://github.com/novusnota)
 * @author Nikita Sobolev (https://github.com/sobolevn)
 * @license MIT
 */
(function(Prism) {
  /** @type {Prism.GrammarValue} */
  var number = /-?\b(?:\d+|0x[\da-fA-F]+)\b(?![^\.~,;\[\]\(\)\s])/;

  /** @type {Prism.GrammarValue} */
  var string = [
    { // multi-line
      pattern: /"""[\s\S]*?"""[Hhcusa]?/,
      greedy: true,
      inside: {
        // string type
        'symbol': {
          pattern: /("""[\s\S]*?""")[Hhcusa]/,
          lookbehind: true,
          greedy: true,
        }
      },
    },
    { // single-line
      pattern: /"[^\n"]*"[Hhcusa]?/,
      greedy: true,
      inside: {
        // string type
        'symbol': {
          pattern: /("[^\n"]*")[Hhcusa]/,
          lookbehind: true,
          greedy: true,
        }
      },
    },
  ];

  /** @type {Prism.GrammarValue} */
  var operator = /(?:!=|\?|:|%=|%|&=|&|\*=|\*|\+=|\+|->|-=|-|\/%|\/=|\/|<=>|<<=|<<|<=|<|==|=|>>=|>>|>=|>|\^>>=|\^>>|\^=|\^\/=|\^\/|\^%=|\^%|\^|\|=|\||~>>=|~>>|~\/=|~\/|~%|~)(?=\s)/;

  /** @type {RegExp[]} */
  var var_identifier = [
    // quoted
    /`[^`\n]+`/,
    // plain
    /[^\.~,;\[\]\(\)\s]+/
  ];

  /** Prism.js definition for FunC */
  Prism.languages.func = {
    'comment': [
      { // single-line
        pattern: /;;.*/,
        lookbehind: true,
        greedy: true,
      },
      { // multi-line, not nested (TODO: nesting)
        // . isn't used, because it only applies to the single line
        pattern: /\{-[\s\S]*?(?:-\}|$)/,
        lookbehind: true,
        greedy: true,
      },
      {
        // unused variable identifier
        pattern: /\b_\b(?![^\.~,;\[\]\(\)\s])/
      },
    ],

    // Custom token for #pragma's
    'pragma': {
      pattern: /#pragma(.*);/,
      inside: {
        'keyword': /(?:#pragma|test-version-set|not-version|version|allow-post-modification|compute-asm-ltr)\b/,
        'number': /(?:\d+)(?:.\d+)?(?:.\d+)?/,
        'operator': /=|\^|<=|>=|<|>/,
        'string': string,
        'punctuation': /;/,
      }
    },

    // Custom token for #include's
    'include': {
      pattern: /#include(.*);/,
      inside: {
        'keyword': /#include\b/,
        'string': string,
        'punctuation': /;/,
      }
    },

    // builtin types
    'builtin': /\b(?:int|cell|slice|builder|cont|tuple|type)\b/,

    // builtin constants
    'boolean': /\b(?:false|true|nil|Nil)\b/,

    'keyword': /\b(?:forall|extern|global|asm|impure|inline_ref|inline|auto_apply|method_id|operator|infixl|infixr|infix|const|return|var|repeat|do|while|until|try|catch|ifnot|if|then|elseifnot|elseif|else)\b/,

    'number': number,

    'string': string,

    'operator': operator,

    'punctuation': [/[\.,;\(\)\[\]]/, /[\{\}](?![^\.~,;\[\]\(\)\s])/],

    // Function and method names in declarations, definitions and calls
    'function': [
      { // quoted
        pattern: new RegExp(var_identifier[0].source + /(?=\s*\()/.source),
        greedy: true,
      },
      { // bitwise not operator
        pattern: /~_/,
        greedy: true,
      },
      { // remaining operators
        pattern: new RegExp(/\^?_/.source + operator.source + /_/.source),
        greedy: true,
      },
      { // plain function or method name
        pattern: new RegExp(/[\.~]?/.source + var_identifier[1].source + /(?=\s*\()/.source),
        greedy: true,
      },
      { // builtin functions and methods
        pattern: /\b(?:divmod|moddiv|muldiv|muldivr|muldivc|muldivmod|null\?|throw|throw_if|throw_unless|throw_arg|throw_arg_if|throw_arg_unless|load_int|load_uint|preload_int|preload_uint|store_int|store_uint|load_bits|preload_bits|int_at|cell_at|slice_at|tuple_at|at|touch|touch2|run_method0|run_method1|run_method2|run_method3|~divmod|~moddiv|~store_int|~store_uint|~touch|~touch2|~dump|~stdump)\b/,
        greedy: true,
      },
    ],

    // Parametric polymorphism
    'class-name': /[A-Z][^\.~,;\[\]\(\)\s]*/,

    // All the rest of identifiers
    'variable': var_identifier.map(x => { return { pattern: x, greedy: true } }),
  };

  // Adding a fc alias
  Prism.languages.fc = Prism.languages.func;
}(Prism));
