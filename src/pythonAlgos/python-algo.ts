// if (workString[i] === coolStartIndicator) {
//     allStartEndIndicators.push({
//         globalIndexZero: i,
//         lineZero: currLineZero,
//         inLineIndexZero: currInLineIndexZero,
//         type: "s",
//     });
// } else if (workString[i] === coolEndIndicator) {
//     allStartEndIndicators.push({
//         globalIndexZero: i,
//         lineZero: currLineZero,
//         inLineIndexZero: currInLineIndexZero,
//         type: "e",
//     });
// }

import { IEditorInfo } from "../extension";
import { findLineZeroAndInLineIndexZero, IPositionEachZero } from "../utils";

// import { Python3Parser } from "dt-python-parser";
const classPython3Parser = require("dt-python-parser").Python3Parser;

const pyParser = new classPython3Parser();

export const findUpperNonCommentLineZero = (
    pyText: string,
    currLineZero: number,
    lMap: number[],
): number => {
    for (let lz = currLineZero - 1; lz >= 0; lz -= 1) {
        for (let gz = lMap[lz]; gz <= lMap[lz + 1] - 2; gz += 1) {
            if ([" ", "\n"].includes(pyText[gz])) {
                continue;
            }

            if (pyText[gz] === "#") {
                break;
            } else {
                return lz;
            }
        }
    }

    return -1;
};

export const pyFn = (pythonTextInput: string, editorInfo: IEditorInfo) => {
    let lMap = editorInfo.textLinesMap;
    let pythonText = pythonTextInput;
    const originalLastInd = pythonTextInput.length - 1;

    // if (pythonTextInput[originalLastInd] !== "\n") {
    //     pythonText = `${pythonText}\n `;
    //     lMap = [...lMap, originalLastInd + 2];
    // } else {
    //     pythonText = `${pythonText} `;
    //     lMap = [...lMap, originalLastInd + 1];
    // }

    const typeS = 93; // type 93 is INDENT
    const typeE = 94; // type 94 is DEDENT

    // console.time("py");
    const pyTokens: any[] = pyParser.getAllTokens(pythonText);
    // console.timeEnd("py");

    let indentsAndDedents: {
        type: number;
        line: number;
        column: number;
        start: number;
        stop: number;
    }[] = [];

    pyTokens.map((x: any) => {
        if ([typeS, typeE].includes(x.type)) {
            indentsAndDedents.push({
                type: x.type,
                line: x.line,
                column: x.column,
                start: x.start,
                stop: x.stop,
            });
        }
    });

    let blockOpenersClosers: IPositionEachZero[] = [];

    // console.log("indentsAndDedents:", indentsAndDedents);

    indentsAndDedents.map((x) => {
        if (x.type === typeS) {
            const realLineZero = findUpperNonCommentLineZero(
                pythonText,
                x.line - 1,
                lMap,
            );
            // const globalIndexZero = lMap[realLineZero + 1] - 2;
            const globalIndexZero = lMap[realLineZero + 1] - 1;

            const { inLineIndexZero } = findLineZeroAndInLineIndexZero({
                globalIndexZero,
                editorInfo,
            });

            // blockOpenersClosers.push({
            //     globalIndexZero,
            //     lineZero: realLineZero,
            //     inLineIndexZero,
            //     type: "s",
            // });
            blockOpenersClosers.push({
                globalIndexZero,
                lineZero: realLineZero,
                inLineIndexZero,
                type: "s",
            });
        } else if (x.type === typeE) {
            let realLineZero =
                findUpperNonCommentLineZero(pythonText, x.line - 1, lMap) + 1;

            // console.log("realLineZero:", realLineZero);
            // console.log("lMap:", lMap);
            // console.log("lMap[realLineZero]:", lMap[realLineZero]);

            // blockOpenersClosers.push({
            //     globalIndexZero: lMap[realLineZero],
            //     lineZero: realLineZero,
            //     inLineIndexZero: 0,
            //     type: "e",
            // });

            const globalIndexZero = lMap[realLineZero] - 1;

            const { inLineIndexZero } = findLineZeroAndInLineIndexZero({
                globalIndexZero,
                editorInfo,
            });

            blockOpenersClosers.push({
                globalIndexZero,
                lineZero: realLineZero - 1,
                inLineIndexZero: inLineIndexZero,
                type: "e",
            });
        }
    });

    // console.log("blockOpenersClosers:", blockOpenersClosers);
    return blockOpenersClosers;
};

