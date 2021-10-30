import * as vscode from "vscode";
import {
    glo,
    IEditorInfo,
    TyInLineInDepthInQueueInfo,
    TyDepthDecInfo,
} from "./extension";
import { renderSingleLineBox } from "./renderLineTool";
import { renderSingleLineBox_old } from "./renderLineToolOld";
import { IBlockRender } from "./utils";
import { notYetDisposedDecsObject } from "./utils2";

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
        };

        // renderSingleLineBox_old(singleRangeRendArg); // old renderer function
        renderSingleLineBox(singleRangeRendArg); // new renderer function

        // }
    }
};
