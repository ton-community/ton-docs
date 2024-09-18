/**
 * @file Prism.js definition for Tact
 * @link https://tact-lang.org
 * @version 1.5.0
 * @author Novus Nota (https://github.com/novusnota)
 * @license MIT
 */
(function(Prism) {
  Prism.languages.tact = {
    // reserved keywords
    'keyword': [
      {
        pattern: /\b(?:abstract|asm|as|catch|const|contract(?!:)|do|else|extend|extends|foreach|fun|get|if|in|import|initOf|inline|let|message(?!:)|mutates|native|override|primitive|public|repeat|return|self|struct(?!:)|trait(?!:)|try|until|virtual|while|with)\b/,
      },
      { // reserved function names
        pattern: /\b(?:bounced|external|init|receive)\b(?=\()/
      },
    ],

    // built-in types
    'builtin': [
      {
        pattern: /\b(?:Address|Bool|Builder|Cell|Int|Slice|String|StringBuilder)\b/,
      },
      { // keyword after as, see: https://prismjs.com/extending.html#object-notation
        pattern: /(\bas\s+)(?:coins|remaining|bytes32|bytes64|int257|u?int(?:2[0-5][0-6]|1[0-9][0-9]|[1-9][0-9]?))\b/,
        lookbehind: true,
        greedy: true,
      },
    ],

    // SCREAMING_SNAKE_CASE for null values and names of constants
    'constant': [
      {
        pattern: /\bnull\b/,
      },
      {
        pattern: /\b[A-Z][A-Z0-9_]*\b/,
      },
    ],

    // UpperCamelCase for names of contracts, traits, structs, messages
    'class-name': {
      pattern: /\b[A-Z]\w*\b/,
    },

    // mappings to FunC
    'attribute': [
      { // functions
        pattern: /@name/,
        inside: {
          'function': /.+/,
        },
      },
      { // contract interfaces
        pattern: /@interface/,
        inside: {
          'function': /.+/,
        }
      }
    ],

    'function': {
      pattern: /\b\w+(?=\()/,
    },

    'boolean': {
      pattern: /\b(?:false|true)\b/,
    },

    'number': [
      { // hexadecimal, case-insensitive /i
        pattern: /\b0x[0-9a-f](?:_?[0-9a-f])*\b/i,
      },
      { // octal, case-insensitive /i
        pattern: /\b0o[0-7](?:_?[0-7])*\b/i,
      },
      { // binary, case-insensitive /i
        pattern: /\b0b[01](?:_?[01])*\b/i,
      },
      { // decimal integers, starting with 0
        pattern: /\b0\d*\b/,
      },
      { // other decimal integers
        pattern: /\b[1-9](?:_?\d)*\b/,
      },
    ],

    'string': undefined,

    'punctuation': {
      pattern: /[{}[\]();,.:?]/,
    },

    'comment': [
      { // single-line
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
      { // multi-line
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
      },
      {
        // unused variable identifier
        pattern: /\b_\b/
      }
    ],

    'operator': {
      'pattern': /![!=]?|->|[+\-*/%=]=?|[<>]=|<<?|>>?|~|\|[\|=]?|&[&=]?|\^=?/,
    },

    'variable': {
      'pattern': /\b[a-zA-Z_]\w*\b/,
    },

  };

  // strings, made this way to not collide with other entities
  Prism.languages.insertBefore('tact', 'string', {
    'string-literal': {
      pattern: /(?:(")(?:\\.|(?!\1)[^\\\r\n])*\1(?!\1))/,
      greedy: true,
      inside: {
        'regex': [
          { // \\ \" \n \r \t \v \b \f
            pattern: /\\[\\"nrtvbf]/,
          },
          { // hexEscape, \x00 through \xFF
            pattern: /\\x[0-9a-fA-F]{2}/,
          },
          { // unicodeEscape, \u0000 through \uFFFF
            pattern: /\\u[0-9a-fA-F]{4}/,
          },
          { // unicodeCodePoint, \u{0} through \u{FFFFFF}
            pattern: /\\u\{[0-9a-fA-F]{1,6}\}/,
          },
        ],
        'string': {
          pattern: /[\s\S]+/,
        },
      },
    },
  });

  // map and bounced message generic type modifiers
  Prism.languages.insertBefore('tact', 'keyword', {
    'generics': {
      pattern: /(?:\b(?:bounced|map)\b<[^\\\r\n]*>)/,
      greedy: true,
      inside: {
        'builtin': [
          ...Prism.languages['tact']['builtin'],
          {
            pattern: /\b(?:bounced(?=<)|map(?=<))\b/
          },
        ],
        'class-name': Prism.languages['tact']['class-name'],
        'punctuation': {
          pattern: /[<>(),.?]/,
        },
        'keyword': {
          pattern: /\bas\b/,
        },
      },
    },
  });
}(Prism));
