import { ExtensionContext, window, workspace } from "vscode";
import * as vscode from "vscode";

import {
    IFullRender,
    renderLevels,
    getFullFileStats,
    tabsIntoSpaces,
    findLineZeroAndInLineIndexZero,
} from "./utils";
import DocumentDecorationManager from "./bracketAlgos/documentDecorationManager";
import EventEmitter = require("events");
import { glob } from "glob";

import { applyAllBlockmanSettings } from "./settingsManager";
import { colorCombos } from "./colors";

export let bracketManager: DocumentDecorationManager | undefined | null;

const classicDark1Combo = colorCombos.find(
    (x) => x.name === "Classic Dark 1 (Gradients)",
)!;

const bigVars = {
    currColorCombo: classicDark1Combo,
};

export const glo = {
    eachCharFrameHeight: 12.0, // px
    eachCharFrameWidth: 4.321, // px,

    maxDepth: 9, // (as minus one) -2 -> no blocks, -1 -> ground block, 0 -> first depth blocks, and so on...

    enableFocus: true,

    renderIncBeforeAfterVisRange: 22, // 2-3 is good
    renderTimerForChange: 1200,
    renderTimerForFocus: 200,
    renderTimerForScroll: 100,

    analyzeCurlyBrackets: true,
    analyzeSquareBrackets: false,
    analyzeRoundBrackets: false,
    analyzeTags: true,
    analyzeIndentDedentTokens: true,

    renderInSingleLineAreas: false,

    borderSize: 1,
    borderRadius: 4,

    coloring: {
        onEachDepth: bigVars.currColorCombo.onEachDepth,

        border: bigVars.currColorCombo.border,
        borderOfDepth0: bigVars.currColorCombo.borderOfDepth0,

        focusedBlock: bigVars.currColorCombo.focusedBlock,
        borderOfFocusedBlock: bigVars.currColorCombo.borderOfFocusedBlock,
    },

    colorDecoratorsInStyles: true,
};

// extention-wide GLOBALS _start_

export const oneCharNonLineBreakingWhiteSpaces = [" "];
export const oneCharLineBreaks = ["\n"];

export const allWhiteSpace = [
    ...oneCharNonLineBreakingWhiteSpaces,
    ...oneCharLineBreaks,
];

// export let eachCharFrameWidth = 10.8035; // px
// export let eachCharFrameHeight = 24.0; // px

// export let currMaxDepth = 4; // -1 -> no blocks, 0 -> entire file block, 1 -> first depth blocks, and so on...

// export let renderIncBeforeAfterVisRange = 7;

interface IFocusBlock {
    depth: number;
    indexInTheDepth: number;
}

export interface IInLineInDepthDecorsRefs {
    mainBody: vscode.TextEditorDecorationType | null;
    leftLineOfOpening: vscode.TextEditorDecorationType | "f" | null; // f -> explicit false, not exist
    rightLineOfClosing: vscode.TextEditorDecorationType | "f" | null; // f -> explicit false, not exist
}

// maybe the queue not in order
export type TyInLineInDepthInQueueInfo =
    | {
          // queue and blockIndex related, you know...
          lineZero: number;
          depthIndex: number;
          // sameLineQueueIndex: number;
          inDepthBlockIndex: number;
          decorsRefs: IInLineInDepthDecorsRefs;
      }
    | undefined;

export type TyDepthDecInfo = TyInLineInDepthInQueueInfo[];

export type TyLineDecInfo = TyDepthDecInfo[] | undefined;

export type TyOneFileEditorDecInfo = TyLineDecInfo[];

export interface IEditorInfo {
    editorRef: vscode.TextEditor;
    needToAnalyzeFile: boolean;
    textLinesMap: number[];
    decors: TyOneFileEditorDecInfo; // by depth !!!!!!!!!!!
    upToDateLines: {
        upEdge: number;
        lowEdge: number;
    };
    focusDuo: {
        curr: IFocusBlock | null;
        prev: IFocusBlock | null;
    };
    timerForDo: any;
    renderingInfoForFullFile: IFullRender | undefined;
    // focusedBlock: { depth: number; index: number } | null;
    monoText: string;
}

