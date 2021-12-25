import * as vscode from "vscode";
import {
    glo,
    IEditorInfo,
    TyInLineInDepthInQueueInfo,
    TyDepthDecInfo,
} from "./extension";
import { renderSingleLineBoxV1 } from "./renderLineToolV1";
import { renderSingleLineBoxV2 } from "./renderLineToolV2";
import { renderSingleLineBoxV3 } from "./renderLineToolV3";
import { renderSingleLineBoxV4 } from "./renderLineToolV4";
import {
    AdvancedColoringFields,
    editorBackgroundFormula,
    makeInnerKitchenNotation,
} from "./settingsManager";
import { IBlockRender } from "./utils";
import { notYetDisposedDecsObject } from "./utils2";

const neu = "neutral";
const advNeu = makeInnerKitchenNotation("basic");

export interface ISingleLineBox {
    editorInfo: IEditorInfo;
    depth: number; // 0 means entire file. 1 means first level block....
    inDepthBlockIndex: number;
    lineBlockType: "opening" | "middle" | "closing" | "onlyLine";
    isfirstFromTopToDown: boolean;
    isFirstFromBottomToUp: boolean;
    lineZero: number;
    boxHeight: number; // px

    boxLeftEdge: number; // px
    boxRightEdge: number; // px

    optimalLeftOfRangePx: number;
    optimalRightOfRangePx: number;

    legitFirstLineZero: number;
    legitLastLineZero: number;
    isFocusedBlock: boolean;

    firstLineHasVisibleChar: boolean;
    lastLineHasVisibleChar: boolean;

    firstVisibleChar: {
        lineZero: number;
        inLineIndexZero: number;
    };
    lastVisibleChar: {
        lineZero: number;
        inLineIndexZero: number;
    };
    inputBorderColor: string;
    inputBackgroundColor: string;
    borderSize: number;
}

