import * as vscode from "vscode";
import { glo, TyInLineInDepthInQueueInfo, TyDepthDecInfo } from "./extension";
import { ISingleLineBox } from "./renderingTools";
import { notYetDisposedDecsObject } from "./utils2";

console.log("ცვლილება 007");
// let kkk = 0;
// new renderer function
export const renderSingleLineBoxV3 = ({
    editorInfo,
    depth,
    inDepthBlockIndex,
    lineBlockType,
    isfirstFromTopToDown,
    isFirstFromBottomToUp,
    lineZero,
    boxHeight,

    boxLeftEdge,
    boxRightEdge,

    optimalLeftOfRangePx,
    optimalRightOfRangePx,

    legitFirstLineZero,
    legitLastLineZero,
    isFocusedBlock,

    firstLineHasVisibleChar,
    lastLineHasVisibleChar,

    firstVisibleChar,
    lastVisibleChar,
}: ISingleLineBox): void => {
    // const doc = editorInfo.editorRef.document;
    const firstLineOfMiddles = firstVisibleChar.lineZero + 2;
    const lastLineOfMiddles = lastVisibleChar.lineZero - 2;

    const isMid =
        lineZero >= firstLineOfMiddles && lineZero <= lastLineOfMiddles;

    // console.log("lineZero:", lineZero);
    const upEdge = editorInfo.upToDateLines.upEdge;
    const lowEdge = editorInfo.upToDateLines.lowEdge;
    if (
        // !isFocusedBlock &&
        upEdge >= 0 &&
        lowEdge >= 1 &&
        upEdge <= lowEdge &&
        lineZero >= upEdge &&
        lineZero <= lowEdge
    ) {
        return;
    }

    if (
        lineBlockType === "onlyLine" &&
        !glo.renderInSingleLineAreas &&
        !isFocusedBlock
    ) {
        return;
    }

    let borderSize = glo.borderSize;
    const borderRadius = glo.borderRadius;

    let borderColorToBeTransparent: string = glo.coloring.border;
    let zIndex = -1000 + depth * 10;

    let borderCss: string;
    let borderRadiusCss: string;
    let top = 0;
    let specificHeight = boxHeight;

    let backgroundCSS: string = "red";

    switch (depth) {
        case 0:
            backgroundCSS = glo.coloring.onEachDepth[0];
            borderColorToBeTransparent = glo.coloring.borderOfDepth0;
            // zIndex = -100 + 10;
            break;

        case 1:
            backgroundCSS = glo.coloring.onEachDepth[1];
            break;
        case 2:
            backgroundCSS = glo.coloring.onEachDepth[2];
            break;
        case 3:
            backgroundCSS = glo.coloring.onEachDepth[3];
            break;
        case 4:
            backgroundCSS = glo.coloring.onEachDepth[4];
            break;
        case 5:
            backgroundCSS = glo.coloring.onEachDepth[5];
            break;

        case 6:
            backgroundCSS = glo.coloring.onEachDepth[6];
            break;
        case 7:
            backgroundCSS = glo.coloring.onEachDepth[7];
            break;
        case 8:
            backgroundCSS = glo.coloring.onEachDepth[8];
            break;
        case 9:
            backgroundCSS = glo.coloring.onEachDepth[9];
            break;
        case 10:
            backgroundCSS = glo.coloring.onEachDepth[10];
            break;

        default:
            backgroundCSS = glo.coloring.onEachDepth[10];
    }

    if (glo.enableFocus && isFocusedBlock) {
        // backgroundCSS = "rgb(21, 5, 64)";
        // backgroundCSS = "rgb(13, 2, 41)";
        // backgroundCSS = "rgb(27, 12, 48)";

        if (!glo.coloring.focusedBlock.includes("same")) {
            backgroundCSS = glo.coloring.focusedBlock;
            // backgroundCSS = "rgba(154, 10, 80, 0)";
        }
        if (!glo.coloring.borderOfFocusedBlock.includes("same")) {
            borderColorToBeTransparent = glo.coloring.borderOfFocusedBlock;
        }

        borderSize = 2;
        // zIndex = -3;
    }

    const borderColorNewVarToSupportGradient = borderColorToBeTransparent;
    borderColorToBeTransparent = "transparent";

    // const boxLeftEdgeFixedShift = boxLeftEdge - borderSize;

    if (lineBlockType === "opening") {
        borderCss = `
            border-left: ${borderSize}px solid ${borderColorToBeTransparent};
            border-top: ${borderSize}px solid ${borderColorToBeTransparent};
            border-right: ${borderSize}px solid ${borderColorToBeTransparent};

            
        `;
        borderRadiusCss = `${borderRadius}px ${borderRadius}px 0px 0px`;
        top += 2 - borderSize;
        specificHeight -= isFirstFromBottomToUp ? 2 : 0;

        if (isFirstFromBottomToUp) {
            if (firstLineHasVisibleChar) {
                // top += 2; // 0
                // specificHeight -= 2; // boxHeight
            } else {
                // top = 0 + 2; // 0
                specificHeight -= 2; // boxHeight
            }
        }

        // specificHeight = isFirstFromBottomToUp
        //     ? boxHeight - generalBorderSize / 2
        //     : undefined;
    } else if (lineBlockType === "middle") {
        borderCss = `
            border-left: ${borderSize}px solid ${borderColorToBeTransparent};
            border-right: ${borderSize}px solid ${borderColorToBeTransparent};


           
        `;
        // top -= isfirstFromTopToDown ? generalBorderSize : 0;
        borderRadiusCss = `0px`;

        // zIndex -= 1;
        if (isfirstFromTopToDown) {
            // return;
            top += 2;
            specificHeight -= 2;
            // backgroundCSS = "red";
        }
        if (isFirstFromBottomToUp) {
            specificHeight -= 2;
        }
    } else if (lineBlockType === "closing") {
        // console.log("isfirstFromTopToDown:", isfirstFromTopToDown);
        borderCss = `
            border-left: ${borderSize}px solid ${borderColorToBeTransparent};
            border-right: ${borderSize}px solid ${borderColorToBeTransparent};
            border-bottom: ${borderSize}px solid ${borderColorToBeTransparent};

            
        `;
        // top += isfirstFromTopToDown ? generalBorderSize : 0;
        // top += 8;
        borderRadiusCss = `0px 0px ${borderRadius}px ${borderRadius}px;`;

        // specificHeight = isfirstFromTopToDown
        //     ? boxHeight - generalBorderSize / 2
        //     : undefined;
        // top -= 1;
        top -= 2;
        // specificHeight -= 2;
        if (isfirstFromTopToDown) {
            if (lastLineHasVisibleChar) {
                top += 2; // 0
                specificHeight -= 2; // boxHeight
            } else {
                top = 0 + 2; // 0
                specificHeight -= 4; // boxHeight
            }
        }
    } else {
        // lineBlockType === "onlyLine"
        borderCss = `
            border-left: ${borderSize}px solid ${borderColorToBeTransparent};
            border-right: ${borderSize}px solid ${borderColorToBeTransparent};
            border-bottom: ${borderSize}px solid ${borderColorToBeTransparent};
            border-top: ${borderSize}px solid ${borderColorToBeTransparent};
        `;
        borderRadiusCss = `${borderRadius}px ${borderRadius}px ${borderRadius}px ${borderRadius}px;`;
        top -= borderSize - 2;
        specificHeight -= 4;
    }

    const singleRange = new vscode.Range(lineZero, 0, lineZero, 0); // column must be ZERO! IMPORTANT! otherwise may be dimmer when text is dimmer
    const arrayOfCurrRanges: vscode.Range[] = [singleRange];

    if (isMid) {
        arrayOfCurrRanges.length = 0;
        for (
            // let lz = firstLineOfMiddles;
            // lz <= lastLineOfMiddles;
            let lz = Math.max(firstLineOfMiddles, legitFirstLineZero);
            lz <= Math.min(lastLineOfMiddles, legitLastLineZero);
            lz += 1
        ) {
            const nextLineRange = new vscode.Range(lz, 0, lz, 0); // column must be ZERO! IMPORTANT! otherwise may be dimmer when text is dimmer
            arrayOfCurrRanges.push(nextLineRange);
        }
    }

    if (lineZero === 0) {
        top += 1;
    }

    // =======================
    const newQueueInfo: TyInLineInDepthInQueueInfo = {
        lineZero,
        depthIndex: depth,
        inDepthBlockIndex,
        decorsRefs: {
            mainBody: null, // temporal. It will not remain as null, it will be decor
            leftLineOfOpening: "f", // may remain as "f", may change
            rightLineOfClosing: "f", // may remain as "f", may change
        },
    };

    const thisLineObjectInitial = editorInfo.decors[
        lineZero
    ] as TyDepthDecInfo[];

    if (!thisLineObjectInitial) {
        editorInfo.decors[lineZero] = [];
    }
    const thisLineObjectNew = editorInfo.decors[lineZero] as TyDepthDecInfo[];

    const thisLineDepthObjectInitial = thisLineObjectNew[depth];
    if (!thisLineDepthObjectInitial) {
        thisLineObjectNew[depth] = [newQueueInfo];
    } else {
        thisLineObjectNew[depth].push(newQueueInfo);
    }

    const thisLineDepthObjectNew = thisLineObjectNew[
        depth
    ] as TyInLineInDepthInQueueInfo[];

    // here the heavy heeeaaaavy job begins:
    // return;

    const isAtVeryLeft = boxLeftEdge === 0;
    const leftInc = isAtVeryLeft ? 2 : 0;
    const backgroundAndBorder =
        "background: " +
        backgroundCSS +
        " padding-box, " +
        borderColorNewVarToSupportGradient +
        "border-box;";

    // kkk += 1;
    // console.log(kkk);
    // return;

    const lineDecoration = vscode.window.createTextEditorDecorationType({
        before: {
            // rangeBehavior: 1,

            contentText: ``,
            textDecoration: `;box-sizing: content-box !important;
                              ${borderCss}
                              
                              border-radius: ${borderRadiusCss};

                              width: calc((${
                                  boxRightEdge - boxLeftEdge
                              } * (1ch + ${
                glo.letterSpacing
            }px)) - ${leftInc}px);
                              height: ${specificHeight}px;
                              position: absolute;
                              z-index: ${zIndex};
                              top: ${top}px;
                              left: calc((${boxLeftEdge} * (1ch + ${
                glo.letterSpacing
            }px)) + ${leftInc - borderSize}px);
                              ${backgroundAndBorder}
                              `,
            // padding: 100px;
        },
    } as vscode.DecorationRenderOptions);

    if (lineBlockType === "opening") {
        // isFirstFromBottomToUp
        let b = -2;

        if (isFirstFromBottomToUp) {
            b += 2;
        }

        const isAtVeryLeft = optimalLeftOfRangePx === 0;
        const leftInc = isAtVeryLeft ? 2 : 0;
        const width = boxLeftEdge - optimalLeftOfRangePx;

        if (width > 0) {
            const leftLineOfOpening =
                vscode.window.createTextEditorDecorationType({
                    before: {
                        // rangeBehavior: 1,
                        contentText: ``,
                        textDecoration: `;box-sizing: content-box !important;
                                      border-bottom: ${borderSize}px solid ${borderColorToBeTransparent};
     
                                      width: calc((${width} * (1ch + ${
                            glo.letterSpacing
                        }px)) - ${leftInc - 1}px);
                                      bottom: ${b}px;
                                      height: ${0}px;
                                      position: absolute;
                                      z-index: ${zIndex + 300};
                                      
                                      left: calc((${optimalLeftOfRangePx} * (1ch + ${
                            glo.letterSpacing
                        }px)) -
                                          ${borderSize - leftInc}px);
                                          ${backgroundAndBorder}
                                      `,
                        // padding: 100px;
                    },
                } as vscode.DecorationRenderOptions);

            // thisLineDepthObjectAfter.decorsRefs.leftLineOfOpening = leftLineOfOpening;

            thisLineDepthObjectNew[
                thisLineDepthObjectNew.length - 1
            ]!.decorsRefs.leftLineOfOpening = leftLineOfOpening;

            // if (lineZero === 103) {
            notYetDisposedDecsObject.decs.push({
                dRef: leftLineOfOpening,
                lineZero,
                // doc,
            });
            editorInfo.editorRef.setDecorations(
                leftLineOfOpening,
                arrayOfCurrRanges,
            );
            // console.log("openingiiiisss - leftLineOfOpening");
            // }
        }
    }

    if (lineBlockType === "closing") {
        let t = -2;
        if (isfirstFromTopToDown) {
            t += 2;
        }

        const isAtVeryLeft = boxRightEdge === 0;
        const leftInc = isAtVeryLeft ? 2 : 0;
        const width = optimalRightOfRangePx - boxRightEdge;

        if (width > 0) {
            const rightLineOfClosing =
                vscode.window.createTextEditorDecorationType({
                    before: {
                        // rangeBehavior: 1,
                        contentText: ``,
                        textDecoration: `;box-sizing: content-box !important;
                                      border-top: ${borderSize}px solid ${borderColorToBeTransparent};
     
                                      width: calc((${
                                          optimalRightOfRangePx - boxRightEdge
                                      } * (1ch + ${glo.letterSpacing}px)) - ${
                            leftInc - borderSize
                        }px);
                                      top: ${t}px;
                                      height: ${0}px;
                                      position: absolute;
                                      z-index: ${zIndex + 300};
                                      
                                      left: calc((${boxRightEdge} * (1ch + ${
                            glo.letterSpacing
                        }px)) + ${leftInc}px);
                        ${backgroundAndBorder}
                                      `,
                        // padding: 100px;
                    },
                } as vscode.DecorationRenderOptions);

            thisLineDepthObjectNew[
                thisLineDepthObjectNew.length - 1
            ]!.decorsRefs.rightLineOfClosing = rightLineOfClosing;

            // if (lineZero === 103) {
            notYetDisposedDecsObject.decs.push({
                dRef: rightLineOfClosing,
                lineZero,
                // doc,
            });
            editorInfo.editorRef.setDecorations(
                rightLineOfClosing,
                arrayOfCurrRanges,
            );
            // console.log("openingiiiisss - rightLineOfClosing");
            // }
        }
    }

    const ldoLen = thisLineDepthObjectNew.length;

    const lineDepthQueue = thisLineDepthObjectNew[ldoLen - 1]!;
    lineDepthQueue.decorsRefs.mainBody = lineDecoration;
    if (isMid) {
        lineDepthQueue.divType = "m";
        lineDepthQueue.midStartLine = firstLineOfMiddles;
        lineDepthQueue.midEndLine = lastLineOfMiddles;
    }

    notYetDisposedDecsObject.decs.push({
        dRef: lineDecoration,
        lineZero,
        // doc,
    });
    editorInfo.editorRef.setDecorations(lineDecoration, arrayOfCurrRanges);
};
