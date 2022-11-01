import { states } from "moo";
import { IEditorInfo } from "../extension";
import { IPositionEachZero } from "../utils";

let sqlLexer = states({
    main: {
        commentOpening: {
            match: /\/\*/,
            push: "inComment",
        },
        param: /@[a-zA-Z_][a-zA-Z0-9_]*/,
        backetParens: /\([^\)]*\)|\[[^\]]*\]/,
        begin: /[bB][eE][gG][iI][nN]|[cC][aA][sS][eE]\s+[wW][hH][eE][nN]/,
        end: /[eE][nN][dD]/,
        singleLineComment: /--.+/,
        string: { match: /'[^']*'/, lineBreaks: true },
        ignore: {
            match: /[a-zA-Z]+|[0-9]+|[^a-zA-Z0-9@'\s]+|\s+|@/,
            lineBreaks: true,
        },
    },
    inComment: {
        closeComment: { match: /(?:[^]*?)(?:\*\/)/, pop: 1 },
    },
});

export const sqlFn = (
    sqlTextInput: string,
    editorInfo: IEditorInfo,
): IPositionEachZero[] => {
    let re: IPositionEachZero[] = [];
    sqlLexer.reset(sqlTextInput);
    let match = sqlLexer.next();
    while (match) {
        switch (match.type) {
            case "begin":
                re.push({
                    type: "s",
                    globalIndexZero: match.offset + 4,
                    inLineIndexZero: match.col + 4,
                    lineZero: match.line,
                });
                break;
            case "end":
                re.push({
                    type: "e",
                    globalIndexZero: match.offset + 0,
                    inLineIndexZero: match.col + 0,
                    lineZero: match.line,
                });
                break;
            default:
                break;
        }
        match = sqlLexer.next();
    }
    return re;
};
