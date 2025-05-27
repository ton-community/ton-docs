/**
 * @file Prism.js definition for Tolk (next-generation FunC)
 * @version 0.12.0
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

    'type-hint': /\b(enum|int|cell|void|never|bool|slice|tuple|builder|continuation|coins|int8|int16|int32|int64|uint8|uint16|uint32|uint64|uint256|bytes16|bytes32|bytes64|bits8|bits16|bits32|bits64|bits128|bits256)\b/,

    'boolean': /\b(false|true|null)\b/,

    'keyword': /\b(do|if|as|is|try|else|while|break|throw|catch|return|assert|repeat|continue|asm|builtin|import|export|true|false|null|redef|mutate|tolk|global|const|var|val|fun|get|struct|match|type)\b/,

    'self': /\b(self)\b/,

    'function': /[a-zA-Z$_][a-zA-Z0-9$_]*(?=(<[^>]+>)*\()/,

    'number': /\b(-?\d+|0x[\da-fA-F]+|0b[01]+)\b/,

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

    'operator': new RegExp("\\+|-|\\*|/|%|\\?|:|=|<|>|!|&|\\||\\^|==|!=|<=|>=|<<|>>|&&|\\|\\||~/|\\^/|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|->|<=>|~>>|\\^>>|<<=|>>=|=>"),

    'punctuation': /[.,;(){}\[\]]/,

    'attr-name': /@[a-zA-Z0-9]+/,

    'variable': [
      { pattern: /`[^`]+`/ },
      { pattern: /\b[a-zA-Z$_][a-zA-Z0-9$_]*\b/ },
    ]
  };

}(Prism));
