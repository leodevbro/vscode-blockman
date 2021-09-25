import { window } from "vscode";
import * as vscode from "vscode";
import {
    glo,
    IEditorInfo,
    IInLineInDepthDecorsRefs,
    infosOfcontrolledEditors,
    TyInLineInDepthInQueueInfo,
    TyOneFileEditorDecInfo,
    updateAllControlledEditors,
} from "./extension";
import { getFullFileStats, renderLevels, tabsIntoSpaces } from "./utils";
import { doubleWidthCharsReg } from "./helpers/regex-main";

export const calculateColumnFromCharIndex = (
    lineText: string,
    charIndex: number,
    tabSize: number,
): number => {
    let spacing = 0;
    for (let index = 0; index < charIndex; index++) {
        if (lineText.charAt(index) === "\t") {
            spacing += tabSize - (spacing % tabSize);
        } else {
            spacing++;
        }
    }
    return spacing;
};

export const calculateCharIndexFromColumn = (
    lineText: string,
    column: number,
    tabSize: number,
): number => {
    let spacing = 0;
    for (let index = 0; index <= column; index++) {
        if (spacing >= column) {
            return index;
        }
        if (lineText.charAt(index) === "\t") {
            spacing += tabSize - (spacing % tabSize);
        } else {
            spacing++;
        }
    }
    return spacing;
};

export const notYetDisposedDecsObject: {
    decs: { dRef: vscode.TextEditorDecorationType; lineZero: number }[];
    sameFirstElementCounter: number;
    firstDRef: vscode.TextEditorDecorationType | undefined;
} = {
    decs: [],
    sameFirstElementCounter: 0,
    firstDRef: undefined,
};

export const nukeAllDecs = () => {
    // console.log("all nuke eeeeeeeeeeeeeeeeeeeeeeeee");
    notYetDisposedDecsObject.decs.map((dec) => {
        dec.dRef.dispose();
    });

    notYetDisposedDecsObject.decs.length = 0;
    notYetDisposedDecsObject.decs = [];
    notYetDisposedDecsObject.sameFirstElementCounter = 0;
    notYetDisposedDecsObject.firstDRef = undefined;
};

export let junkDecors3dArr: TyOneFileEditorDecInfo[] = []; // structure for optimization, not for decor history

