/**
 * @file Prism.js definition for Tolk (next-generation FunC)
 * @version 0.6.0
 * @author Aleksandr Kirsanov (https://github.com/tolk-vm)
 * @license MIT
 */
(function(Prism) {
  Prism.languages.tolk = {
    'comment': [
      {
        pattern: /\/\/.*/,
        greedy: true,
      },
      {
        // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
        pattern: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
        greedy: true,
      }
    ],

    'type-hint': /\b(type|enum|int|cell|void|bool|auto|slice|tuple|builder|continuation)\b/,

    'boolean': /\b(false|true|null)\b/,

    'keyword': /\b(do|if|try|else|while|break|throw|catch|return|assert|repeat|continue|asm|builtin|import|export|true|false|null|redef|mutate|tolk|global|const|var|val|fun|get|struct)\b/,

    'self': /\b(self)\b/,

    'function': /[a-zA-Z$_][a-zA-Z0-9$_]*(?=\s*[(<])/,

    'number': new RegExp("(-?([\\d]+|0x[\\da-fA-F]+))\\b"),

    'string': [
      {
        pattern: /"""[\s\S]*?"""/,
        greedy: true,
      },
      {
        pattern: /"[^\n"]*"\w?/,
        greedy: true,
      },
    ],

    'operator': new RegExp("\\+|-|\\*|/|%|\\?|:|=|<|>|!|&|\\||\\^|==|!=|<=|>=|<<|>>|&&|\\|\\||~/|\\^/|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|->|<=>|~>>|\\^>>|<<=|>>="),

    'punctuation': /[.,;(){}\[\]]/,

    'attr-name': /@[a-zA-Z0-9]+/,

    'variable': [
      { pattern: /`[^`]+`/ },
      { pattern: /\b[a-zA-Z$_][a-zA-Z0-9$_]*\b/ },
    ]
  };

}(Prism));