/*
export const getPythonCodeMap = (
    text: string,
    tabSize: number,
): {
    inLineLeftNonSpaceZero: number | null;
    openerLocation: IPositionEachZero | null;
    inLineFirstNonSpaceAfterOpener: string | null;
    inLineRightNonSpaceZero: number | null;
}[] => {
    const openingBrackets = ["{", "(", "[", "<"];
    const closingBrackets = ["}", ")", "]", ">"];

    let openerCount = 0;
    let closerCount = 0;

    let currOpenerBr: string | null = null;
    let currCloserBr: string | null = null;

    let currBracketScope = "";

    let weAreInCommentArea = text[0] === "#";
    let weAreInBracketArea = openingBrackets.includes(text[0]);

    let currLevel = 0; // 0 is entire file depth, 1 is first depth....
    let currLineZero = 0;
    let currInLineIndexZero = 0;

    let foundNonSpaceInLine = false;
    let foundColon = false;
    let openerLocation: IPositionEachZero | null = null;
    let closerLocation: IPositionEachZero | null = null;

    let firstNonSpaceInLine: number | null = null;
    let currNonSpaceInLine: number | null = null;

    let currInLineFirstNonSpaceAfterOpener: string | null = null;
    let keepSearchingAfterOpener = true;

    let openingZeroLevelBracketLineZero = -2;
    let closingZeroLevelBracketLineZero = -1;

    let codeMap: {
        inLineLeftNonSpaceZero: number | null;
        openerLocation: IPositionEachZero | null;
        inLineFirstNonSpaceAfterOpener: string | null;
        inLineRightNonSpaceZero: number | null;
    }[] = [];

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];

        if (!weAreInBracketArea && openingBrackets.includes(char)) {
            openingZeroLevelBracketLineZero = currLineZero;

            weAreInBracketArea = true;
            const bracketIndex = openingBrackets.indexOf(char);
            currOpenerBr = char;
            currCloserBr = closingBrackets[bracketIndex];
            openerCount += 1;
        } else if (currOpenerBr && currOpenerBr === char) {
            openerCount += 1;
        } else if (currCloserBr && currCloserBr === char) {
            closerCount += 1;
            if (closerCount === openerCount) {
                weAreInBracketArea = false;

                closingZeroLevelBracketLineZero = currLineZero;
            }
        }

        if (char === " ") {
            // if (!foundNonSpaceInLine) {
            // }
        } else if (char !== "\n") {
            if (!foundNonSpaceInLine) {
                foundNonSpaceInLine = true;
                firstNonSpaceInLine = currInLineIndexZero;
            }
            currNonSpaceInLine = currInLineIndexZero;
        }

        if (!foundColon && !weAreInBracketArea && char === ":") {
            foundColon = true;
            openerLocation = {
                globalIndexZero: i,
                inLineIndexZero: currInLineIndexZero,
                lineZero: currLineZero,
                type: "s",
            };
        }

        if (keepSearchingAfterOpener && openerLocation) {
            if (![":", "\n", "#", " "].includes(char)) {
                currInLineFirstNonSpaceAfterOpener = char;
                keepSearchingAfterOpener = false;
            }

            if (char === "#") {
                keepSearchingAfterOpener = false;
            }
        }

        if (char === `\n`) {
            // console.log(
            //     currLineZero,
            //     openingZeroLevelBracketLineZero,
            //     closingZeroLevelBracketLineZero,
            // );
            const leftMostIgnoringBool =
                (weAreInBracketArea &&
                    openingZeroLevelBracketLineZero < currLineZero) ||
                (currLineZero !== openingZeroLevelBracketLineZero &&
                    currLineZero === closingZeroLevelBracketLineZero);

            codeMap.push({
                inLineLeftNonSpaceZero: leftMostIgnoringBool
                    ? null
                    : firstNonSpaceInLine,
                openerLocation,
                inLineFirstNonSpaceAfterOpener: currInLineFirstNonSpaceAfterOpener,
                inLineRightNonSpaceZero: currNonSpaceInLine,
            });

            currLineZero += 1;
            currInLineIndexZero = 0;

            foundNonSpaceInLine = false;
            firstNonSpaceInLine = null;
            currNonSpaceInLine = null;
            openerLocation = null;
            foundColon = false;
            currInLineFirstNonSpaceAfterOpener = null;
            keepSearchingAfterOpener = true;
        } else if (i === text.length - 1) {
            const leftMostIgnoringBool =
                (weAreInBracketArea &&
                    openingZeroLevelBracketLineZero < currLineZero) ||
                (currLineZero !== openingZeroLevelBracketLineZero &&
                    currLineZero === closingZeroLevelBracketLineZero);

            codeMap.push({
                inLineLeftNonSpaceZero: leftMostIgnoringBool
                    ? null
                    : firstNonSpaceInLine,
                openerLocation,
                inLineFirstNonSpaceAfterOpener: currInLineFirstNonSpaceAfterOpener,
                inLineRightNonSpaceZero: currNonSpaceInLine,
            });
        } else {
            currInLineIndexZero += 1;
        }
    }

    console.log("codeMap:");
    console.log(codeMap);

    return codeMap;
};

getPythonCodeMap(pyExample, 2);

export const getPythonIndentBasedBlocksdd = (
    pythonCodeMap: {
        inLineLeftNonSpaceZero: number | null;
        openerLocation: IPositionEachZero | null;
        inLineFirstNonSpaceAfterOpener: string | null;
        inLineRightNonSpaceZero: number | null;
    }[],
): IPositionEachZero[] => {
    return [
        {
            globalIndexZero: 7,
            lineZero: 1,
            inLineIndexZero: 2,
            type: "s",
        },
    ];
};
*/