export const renderSingleBlock = ({
    firstLineHasVisibleChar,
    lastLineHasVisibleChar,
    firstVisibleChar,
    lastVisibleChar,
    optimalLeftOfRange,
    optimalRightOfRange,
    depth,
    inDepthBlockIndex,
    firstLineZeroOfRender,
    lastLineZeroOfRender,
    editorInfo,
    lang,
    isFocusedBlock,
    absRangeEndPos,
}: IBlockRender) => {
    if (!firstVisibleChar || firstVisibleChar.lineZero < 0) {
        return;
    }

    // -----11111111111
    let inputBorderColor: string = `linear-gradient(to right, ${"transparent"}, ${"transparent"})`; // in final state it always must be linear gradient
    let inputBackgroundColor: string = `linear-gradient(to right, ${editorBackgroundFormula}, ${editorBackgroundFormula})`; // in final state it always must be linear gradient

    inputBorderColor = glo.coloring.border;

    switch (depth) {
        case 0:
            inputBackgroundColor = glo.coloring.onEachDepth[0];
            inputBorderColor = glo.coloring.borderOfDepth0;
            break;

        case 1:
            inputBackgroundColor = glo.coloring.onEachDepth[1];
            break;
        case 2:
            inputBackgroundColor = glo.coloring.onEachDepth[2];
            break;
        case 3:
            inputBackgroundColor = glo.coloring.onEachDepth[3];
            break;
        case 4:
            inputBackgroundColor = glo.coloring.onEachDepth[4];
            break;
        case 5:
            inputBackgroundColor = glo.coloring.onEachDepth[5];
            break;
        case 6:
            inputBackgroundColor = glo.coloring.onEachDepth[6];
            break;
        case 7:
            inputBackgroundColor = glo.coloring.onEachDepth[7];
            break;
        case 8:
            inputBackgroundColor = glo.coloring.onEachDepth[8];
            break;
        case 9:
            inputBackgroundColor = glo.coloring.onEachDepth[9];
            break;
        case 10:
            inputBackgroundColor = glo.coloring.onEachDepth[10];
            break;

        default:
            inputBackgroundColor = glo.coloring.onEachDepth[10];
    }

    let borderSize = glo.borderSize;
    if (glo.enableFocus && isFocusedBlock) {
        if (!glo.coloring.focusedBlock.includes("same")) {
            inputBackgroundColor = glo.coloring.focusedBlock;
        }
        if (!glo.coloring.borderOfFocusedBlock.includes("same")) {
            inputBorderColor = glo.coloring.borderOfFocusedBlock;
        }

        borderSize = 2;
    }

    // kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk

    let borderOfAC: undefined | string = undefined;
    let backgroundOfAC: undefined | string = undefined;

    const aCSettingsForBorders = glo.coloring.advanced.forBorders;
    const aCSettingsForBackgrounds = glo.coloring.advanced.forBackgrounds;

    const focPath = editorInfo.focusTreePath;
    // if (focPath) {
    //     if (focPath[depth] === inDepthBlockIndex) {
    //         // borderOfAC =
    //         //     "linear-gradient(to right, red, rgba(250, 10, 100, 0.3))";
    //     }
    // }

    const focInners = editorInfo.innersFromFocus;
    // if (focInners) {
    //     const indexes = focInners[depth];
    //     if (indexes && indexes.includes(inDepthBlockIndex)) {
    //         // borderOfAC = "linear-gradient(to right, blue, blue)";
    //     }
    // }

    const focusedBlockInfo = editorInfo.focusDuo.curr;
    const focDepth = focusedBlockInfo?.depth;

    // const focIndITD = focusedBlockInfo.indexInTheDepth;

    const inOnFocTree =
        focDepth &&
        depth <= focDepth &&
        focPath &&
        focPath[depth] === inDepthBlockIndex;

    const isInsideFoc =
        focDepth &&
        depth >= focDepth &&
        focInners &&
        focInners[depth]?.includes(inDepthBlockIndex);

    const decideColor = (
        aCSettings: {
            priority: number;
            sequence: string[];
            kind: AdvancedColoringFields;
        }[],
    ): string | undefined => {
        for (let i = 0; i < aCSettings.length; i += 1) {
            const seqInfo = aCSettings[i];
            const kind = seqInfo.kind;

            if (kind === AdvancedColoringFields.fromD0ToInward_All) {
                const myColor = seqInfo.sequence[depth];
                if (myColor && myColor !== neu) {
                    // borderOfAC = myColor;
                    // break;
                    if (myColor === advNeu) {
                        return undefined;
                    }
                    return myColor;
                }
            } else if (
                kind === AdvancedColoringFields.fromD0ToInward_FocusTree
            ) {
                let myColor = neu;
                if (inOnFocTree) {
                    myColor = seqInfo.sequence[depth];
                }
                if (myColor && myColor !== neu) {
                    // borderOfAC = myColor;
                    // break;
                    if (myColor === advNeu) {
                        return undefined;
                    }
                    return myColor;
                }
            } else if (kind === AdvancedColoringFields.fromFocusToInward_All) {
                let myColor = neu;
                if (focDepth && isInsideFoc) {
                    const myInd = depth - focDepth;
                    myColor = seqInfo.sequence[myInd];
                }
                if (myColor && myColor !== neu) {
                    // borderOfAC = myColor;
                    // break;
                    if (myColor === advNeu) {
                        return undefined;
                    }
                    return myColor;
                }
            } else if (kind === AdvancedColoringFields.fromFocusToOutward_All) {
                let myColor = neu;
                if (focDepth && depth <= focDepth) {
                    const myInd = focDepth - depth;
                    myColor = seqInfo.sequence[myInd];
                }
                if (myColor && myColor !== neu) {
                    // borderOfAC = myColor;
                    // break;
                    if (myColor === advNeu) {
                        return undefined;
                    }
                    return myColor;
                }
            } else if (
                kind === AdvancedColoringFields.fromFocusToOutward_FocusTree
            ) {
                let myColor = neu;
                if (focDepth && inOnFocTree) {
                    const myInd = focDepth - depth;
                    myColor = seqInfo.sequence[myInd];
                }
                if (myColor && myColor !== neu) {
                    // borderOfAC = myColor;
                    // break;
                    if (myColor === advNeu) {
                        return undefined;
                    }
                    return myColor;
                }
            }
        }

        return undefined;
    };

    borderOfAC = decideColor(aCSettingsForBorders);
    backgroundOfAC = decideColor(aCSettingsForBackgrounds);

    // ------222222222

    if (borderOfAC) {
        inputBorderColor = borderOfAC;
    }
    if (backgroundOfAC) {
        inputBackgroundColor = backgroundOfAC;
    }

    // ------- 333333

    for (
        let currLineZero = firstVisibleChar.lineZero;
        currLineZero <= lastVisibleChar.lineZero;
        currLineZero += 1
    ) {
        if (currLineZero < firstLineZeroOfRender) {
            continue;
        }
        if (currLineZero > lastLineZeroOfRender) {
            break;
        }

        let lChar = optimalLeftOfRange;
        let rChar = optimalRightOfRange;
        let currType: "opening" | "middle" | "closing" | "onlyLine";

        let isfirstFromTopToDown = false;
        let isFirstFromBottomToUp = false;

        // console.log("firstLineHasVisibleChar:", firstLineHasVisibleChar);
        // console.log("currLineZero:", currLineZero);
        // console.log(
        //     "firstVisibleChar.lineZero + 1:",
        //     firstVisibleChar.lineZero + 1,
        // );

        if (
            firstLineHasVisibleChar &&
            currLineZero === firstVisibleChar.lineZero + 1
        ) {
            isfirstFromTopToDown = true;
        }

        if (
            lastLineHasVisibleChar &&
            currLineZero === lastVisibleChar.lineZero - 1
        ) {
            isFirstFromBottomToUp = true;
        }

        if (firstVisibleChar.lineZero === lastVisibleChar.lineZero) {
            currType = "onlyLine";
        } else if (currLineZero === firstVisibleChar.lineZero) {
            currType = "opening";
            if (firstLineHasVisibleChar) {
                // if (!["python"].includes(lang)) {
                // for language which is not based on indentation
                lChar = firstVisibleChar.inLineIndexZero;
                // }
            }
        } else if (currLineZero === lastVisibleChar.lineZero) {
            currType = "closing";
            if (lastLineHasVisibleChar) {
                // if (!["python"].includes(lang)) {
                // for language which is not based on indentation

                // }

                if (
                    !(
                        absRangeEndPos &&
                        editorInfo.monoText[absRangeEndPos.globalIndexZero] ===
                            "\n"
                    )
                ) {
                    rChar = lastVisibleChar.inLineIndexZero;
                }
            }
        } else {
            currType = "middle";
        }

        // if (depth === 2) {
        // console.log("rendering depth");

        const singleRangeRendArg = {
            editorInfo,
            depth,
            inDepthBlockIndex,
            lineBlockType: currType,
            isfirstFromTopToDown,
            isFirstFromBottomToUp,
            lineZero: currLineZero,
            boxHeight: glo.eachCharFrameHeight, // px

            boxLeftEdge: glo.eachCharFrameWidth * lChar, // px
            boxRightEdge: glo.eachCharFrameWidth * (rChar + 1), // px

            optimalLeftOfRangePx: optimalLeftOfRange * glo.eachCharFrameWidth,
            optimalRightOfRangePx:
                (optimalRightOfRange + 1) * glo.eachCharFrameWidth,

            legitFirstLineZero: firstLineZeroOfRender,
            legitLastLineZero: lastLineZeroOfRender,
            isFocusedBlock,

            firstLineHasVisibleChar,
            lastLineHasVisibleChar,

            firstVisibleChar,
            lastVisibleChar,
            inputBorderColor,
            inputBackgroundColor,
            borderSize,
        };

        // renderSingleLineBoxV1(singleRangeRendArg); // old renderer function
        // renderSingleLineBoxV2(singleRangeRendArg); // new renderer function

        // for V3
        const firstLineOfMiddles = firstVisibleChar.lineZero + 2;
        const lastLineOfMiddles = lastVisibleChar.lineZero - 2;

        const isMid =
            currLineZero >= firstLineOfMiddles &&
            currLineZero <= lastLineOfMiddles;

        // renderSingleLineBoxV3(singleRangeRendArg);
        renderSingleLineBoxV4(singleRangeRendArg);
        if (isMid) {
            currLineZero = lastLineOfMiddles;
        }

        // }
    }
};