// export const maxNumberOfControlledEditors = 5;
export let infosOfcontrolledEditors: IEditorInfo[] = [];

// export const trimHistoryOfEditors = () => {
//     const currLength = infosOfcontrolledEditors.length;
//     const infosOfJunkEditors = infosOfcontrolledEditors.slice(
//         0,
//         currLength - maxNumberOfControlledEditors,
//     );
//     infosOfcontrolledEditors = infosOfcontrolledEditors.slice(
//         currLength - maxNumberOfControlledEditors,
//     );

//     // infosOfJunkEditors.map();
// };

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

// extention-wide GLOBALS _end_

export const dropTextLinesMapForEditor = (editor: vscode.TextEditor) => {
    for (
        let edInfoIndex = 0;
        edInfoIndex < infosOfcontrolledEditors.length;
        edInfoIndex += 1
    ) {
        const currEdInfo = infosOfcontrolledEditors[edInfoIndex];
        if (currEdInfo.editorRef === editor) {
            currEdInfo.textLinesMap = [];
            break;
        }
    }
};

export interface IUpdateRender {
    editorInfo: IEditorInfo;
    timer: number; // milliseconds
    caller?: "scroll" | "focus" | "edit";
}

export const updateRender = ({ editorInfo, timer, caller }: IUpdateRender) => {
    clearTimeout(editorInfo.timerForDo);
    // if (editorInfo.needToAnalyzeFile) {
    //     timer = glo.renderTimerForChange;
    // }
    editorInfo.timerForDo = setTimeout(() => {
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

            editorInfo.renderingInfoForFullFile = getFullFileStats({
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

export const updateAllControlledEditors = ({
    alsoStillVisible,
}: {
    alsoStillVisible?: boolean;
}) => {
    const visibleEditors = vscode.window.visibleTextEditors;

    const infosOfStillVisibleEditors = infosOfcontrolledEditors.filter(
        (edInfo) => visibleEditors.includes(edInfo.editorRef),
    );

    // nukeJunkDecorations();
    if (infosOfStillVisibleEditors.length === 0) {
        nukeJunkDecorations();
        nukeAllDecs();
    }

    const stillVisibleEditors = infosOfStillVisibleEditors.map(
        (edInfo) => edInfo.editorRef,
    );

    const newEditors = visibleEditors.filter(
        (editor) => !stillVisibleEditors.includes(editor),
    );

    const infosOfNewEditors: IEditorInfo[] = [];

    newEditors.map((editor) => {
        infosOfNewEditors.push({
            editorRef: editor,
            needToAnalyzeFile: true,
            textLinesMap: [],
            decors: [],
            upToDateLines: {
                upEdge: -1,
                lowEdge: -1,
            },
            focusDuo: {
                curr: null,
                prev: null,
            },
            timerForDo: null,
            renderingInfoForFullFile: undefined,
            // focusedBlock: null,
            monoText: "",
        });
    });

    let infosOfDisposedEditors = infosOfcontrolledEditors.filter(
        (edInfo) => !stillVisibleEditors.includes(edInfo.editorRef),
    );

    infosOfDisposedEditors.map((edInfo) => {
        junkDecors3dArr.push(edInfo.decors);
    });

    const finalArrOfInfos = [
        ...infosOfStillVisibleEditors,
        ...infosOfNewEditors,
    ];

    infosOfcontrolledEditors = finalArrOfInfos;

    infosOfNewEditors.map((editorInfo: IEditorInfo) => {
        updateRender({ editorInfo, timer: glo.renderTimerForChange });
    });

    if (alsoStillVisible) {
        // infosOfStillVisibleEditors.map((edInfo) => {
        //     junkDecors3dArr.push(edInfo.decors);
        // });

        infosOfStillVisibleEditors.map((editorInfo: IEditorInfo) => {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;
            editorInfo.needToAnalyzeFile = true;
            updateRender({ editorInfo, timer: glo.renderTimerForChange });
        });
    }
};

export const updateControlledEditorsForOneDoc = ({
    editor,
    doc,
    mode,
}: {
    editor?: vscode.TextEditor;
    doc?: vscode.TextDocument;
    mode?: string;
}) => {
    let thisTimer = glo.renderTimerForChange;

    let caller: undefined | "scroll" | "focus" | "edit" = undefined;
    if (mode === "scroll") {
        thisTimer = glo.renderTimerForScroll;
        caller = "scroll";
    }

    let thisDoc: vscode.TextDocument | undefined;
    if (doc) {
        thisDoc = doc;
    } else if (editor) {
        thisDoc = editor.document;
    } else {
        console.log("both -> doc and editor are falsy");
        return;
    }

    infosOfcontrolledEditors.map((editorInfo: IEditorInfo) => {
        if (
            (thisDoc as vscode.TextDocument) === editorInfo.editorRef.document
        ) {
            // editorInfo.needToAnalyzeFile = true;
            if (mode === "scroll" && editorInfo.needToAnalyzeFile) {
                // continue
            } else {
                updateRender({ editorInfo, timer: thisTimer, caller });
            }
        }
    });
};

export const updateFocusInfo = (editorInfo: IEditorInfo) => {
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

    const lineMonoTextBeforeColumn = tabsIntoSpaces(
        lineTextInDocBeforeColumn,
        (thisEditor.options.tabSize as number) || 4,
    );

    globalIndexZero =
        textLinesMap[focusedLineZeroInDoc] +
        lineMonoTextBeforeColumn.length -
        1;
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

let focusTimout: any;
export const updateFocus = (editorInfo?: IEditorInfo) => {
    clearTimeout(focusTimout);
    focusTimout = setTimeout(() => {
        const thisEditor = editorInfo?.editorRef || window.activeTextEditor;

        if (thisEditor) {
            const thisEditorInfo =
                editorInfo ||
                infosOfcontrolledEditors.find(
                    (x) => x.editorRef === thisEditor,
                );
            if (thisEditorInfo) {
                if (thisEditorInfo.needToAnalyzeFile) {
                    return;
                }

                // updateFocusInfo(thisEditorInfo);
                updateRender({
                    editorInfo: thisEditorInfo,
                    timer: 0,
                });
            }
        }

        // boloshi clean junk focusBlocks
    }, glo.renderTimerForFocus);
};
/*
exports.activate = function (context: any) {
    const lineDecoration = vscode.window.createTextEditorDecorationType({
        before: {
            contentText: "before1",
            backgroundColor: "red",
            textDecoration: `;box-sizing: content-box !important;
                              border-radius: 8px;

                              width: 50px;
                              height: 50px;
                              position: absolute;
                              z-index: -100;
                              top: 0px;
                              left: 0px;
                              position: absolute;
                              `,
        },
    });
    const lineDecoration2 = vscode.window.createTextEditorDecorationType({
        before: {
            contentText: "before2",
            backgroundColor: "blue",
            textDecoration: `;box-sizing: content-box !important;
                              border-radius: 8px;

                              width: 50px;
                              height: 50px;
                              position: absolute;
                              z-index: -100;
                              top: 0px;
                              left: 70px;
                              position: absolute;
                              `,
        },
    });
    const lineDecoration3 = vscode.window.createTextEditorDecorationType({
        before: {
            contentText: "before3",
            backgroundColor: "yellow",
            textDecoration: `;box-sizing: content-box !important;
                              border-radius: 8px;

                              width: 200px;
                              height: 50px;
                              position: absolute;
                              z-index: -100;
                              top: 0px;
                              left: 300px;
                              position: absolute;
                              `,
        },
    });
    const currVsRange = new vscode.Range(0, 0, 0, 0);
    setTimeout(() => {
        const editor = vscode!.window!.activeTextEditor!;
        editor.setDecorations(lineDecoration, [currVsRange]);
        editor.setDecorations(lineDecoration2, [currVsRange]);
        editor.setDecorations(lineDecoration3, [currVsRange]);
    }, 3000);
};
*/

const setColorDecoratorsBool = () => {
    const vsConfigOfEditors = vscode.workspace.getConfiguration("editor");

    const colorDecoratorsBool: boolean | undefined =
        vsConfigOfEditors.get("colorDecorators");

    // console.log(vsConfigOfEditors, colorDecoratorsBool);

    if (colorDecoratorsBool === true || colorDecoratorsBool === false) {
        glo.colorDecoratorsInStyles = colorDecoratorsBool;
    }
};

const adjustVscodeUserConfig = () => {
    let vscodeColorConfig: any = vscode.workspace
        .getConfiguration("workbench")
        .get("colorCustomizations");

    vscode.workspace.getConfiguration("workbench").update(
        "colorCustomizations",
        {
            ...vscodeColorConfig,
            "editor.lineHighlightBackground": "#1073cf2d",
            "editor.lineHighlightBorder": "#9fced11f",
        },
        1,
    );

    vscode.workspace.getConfiguration().update("editor.wordWrap", "off", 1);
    vscode.workspace.getConfiguration().update("diffEditor.wordWrap", "off", 1);

    let vscodeMarkdownConfig: any = vscode.workspace
        .getConfiguration()
        .get("[markdown]");

    // console.log("markdownConfig", markdownConfig);

    vscode.workspace.getConfiguration().update(
        "[markdown]",
        {
            ...vscodeMarkdownConfig,
            "editor.wordWrap": "off",
        },
        1,
    );

    vscode.workspace
        .getConfiguration()
        .update("editor.renderIndentGuides", false, 1);
    vscode.workspace
        .getConfiguration()
        .update("editor.highlightActiveIndentGuide", false, 1);
};

const importantMessage = () => {
    window.showInformationMessage(
        `!!!!! PLEASE READ !!!!! Blockman message: If blocks are weird/strange looking, it's not error/bug, it's fine. The solution is to adjust line height and character width in Blockman settings, so please see the "IMPORTANT" section in the description, there is GIF which shows you how to adjust them.`,
        { modal: true },
    );
};

export function activate(context: ExtensionContext) {
    // adjustVscodeUserConfig();
    setColorDecoratorsBool();
    applyAllBlockmanSettings();

    bracketManager = new DocumentDecorationManager();
    vscode.extensions.onDidChange(() => restart());

    // console.log("all Config:", vscode.workspace.getConfiguration()); // lineHighlightBorder

    // let bbqq = context.globalStorageUri;
    const iicounter = context.globalState.get("iicounter");
    // console.log(iicounter);
    if (iicounter === "1" || iicounter === "2") {
        if (iicounter === "1") {
            importantMessage();
            context.globalState.update("iicounter", "2");
        } else if (iicounter === "2") {
            // do nothing
        }
    } else {
        adjustVscodeUserConfig();
        importantMessage();
        context.globalState.update("iicounter", "1");
    }
    // importantMessage();
    // importantMessage();
    // importantMessage();

    context.subscriptions.push(
        // vscode.commands.registerCommand(
        //     "bracket-pair-colorizer-2.expandBracketSelection",
        //     () => {
        //         const editor = window.activeTextEditor;
        //         if (!editor) {
        //             return;
        //         }
        //         documentDecorationManager.expandBracketSelection(editor);
        //     },
        // ),

        vscode.commands.registerCommand("blockman.helloWorld", () => {
            console.log(
                "Hello, I'm Blockman, a visual helper for software developers.",
            );
        }),

        vscode.commands.registerCommand("blockman.printLeak", () => {
            console.log(notYetDisposedDecsObject.decs);
        }),

        workspace.onDidChangeConfiguration((event) => {
            console.log("settings changed");
            // if (
            //     event.affectsConfiguration("bracket-pair-colorizer-2") ||
            //     event.affectsConfiguration("editor.lineHeight") ||
            //     event.affectsConfiguration("editor.fontSize")
            // ) {
            //     console.log(
            //         "all:",
            //         vscode.workspace
            //             .getConfiguration("editor")
            //             .get("lineHeight"),
            //     ); // lineHighlightBorder
            //     // restart();
            // }

            // if (event.affectsConfiguration("blockman")) { // sometimes cannot catch the change from the scope

            setColorDecoratorsBool();

            applyAllBlockmanSettings();
            // console.log("scrrr:", glo.renderTimerForScroll);

            // updateAllControlledEditors({
            //     alsoUndisposed: true,
            // });
            // }

            updateAllControlledEditors({
                alsoStillVisible: true,
            });
        }),

        window.onDidChangeTextEditorOptions((event) => {
            infosOfcontrolledEditors.map((editorInfo: IEditorInfo) => {
                if (event.textEditor === editorInfo.editorRef) {
                    editorInfo.needToAnalyzeFile = true;
                }
            });
            updateControlledEditorsForOneDoc({ editor: event.textEditor });
        }),

        window.onDidChangeVisibleTextEditors((event) => {
            const visEditors = event;
            updateAllControlledEditors({});
        }),

        workspace.onDidChangeTextDocument((event) => {
            // console.log("araaaa nulze meti");
            // return;
            if (event.contentChanges.length > 0) {
                // console.log("changed text");
                const thisDoc = event.document;

                infosOfcontrolledEditors.map((editorInfo: IEditorInfo) => {
                    if (thisDoc === editorInfo.editorRef.document) {
                        editorInfo.needToAnalyzeFile = true;
                    }
                });
                // console.log("chhhhhhhhhhhh:", glo.renderTimerForChange);
                updateControlledEditorsForOneDoc({ doc: thisDoc });

                // updateFocus();
            }
        }),
        workspace.onDidOpenTextDocument((event) => {
            // documentDecorationManager.onDidOpenTextDocument(event);
            // setTimeout(() => {
            //     let eds = window.visibleTextEditors;
            //     console.log("eds-opennnnnnnn:", eds);
            // }, 2000);
        }),
        window.onDidChangeTextEditorSelection((event) => {
            // return;
            // console.log("foc------>>>>>event.selections::-:", event.selections);
            // console.log("changed selection");
            updateFocus();
        }),
        window.onDidChangeTextEditorVisibleRanges((event) => {
            // console.log("scrooooooooooooooooooooooooooool");
            // return;
            const thisEditor = event.textEditor;
            updateControlledEditorsForOneDoc({
                editor: thisEditor,
                mode: "scroll",
            });
        }),
        window.onDidChangeActiveTextEditor((event) => {
            // needToAnalyzeFile = true;
            // let thisEditor = window.activeTextEditor;
            // if (thisEditor) {
            //     updateRender({ thisEditor });
            // }
        }),

        workspace.onDidCloseTextDocument((event) => {
            if (bracketManager) {
                bracketManager.onDidCloseTextDocument(event);
            }
        }),
    );

    // documentDecorationManager.updateAllDocuments();
    // setTimeout(() => {
    updateAllControlledEditors({});
    // }, 5000);

    function restart() {
        // documentDecorationManager.Dispose();
        // documentDecorationManager = new DocumentDecorationManager();
        // documentDecorationManager.updateAllDocuments();

        bracketManager?.Dispose();
        bracketManager = new DocumentDecorationManager();

        nukeAllDecs();
        nukeJunkDecorations();
        updateAllControlledEditors({ alsoStillVisible: true });
    }
}

// tslint:disable-next-line:no-empty
export function deactivate() {}