export const nukeJunkDecorations = () => {
    junkDecors3dArr.map((fileDecors) => {
        if (fileDecors) {
            fileDecors.map((lineDecors) => {
                if (lineDecors) {
                    lineDecors.map((depthDecors) => {
                        if (depthDecors) {
                            depthDecors.map((inLineInDepthInQueueInfo) => {
                                if (inLineInDepthInQueueInfo) {
                                    for (const key in inLineInDepthInQueueInfo.decorsRefs) {
                                        const decorRef =
                                            inLineInDepthInQueueInfo.decorsRefs[
                                                key as keyof IInLineInDepthDecorsRefs
                                            ];
                                        if (decorRef && decorRef !== "f") {
                                            decorRef.dispose();

                                            // for memory leak prevention
                                            notYetDisposedDecsObject.decs =
                                                notYetDisposedDecsObject.decs.filter(
                                                    (dec) =>
                                                        dec.dRef !== decorRef,
                                                );
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    junkDecors3dArr.length = 0;
    junkDecors3dArr = [];

    // OPTIMIZATION took very seriously:
    if (notYetDisposedDecsObject.decs.length >= 1) {
        if (
            notYetDisposedDecsObject.firstDRef ===
            notYetDisposedDecsObject.decs[0].dRef
        ) {
            notYetDisposedDecsObject.sameFirstElementCounter += 1;
        } else {
            notYetDisposedDecsObject.sameFirstElementCounter = 0;
            notYetDisposedDecsObject.firstDRef =
                notYetDisposedDecsObject.decs[0].dRef;
        }

        if (notYetDisposedDecsObject.sameFirstElementCounter > 100) {
            nukeAllDecs();
            updateAllControlledEditors({ alsoStillVisible: true });
        }
    }
};

interface IColorDecoratorItem {
    range: {
        start: {
            line: number;
            character: number;
        };
    };
}

export const colorDecorsToSpacesForFile = (
    txt: string,
    editorInfo: IEditorInfo,
) => {
    const cDArr = editorInfo.colorDecoratorsArr;
    if (cDArr.length === 0) {
        return txt;
    }

    let textWithColorDecorSpaces = "";
    let currSplitterIndex = 0;
    // const cDAlt = glo.trySupportDoubleWidthChars ? "   " : "  ";
    const cDAlt = "  ";
    for (let i = 0; i < cDArr.length; i += 1) {
        const currSP = cDArr[i];
        const g = currSP.cDGlobalIndexZeroInMonoText;
        textWithColorDecorSpaces += txt.slice(currSplitterIndex, g) + cDAlt;
        currSplitterIndex = g;
    }
    textWithColorDecorSpaces += txt.slice(currSplitterIndex, txt.length);

    return textWithColorDecorSpaces;
};

export const getLastColIndexForLineWithColorDecSpaces = (
    lineTxt: string,
    editorInfo: IEditorInfo,
    lineIndex: number,
    currLastColIndex: number,
) => {
    // return lineTxt;
    let withPlusOne = currLastColIndex + 1;

    const cDArr = editorInfo.colorDecoratorsArr;

    const filteredArr = cDArr.filter((x) => x.cDLineZero === lineIndex);
    if (filteredArr.length === 0) {
        return currLastColIndex;
    }
    const sortedArr = filteredArr.sort(
        (a, b) => a.cDGlobalIndexZeroInMonoText - b.cDGlobalIndexZeroInMonoText,
    );

    const myCount = sortedArr.filter(
        (x) => x.cDCharZeroInMonoText <= withPlusOne,
    ).length;

    // for (let i = 0; i < sortedArr.length; i += 1) {
    //     const currSP = sortedArr[i];
    //     const col = currSP.cDCharZeroInMonoText;
    // }

    return withPlusOne + myCount * 2 - 1;
};

export const selectFocusedBlock = () => {
    const thisEditor = window.activeTextEditor;
    if (thisEditor) {
        const thisEditorInfo = infosOfcontrolledEditors.find(
            (x) => x.editorRef === thisEditor,
        );
        if (thisEditorInfo) {
            const focus = thisEditorInfo.focusDuo.curr;
            if (focus) {
                const fDepth = focus.depth;
                const fIndexInDepth = focus.indexInTheDepth;

                const renderingInfoForFullFile =
                    thisEditorInfo.renderingInfoForFullFile;
                if (fDepth >= 1 && renderingInfoForFullFile) {
                    const masterLevels = renderingInfoForFullFile.masterLevels;
                    const allit = renderingInfoForFullFile.allit;
                    const theBlock = masterLevels[fDepth - 1][fIndexInDepth];

                    const rangeStart = allit[theBlock.s];
                    const rangeEnd = allit[theBlock.e];

                    const monoLineOfStart = thisEditorInfo.monoText.slice(
                        thisEditorInfo.textLinesMap[rangeStart.lineZero],
                        thisEditorInfo.textLinesMap[rangeStart.lineZero + 1],
                    );

                    const monoLineOfEnd = thisEditorInfo.monoText.slice(
                        thisEditorInfo.textLinesMap[rangeEnd.lineZero],
                        thisEditorInfo.textLinesMap[rangeEnd.lineZero + 1],
                    );

                    vscode.commands
                        .executeCommand(
                            "vscode.executeDocumentColorProvider",
                            thisEditorInfo.editorRef.document.uri,
                        )
                        .then((dataArr) => {
                            // item.range.start.line,
                            // item.range.start.character,
                            let colorPosArr: IColorDecoratorItem[] = [];
                            const arr = dataArr as
                                | IColorDecoratorItem[]
                                | undefined;
                            if (arr && arr.length >= 1) {
                                colorPosArr = arr.filter((x) => {
                                    return [
                                        rangeStart.lineZero,
                                        rangeEnd.lineZero,
                                    ].includes(x.range.start.line);
                                });
                                colorPosArr.sort(
                                    (a, b) =>
                                        a.range.start.line - b.range.start.line,
                                );
                            }

                            const sArray = colorPosArr.filter(
                                (x) =>
                                    x.range.start.line === rangeStart.lineZero,
                            );
                            const eArray = colorPosArr.filter(
                                (x) => x.range.start.line === rangeEnd.lineZero,
                            );

                            let countS = 0;
                            let countE = 0;

                            sArray.map((x) => {
                                if (
                                    x.range.start.character <
                                    rangeStart.inLineIndexZero
                                ) {
                                    countS += 1;
                                }
                            });
                            eArray.map((x) => {
                                if (
                                    x.range.start.character <
                                    rangeEnd.inLineIndexZero
                                ) {
                                    countE += 1;
                                }
                            });

                            const monoInLineIndexZeroOfStart =
                                rangeStart.inLineIndexZero + 1 - 2 * countS;
                            const monoInLineIndexZeroOfEnd =
                                rangeEnd.inLineIndexZero - 2 * countE;

                            const currDoc = thisEditorInfo.editorRef.document;

                            const docLineOfStart = currDoc.lineAt(
                                rangeStart.lineZero,
                            ).text;
                            const docLineOfEnd = currDoc.lineAt(
                                rangeEnd.lineZero,
                            ).text;

                            let tabSize =
                                thisEditorInfo.editorRef.options.tabSize;
                            if (typeof tabSize !== "number") {
                                tabSize = 4;
                            }

                            const docInLineCharZeroOfStart =
                                calculateCharIndexFromColumn(
                                    docLineOfStart,
                                    monoInLineIndexZeroOfStart,
                                    tabSize,
                                );

                            const docInLineCharZeroOfEnd =
                                calculateCharIndexFromColumn(
                                    docLineOfEnd,
                                    monoInLineIndexZeroOfEnd,
                                    tabSize,
                                );

                            const rangeAsArray: [
                                number,
                                number,
                                number,
                                number,
                            ] = [
                                rangeStart.lineZero,
                                docInLineCharZeroOfStart,
                                rangeEnd.lineZero,
                                docInLineCharZeroOfEnd,
                            ];

                            thisEditor.selection = new vscode.Selection(
                                ...rangeAsArray,
                            );
                        });
                }
            }
        }
    }
};

export const updateFocusInfo = (editorInfo: IEditorInfo) => {
    if (editorInfo.focusDuo.currIsFreezed) {
        return;
    }
    const thisEditorInfo = editorInfo;
    const thisEditor = editorInfo.editorRef;

    const textLinesMap = thisEditorInfo.textLinesMap;
    const cursorPos = thisEditor.selection.active;

    const focusedLineZeroInDoc = cursorPos.line;
    const focusedColumnZeroInDoc = cursorPos.character - 1;
    // console.log("focusedLineZeroInDoc:", focusedLineZeroInDoc);
    // console.log("focusedColumnZeroInDoc:", focusedColumnZeroInDoc);
    // thisEditor.document.lineAt(cursorPos).range.end.character;

    let globalIndexZero = -1;

    // if (focusedColumnZeroInDoc === -1) {
    // if (false) {
    //     globalIndexZero = textLinesMap[focusedLineZeroInDoc] - 1 + 1;
    // } else {
    const lineTextInDocBeforeColumn = thisEditor.document
        .lineAt(cursorPos)
        .text.slice(0, focusedColumnZeroInDoc + 1);

    let lineMonoTextBeforeColumn = tabsIntoSpaces(
        lineTextInDocBeforeColumn,
        (thisEditor.options.tabSize as number) || 4,
    );

    if (glo.trySupportDoubleWidthChars) {
        lineMonoTextBeforeColumn = lineMonoTextBeforeColumn.replace(
            doubleWidthCharsReg,
            "Z_",
        );
    }

    // let tabSize = 4; // default
    // const fetchedTabSize = editorInfo.editorRef.options.tabSize;

    // if (fetchedTabSize && typeof fetchedTabSize === "number") {
    //     tabSize = fetchedTabSize;
    // }

    let lastColIndex = lineMonoTextBeforeColumn.length - 1;

    if (
        glo.colorDecoratorsInStyles &&
        editorInfo.colorDecoratorsArr.length >= 1
    ) {
        lastColIndex = getLastColIndexForLineWithColorDecSpaces(
            lineMonoTextBeforeColumn,
            editorInfo,
            focusedLineZeroInDoc,
            lastColIndex,
        );
    }

    globalIndexZero = textLinesMap[focusedLineZeroInDoc] + lastColIndex;
    // }

    // gvaqvs globalIndexZero

    let candidate: {
        globalLength: number;
        depthMOeee: number;
        blockInd: number;
    } = { globalLength: 9999999999, depthMOeee: -1, blockInd: 0 };

    const depths = thisEditorInfo.renderingInfoForFullFile?.masterLevels;
    const allit = thisEditorInfo.renderingInfoForFullFile?.allit;
    if (depths && allit) {
        // let zz_sGlobal: number = -7;
        // let zz_eGlobal: number = -7;
        // depthMOeee -> depth Minus One ->> eee

        // let breakDepthloop = false;
        for (let depthMOeee = 0; depthMOeee < depths.length; depthMOeee += 1) {
            for (
                let blockInd = 0;
                blockInd < depths[depthMOeee].length;
                blockInd += 1
            ) {
                const thisBlock = depths[depthMOeee][blockInd];

                const sGlobal = allit[thisBlock.s].globalIndexZero;
                const eGlobal = allit[thisBlock.e].globalIndexZero;
                if (
                    sGlobal <= globalIndexZero &&
                    eGlobal > globalIndexZero &&
                    eGlobal - sGlobal < candidate.globalLength
                ) {
                    candidate = {
                        blockInd,
                        depthMOeee: depthMOeee,
                        globalLength: eGlobal - sGlobal,
                    };

                    // zz_sGlobal = sGlobal;
                    // zz_eGlobal = eGlobal;
                }
            }
        }

        // thisEditorInfo.focusedBlock = {
        //     depth: candidate.depthMOeee,
        //     index: candidate.blockInd,
        // };

        const fDuo = thisEditorInfo.focusDuo;

        if (fDuo.curr) {
            fDuo.prev = {
                depth: fDuo.curr.depth,
                indexInTheDepth: fDuo.curr.indexInTheDepth,
            };
        } else {
            fDuo.prev = null;
        }

        fDuo.curr = {
            depth: candidate.depthMOeee + 1,
            indexInTheDepth: candidate.blockInd,
        };

        // console.log("currrrrrrrr", editorInfo.focusDuo.curr);
    }
};

export interface IUpdateRender {
    editorInfo: IEditorInfo;
    timer: number; // milliseconds
    caller?: "scroll" | "focus" | "edit";
}

export const updateRender = ({ editorInfo, timer, caller }: IUpdateRender) => {
    if (
        !glo.isOn ||
        glo.blackListOfFileFormats.includes(
            editorInfo.editorRef.document.languageId,
        )
    ) {
        if (editorInfo.decors.length > 0) {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;

            junkDecors3dArr.push(editorInfo.decors);
            nukeJunkDecorations();
            editorInfo.decors = [];
            editorInfo.needToAnalyzeFile = true;
        }

        return;
    }
    clearTimeout(editorInfo.timerForDo);
    // if (editorInfo.needToAnalyzeFile) {
    //     timer = glo.renderTimerForChange;
    // }
    editorInfo.timerForDo = setTimeout(async () => {
        // console.log("<new cycle>");
        if (glo.maxDepth <= -2) {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;

            junkDecors3dArr.push(editorInfo.decors);
            nukeJunkDecorations();
            editorInfo.decors = [];
            editorInfo.needToAnalyzeFile = true;
            return;
        }

        const visRanges = editorInfo.editorRef.visibleRanges;
        const firstVisLine = visRanges[0].start.line;
        const lastVisLine = visRanges[visRanges.length - 1].end.line;

        const firstLineZeroOfRender =
            firstVisLine - glo.renderIncBeforeAfterVisRange;
        const lastLineZeroOfRender =
            lastVisLine + glo.renderIncBeforeAfterVisRange;

        const doc = editorInfo.editorRef.document;

        if (
            !editorInfo.needToAnalyzeFile &&
            editorInfo.renderingInfoForFullFile
        ) {
            if (caller === "scroll") {
                const junkLines = editorInfo.decors.filter(
                    (line, lineIndex) =>
                        lineIndex < firstLineZeroOfRender ||
                        lineIndex > lastLineZeroOfRender,
                );
                junkDecors3dArr.push(junkLines);

                let firstLegitDecorFound = false;
                let lastLegitDecorIndex = -1;
                editorInfo.decors = editorInfo.decors.map((line, lineIndex) => {
                    if (
                        lineIndex >= firstLineZeroOfRender &&
                        lineIndex <= lastLineZeroOfRender &&
                        line
                    ) {
                        if (!firstLegitDecorFound) {
                            firstLegitDecorFound = true;
                            editorInfo.upToDateLines.upEdge = lineIndex;
                        }
                        lastLegitDecorIndex = lineIndex;
                        return line;
                    } else {
                        return undefined;
                    }
                });
                editorInfo.upToDateLines.lowEdge = lastLegitDecorIndex;
                // console.log(
                //     "editorInfo.upToDateLines",
                //     editorInfo.upToDateLines,
                // );

                // updateFocusInfo(editorInfo); // focus remains the same when scrolling
                renderLevels(
                    editorInfo,
                    firstLineZeroOfRender,
                    lastLineZeroOfRender,
                );
            } else {
                // so if not scroll, then maybe it's focus event, because doc text did not change
                // console.log("maybe fokusiaaaaaaaaaaaaaa");
                editorInfo.upToDateLines.upEdge = -1;
                editorInfo.upToDateLines.lowEdge = -1;

                updateFocusInfo(editorInfo);
                const fDuo = editorInfo.focusDuo;

                const fPrev = fDuo.prev;
                const fCurr = fDuo.curr;

                if (fCurr === fPrev) {
                    return; // don't junk or render any decor
                } else if (fCurr && fPrev) {
                    if (
                        fCurr.depth === fPrev.depth &&
                        fCurr.indexInTheDepth === fPrev.indexInTheDepth
                    ) {
                        return; // don't junk or render any decor
                    }
                }

                let junkDecors: TyInLineInDepthInQueueInfo[] = [];

                for (
                    let lineIndex = 0;
                    lineIndex < editorInfo.decors.length;
                    lineIndex += 1
                ) {
                    const lineInfo = editorInfo.decors[lineIndex];
                    if (lineInfo) {
                        for (
                            let depthIndex = 0;
                            depthIndex < lineInfo.length;
                            depthIndex += 1
                        ) {
                            const inLineInDepthInfo = lineInfo[depthIndex];

                            if (inLineInDepthInfo) {
                                // console.log(
                                //     "lineIndexOne depthIndex and bi:",
                                //     lineIndex + 1,
                                //     inLineInDepthInfo.depthIndex,
                                //     inLineInDepthInfo.inDepthBlockIndex,
                                // );

                                for (
                                    let queueIndex = 0;
                                    queueIndex < inLineInDepthInfo.length;
                                    queueIndex += 1
                                ) {
                                    const queueInfo =
                                        inLineInDepthInfo[queueIndex];

                                    if (queueInfo) {
                                        let isFPrev = false;
                                        let isFCurr = false;
                                        let entireFileFocus = false;

                                        if (fPrev) {
                                            if (
                                                queueInfo.depthIndex ===
                                                    fPrev.depth &&
                                                queueInfo.inDepthBlockIndex ===
                                                    fPrev.indexInTheDepth
                                            ) {
                                                isFPrev = true;
                                                if (queueInfo.depthIndex > 0) {
                                                    junkDecors.push(queueInfo);
                                                    editorInfo.decors[
                                                        lineIndex
                                                    ]![depthIndex][queueIndex] =
                                                        undefined;
                                                    // editorInfo.decors[
                                                    //     lineIndex
                                                    // ]![depthIndex].splice(
                                                    //     queueIndex,
                                                    //     1,
                                                    // );
                                                } else {
                                                    entireFileFocus = true;
                                                }
                                                // console.log(
                                                //     "-------junk inLineInDepthInfo prev",
                                                //     inLineInDepthInfo,
                                                // );
                                            }
                                        }
                                        if (fCurr) {
                                            if (
                                                queueInfo.depthIndex ===
                                                    fCurr.depth &&
                                                queueInfo.inDepthBlockIndex ===
                                                    fCurr.indexInTheDepth
                                            ) {
                                                isFCurr = true;
                                                if (queueInfo.depthIndex > 0) {
                                                    junkDecors.push(queueInfo);
                                                    editorInfo.decors[
                                                        lineIndex
                                                    ]![depthIndex][queueIndex] =
                                                        undefined;
                                                    // editorInfo.decors[
                                                    //     lineIndex
                                                    // ]![depthIndex].splice(
                                                    //     queueIndex,
                                                    //     1,
                                                    // );
                                                } else {
                                                    entireFileFocus = true;
                                                }

                                                // console.log(
                                                //     "-------junk inLineInDepthInfo curr",
                                                //     inLineInDepthInfo,
                                                // );
                                            }
                                        }

                                        if (
                                            !entireFileFocus &&
                                            (isFPrev || isFCurr)
                                        ) {
                                            //
                                        } else {
                                            //
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // junkDecors.map((inLineInDepthInfo) => {
                //     console.log(
                //         "junk lineOne, depth, bi:",
                //         inLineInDepthInfo.lineZero + 1,
                //         inLineInDepthInfo.depthIndex,
                //         inLineInDepthInfo.inDepthBlockIndex,
                //     );
                // });

                if (junkDecors3dArr.length === 0) {
                    junkDecors3dArr.push([]);
                }
                if (junkDecors3dArr[0]) {
                    if (junkDecors3dArr[0].length === 0) {
                        junkDecors3dArr[0].push([]);
                    }
                } else {
                    junkDecors3dArr[0] = [[]];
                }

                junkDecors3dArr[0][0]!.push(junkDecors);

                // junkDecors3dArr.push(editorInfo.decors); //
                // editorInfo.decors = []; //

                renderLevels(
                    editorInfo,
                    firstLineZeroOfRender,
                    lastLineZeroOfRender,
                    "focus",
                );
            }

            // TODO: check firstLineZeroOfRender and lastLineZeroOfRender // or maybe not
        } else {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;

            junkDecors3dArr.push(editorInfo.decors);
            editorInfo.decors = [];

            editorInfo.renderingInfoForFullFile = await getFullFileStats({
                editorInfo,
            });

            if (editorInfo.renderingInfoForFullFile) {
                editorInfo.needToAnalyzeFile = false;
                updateFocusInfo(editorInfo);
                renderLevels(
                    editorInfo,
                    firstLineZeroOfRender,
                    lastLineZeroOfRender,
                );
            }
        }
        nukeJunkDecorations();
    }, timer); // ms // 250
};
