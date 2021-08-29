import { IEditorInfo } from "../extension";
import { findLineZeroAndInLineIndexZero, IPositionEachZero } from "../utils";

import * as YAML from "yaml";
// @ts-ignore
import * as traverse from "ast-traverse";
import { findUpperNonCommentLineZero } from "../pythonAlgos/python-algo";

const yamlAstMaker = YAML.parseDocument;

const nearestLeftNonSpaceIsNewLineChar = (
    txt: string,
    initialIndex: number,
): boolean => {
    if (initialIndex < 1) {
        return false;
    }
    for (let i = initialIndex - 1; i >= 0; i -= 1) {
        if (![" ", "\n"].includes(txt[i])) {
            return false;
        }
        if (txt[i] === "\n") {
            return true;
        }
    }
    return false;
};

export const yamlFn = (
    yamlTextInput: string,
    editorInfo: IEditorInfo,
): IPositionEachZero[] => {
    // const newText = yamlTextInput + "\n\n\n";
    const newText = yamlTextInput;

    let lMap = editorInfo.textLinesMap;
    const originalLastInd = newText.length - 1;

    const yamlAst = yamlAstMaker(newText);
    let myTokens: [number, number][] = [];
    traverse(yamlAst, {
        pre: function (node: any, parent: any, prop: any, idx: number) {
            // console.log(
            //     node.type +
            //         (parent
            //             ? " from parent " +
            //               parent.type +
            //               " via " +
            //               prop +
            //               (idx !== undefined ? "[" + idx + "]" : "")
            //             : "")
            // );

            // console.log(node.type, node.range);

            // if (!!node.range) {
            //     const leftNonSpaceIsNlChar = nearestLeftNonSpaceIsNewLineChar(
            //         newText,
            //         node.range[1],
            //     );
            //     console.log(node.type, node.range, leftNonSpaceIsNlChar);
            // }
            const range: [number, number] = node.range;
            if (!!range) {
                const [starter, ender] = range;
                if (!"{}[]".includes(newText[ender])) {
                    // excluding bracket blocks by Yaml tokenizer, because has issues,
                    // but we still get bracket blocks from global bracket tokenizer

                    const starterLeftNonSpaceIsNlChar =
                        nearestLeftNonSpaceIsNewLineChar(newText, starter);
                    const enderLeftNonSpaceIsNlChar =
                        nearestLeftNonSpaceIsNewLineChar(newText, ender);
                    if (
                        enderLeftNonSpaceIsNlChar &&
                        starterLeftNonSpaceIsNlChar
                    ) {
                        myTokens.push(range);
                    }
                }
            }
        },
    });

    const blockOpenersClosers: IPositionEachZero[] = [];

    myTokens = myTokens.filter((x) => {
        const opener = x[0];
        const { inLineIndexZero } = findLineZeroAndInLineIndexZero({
            globalIndexZero: opener,
            editorInfo,
        });
        return inLineIndexZero !== 0;
    });

    // console.log(myTokens);

    myTokens.map((x) => {
        // if (x[0] > 27) {
        //     return;
        // }
        if (x[0]) {
            const tokenGlo = x[0] - 1;
            const { lineZero: tokenLine } = findLineZeroAndInLineIndexZero({
                globalIndexZero: tokenGlo,
                editorInfo,
            });

            const realLineZero = findUpperNonCommentLineZero(
                newText,
                tokenLine,
                lMap,
            );

            const globalIndexZero = lMap[realLineZero + 1] - 1;

            const { inLineIndexZero } = findLineZeroAndInLineIndexZero({
                globalIndexZero,
                editorInfo,
            });

            blockOpenersClosers.push({
                globalIndexZero,
                lineZero: realLineZero,
                inLineIndexZero,
                type: "s",
            });
        }
        if (x[1]) {
            const tokenGlo = x[1];
            const { lineZero: tokenLine } = findLineZeroAndInLineIndexZero({
                globalIndexZero: tokenGlo,
                editorInfo,
            });
            let realLineZero =
                findUpperNonCommentLineZero(newText, tokenLine, lMap) + 1;

            const globalIndexZero = lMap[realLineZero] - 1;

            const { inLineIndexZero } = findLineZeroAndInLineIndexZero({
                globalIndexZero,
                editorInfo,
            });

            blockOpenersClosers.push({
                globalIndexZero,
                lineZero: realLineZero - 1,
                inLineIndexZero,
                type: "e",
            });
        }
    });

    return blockOpenersClosers;
};
