import * as moo from "moo";

// TODO: lexing inside of strings
// TODO: lexing `` strings

const blockState = (closingChar: string): moo.Rules => {
    return {
        blockClose: { match: new RegExp(`\\${closingChar}`), pop: 1 },
        bracketOpen: { match: /\{/, push: "brackets" },
        parenthesisOpen: { match: /\(/, push: "parenthesis" },
        squareBracketsOpen: { match: /\[/, push: "squareBrackets" },
        string: {
            match: /(?:(?:"(?:\\["\\]|[^"])*")|(?:'(?:\\['\\]|[^'])*')|(?:\\"(?:\\["\\]|[^"])*\\")|(?:\\'(?:\\['\\]|[^'])*\\'))/,
        },
        tagOpening: {
            match: /<(?!\/)(?=>|\w)[^>\s\}\)\]\'\"]*(?=[^]*>)(?=\s|>)/,
            push: "inTag",
        },
        tagClosing: /<\/\S*?>/,
        ignore: {
            // Ignore everything like main, plus block and string symbols
            match: new RegExp(
                `(?:[^])+?(?=<(?:(?=\\/|\\w|>)\S*)|\\${closingChar}|\\{|\\[|\\(|\\'|\\")`,
            ),
            lineBreaks: true,
        },
    };
};

export default moo.states({
    main: {
        // Try to match comment
        commentOpening: {
            match: /(?:[\s]*?)(?:<!--|{\/\*)/,
            push: "inComment",
        },

        // Try to match anything that looks like a tag
        tagOpening: {
            match: /<(?!\/)(?=>|\w)[\w-.:]*(?=[^]*>)(?=\s|\/?>)/,
            push: "inTag",
        },

        // Closing tag
        tagClosing: /<\/\S*?>/,

        // Anything that doesn't look like a tag is ignored
        ignore: { match: /(?:[^])+?(?=<(?:(?=\/|\w|>)\S*))/, lineBreaks: true },

        ignoreTheRest: { match: /[^]+/, lineBreaks: true },
    },
    inComment: {
        closeComment: { match: /(?:[^]*?)(?:-->|\*\/})/, pop: 1 },
    },
    inTag: {
        // Closes tag and returns to main state
        tagSelfClose: { match: /\/+>/, pop: 1 },

        // Closes tag and returns to main state
        closeTag: { match: />/, pop: 1 },

        // Attribute name
        attribute: /[^\s{"'[(=>]+/,

        // FIXME: this is a hack though
        // Usually can't happen, probably the tag was inside of string
        // enabling multiline on this, because string meaning is inverted
        stringAttribute: {
            match: /(?:(?:"(?:\\["\\]|[^"])*")|(?:'(?:\\['\\]|[^'])*')|(?:\\"(?:\\["\\]|[^"])*\\")|(?:\\'(?:\\['\\]|[^'])*\\'))/,
            lineBreaks: true,
        },

        // Equals not in a block -> start attribute value
        equals: { match: /=\s*/, push: "attributeValue" },

        // New line, effect is the same as whitespace
        newLine: { match: /\r?\n/, lineBreaks: true },

        // Whitespace separates attributes mainly
        whiteSpace: /[ \t]+/,

        bracketOpen: { match: /\{/, push: "brackets" },
        parenthesisOpen: { match: /\(/, push: "parenthesis" },
        squareBracketsOpen: { match: /\[/, push: "squareBrackets" },
    },
    attributeValue: {
        // String attribute value (single or double quotes)
        string: {
            match: /(?:(?:"(?:\\["\\]|[^"])*")|(?:'(?:\\['\\]|[^'])*')|(?:\\"(?:\\["\\]|[^"])*\\")|(?:\\'(?:\\['\\]|[^'])*\\'))/,
            lineBreaks: true,
            pop: 1,
        },

        // BRACKETS
        bracketOpen: { match: /\{/, push: "brackets" },
        parenthesisOpen: { match: /\(/, push: "parenthesis" },
        squareBracketsOpen: { match: /\[/, push: "squareBrackets" },

        // Pop the state, there is no value after this point
        tagValueOver: { match: /(?=\/+>)|(?=[\s>])/, lineBreaks: true, pop: 1 },

        // Presumably number or function call attribute value
        value: { match: /[^\s>\{\[\(\'\")]+/ },
    },
    brackets: blockState("}"),
    parenthesis: blockState(")"),
    squareBrackets: blockState("]"),
});
