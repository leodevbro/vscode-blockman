import { ExtensionContext, workspace } from "vscode";
import * as vscode from "vscode";

import {
    IFullRender,
    renderLevels,
    getFullFileStats,
    tabsIntoSpaces,
    findLineZeroAndInLineIndexZero,
} from "./utils";
import { doubleWidthCharsReg } from "./helpers/regex-main";
import DocumentDecorationManager from "./bracketAlgos/documentDecorationManager";
import EventEmitter = require("events");

import {
    applyAllBlockmanSettings,
    makeGradientNotation,
} from "./settingsManager";
import { colorCombos } from "./colors";
import {
    getLastColIndexForLineWithColorDecSpaces,
    junkDecors3dArr,
    notYetDisposedDecsObject,
    nukeAllDecs,
    nukeJunkDecorations,
    selectFocusedBlock,
    updateRender,
} from "./utils2";

const iiGlobal = "blockman_data_iicounter";
const iiGlobal2 = "blockman_data_iicounter2";
const iiGlobal3 = "blockman_data_iicounter3";

let isMac = false;
let osChecked = false;

if (!osChecked) {
    try {
        // console.log("start of node os check");
        const os = require("os"); // Comes with node.js
        const myOS: string = os.type().toLowerCase();
        const macCheck = myOS === "darwin";
        if (macCheck === true) {
            isMac = macCheck;
        }
        osChecked = true;
        // console.log("end of node os check");
    } catch (err) {
        console.log(`Maybe error of: require("os")`);
        console.log(err);
    }
}

if (!osChecked) {
    try {
        // console.log("start of web os check");
        // @ts-ignore
        const macCheck =
            // @ts-ignore
            navigator.userAgent.toLowerCase().indexOf("mac") !== -1;
        console.log("macCheck:", macCheck);
        if (macCheck === true) {
            isMac = macCheck;
        }
        osChecked = true;
        // console.log("end of web os check");
    } catch (err) {
        console.log(`Maybe error of: window.navigator.userAgent`);
        console.log(err);
    }
}

console.log("isMac is:", isMac);
console.log("osChecked:", osChecked);

//  const GOLDEN_LINE_HEIGHT_RATIO = platform.isMacintosh ? 1.5 : 1.35;
const GOLDEN_LINE_HEIGHT_RATIO = isMac ? 1.5 : 1.35;
const MINIMUM_LINE_HEIGHT = 8;

const stateHolder: {
    myState?: vscode.Memento & {
        setKeysForSync(keys: string[]): void;
    };
} = {
    myState: undefined,
};

export let bracketManager: DocumentDecorationManager | undefined | null;

colorCombos.forEach((combo) => {
    combo.focusedBlock = makeGradientNotation(combo.focusedBlock);
    combo.onEachDepth = combo.onEachDepth.map((color) =>
        makeGradientNotation(color),
    );
});

const classicDark1Combo = colorCombos.find(
    (x) => x.name === "Classic Dark 1 (Gradients)",
)!;

const bigVars = {
    currColorCombo: classicDark1Combo,
};

export const glo = {
    isOn: true,
    eachCharFrameHeight: 1, // (px) no more needed, so before we remove it, it will be just 1,
    eachCharFrameWidth: 1, // (px) no more needed, so before we remove it, it will be just 1,
    letterSpacing: 0, // (px)

    maxDepth: 9, // (as minus one) -2 -> no blocks, -1 -> ground block, 0 -> first depth blocks, and so on...

    enableFocus: true,

    renderIncBeforeAfterVisRange: 20, // 2-3 is minimal
    renderTimerForInit: 50, // ms
    renderTimerForChange: 1200, // ms
    renderTimerForFocus: 200, // ms
    renderTimerForScroll: 100, // ms

    analyzeCurlyBrackets: true,
    analyzeSquareBrackets: false,
    analyzeRoundBrackets: false,
    analyzeTags: true,
    analyzeIndentDedentTokens: true,

    renderInSingleLineAreas: false,

    borderSize: 1,
    borderRadius: 5,

    coloring: {
        onEachDepth: bigVars.currColorCombo.onEachDepth,

        border: bigVars.currColorCombo.border,
        borderOfDepth0: bigVars.currColorCombo.borderOfDepth0,

        focusedBlock: bigVars.currColorCombo.focusedBlock,
        borderOfFocusedBlock: bigVars.currColorCombo.borderOfFocusedBlock,
    },

    colorDecoratorsInStyles: true,
    trySupportDoubleWidthChars: false, // for Chinese characters and possibly others too
    blackListOfFileFormats: ["plaintext", "markdown"],
    // maxHistoryOfParsedTabs: 7,
};

const updateBlockmanLineHeightAndLetterSpacing = () => {
    /**
     * Determined from empirical observations.
     */

    const editorConfig: any = workspace.getConfiguration("editor");
    // console.log("editorConfig:", editorConfig);

    let editorLineHeight: number = editorConfig.get("lineHeight");
    const editorFontSize: number = editorConfig.get("fontSize");

    if (editorLineHeight === 0) {
        // 0 is the default
        editorLineHeight = Math.round(
            GOLDEN_LINE_HEIGHT_RATIO * editorFontSize,
        ); // fontSize is editor.fontSize
    } else if (editorLineHeight < MINIMUM_LINE_HEIGHT) {
        editorLineHeight = editorLineHeight * editorFontSize;
    }

    glo.eachCharFrameHeight = editorLineHeight;

    // now letter spacing:

    const editorLetterSpacing: number = editorConfig.get("letterSpacing");
    glo.letterSpacing = editorLetterSpacing;
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
          divType?: "m"; // middle
          midStartLine?: number;
          midEndLine?: number;
      }
    | undefined;

export type TyDepthDecInfo = TyInLineInDepthInQueueInfo[];

export type TyLineDecInfo = TyDepthDecInfo[];

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
        currIsFreezed?: true | false;
        curr: IFocusBlock | null;
        prev: IFocusBlock | null;
    };
    timerForDo: any;
    renderingInfoForFullFile: IFullRender | undefined;
    // focusedBlock: { depth: number; index: number } | null;
    monoText: string;
    colorDecoratorsArr: {
        cDLineZero: number;
        cDCharZeroInDoc: number;
        cDCharZeroInMonoText: number;
        cDGlobalIndexZeroInMonoText: number;
    }[];
}

// export const maxNumberOfControlledEditors = 5;
export let infosOfControlledEditors: IEditorInfo[] = [];

// extention-wide GLOBALS _end_

export const dropTextLinesMapForEditor = (editor: vscode.TextEditor) => {
    for (
        let edInfoIndex = 0;
        edInfoIndex < infosOfControlledEditors.length;
        edInfoIndex += 1
    ) {
        const currEdInfo = infosOfControlledEditors[edInfoIndex];
        if (currEdInfo.editorRef === editor) {
            currEdInfo.textLinesMap = [];
            break;
        }
    }
};

export const haveSameDocs = (
    ed1: vscode.TextEditor,
    ed2: vscode.TextEditor,
) => {
    if (ed1 === ed2) {
        return true;
    }

    if (ed1.document === ed2.document) {
        return true;
    }

    if (ed1.document.uri === ed2.document.uri) {
        return true;
    }

    if (ed1.document.uri.fsPath === ed2.document.uri.fsPath) {
        return true;
    }
    if (ed1.document.uri.path === ed2.document.uri.path) {
        return true;
    }
    return false;
};

export const areSameDocs = (
    d1: vscode.TextDocument,
    d2: vscode.TextDocument,
) => {
    if (d1 === d2) {
        return true;
    }

    if (d1.uri === d2.uri) {
        return true;
    }

    if (d1.uri.fsPath === d2.uri.fsPath) {
        return true;
    }
    if (d1.uri.path === d2.uri.path) {
        return true;
    }
    return false;
};

export const updateAllControlledEditors = ({
    alsoStillVisibleAndHist,
}: {
    alsoStillVisibleAndHist?: boolean;
}) => {
    const supMode = "init";
    const visibleEditors = vscode.window.visibleTextEditors;

    const infosOfStillVisibleEditors = infosOfControlledEditors.filter(
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

    newEditors.forEach((editor) => {
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

            monoText: "",
            colorDecoratorsArr: [],
        });
    });

    let infosOfDisposedEditors = infosOfControlledEditors.filter(
        (edInfo) => !stillVisibleEditors.includes(edInfo.editorRef),
    );

    infosOfDisposedEditors.forEach((edInfo) => {
        junkDecors3dArr.push(edInfo.decors);
    });

    const finalArrOfInfos = [
        ...infosOfStillVisibleEditors,
        ...infosOfNewEditors,
    ];

    infosOfControlledEditors = finalArrOfInfos;

    infosOfNewEditors.forEach((editorInfo: IEditorInfo) => {
        editorInfo.needToAnalyzeFile = true;
        updateRender({ editorInfo, timer: glo.renderTimerForInit });
    });

    if (alsoStillVisibleAndHist) {
        infosOfStillVisibleEditors.forEach((editorInfo: IEditorInfo) => {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;
            editorInfo.needToAnalyzeFile = true;
            updateRender({ editorInfo, timer: glo.renderTimerForInit });
        });
    }
};

export const updateControlledEditorsForOneDoc = ({
    editor,
    doc,
    supMode,
}: {
    editor?: vscode.TextEditor;
    doc?: vscode.TextDocument;
    supMode: "reparse" | "focus" | "scroll";
}) => {
    let thisTimer = glo.renderTimerForChange;

    if (supMode === "scroll") {
        thisTimer = glo.renderTimerForScroll;
    } else if (supMode === "focus") {
        thisTimer = glo.renderTimerForFocus;
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

    infosOfControlledEditors.forEach((editorInfo: IEditorInfo) => {
        if (
            (thisDoc as vscode.TextDocument) === editorInfo.editorRef.document
            // areSameDocs(thisDoc!, editorInfo.editorRef.document)
        ) {
            if (
                ["scroll", "focus"].includes(supMode) &&
                editorInfo.needToAnalyzeFile
            ) {
                // !!! VERY IMPORTANT for optimization
                return; // it's the same as 'continue' for 'for/while' loop.
            }
            // console.log("kok", supMode);

            updateRender({ editorInfo, timer: thisTimer, supMode });
        }
    });
};

const setLightColorComboIfLightTheme = () => {
    const currVscodeThemeKind = vscode.window.activeColorTheme.kind;

    if (currVscodeThemeKind === vscode.ColorThemeKind.Light) {
        // glo.coloring.
        workspace
            .getConfiguration("blockman")
            .update("n04ColorComboPreset", "Classic Light (Gradients)", 1);
    }
};

const setColorDecoratorsBool = () => {
    const vsConfigOfEditors = vscode.workspace.getConfiguration("editor");

    const colorDecoratorsBool: boolean | undefined =
        vsConfigOfEditors.get("colorDecorators");

    // console.log(vsConfigOfEditors, colorDecoratorsBool);

    if (colorDecoratorsBool === true || colorDecoratorsBool === false) {
        glo.colorDecoratorsInStyles = colorDecoratorsBool;
    }
};

const setUserwideIndentGuides = (myBool: boolean) => {
    const indent1 = (boo: boolean) => {
        try {
            // old API
            vscode.workspace
                .getConfiguration()
                .update("editor.renderIndentGuides", myBool, 1); // 1 means Userwide
        } catch (err) {
            //
        }
    };

    const indent2 = (boo: boolean) => {
        try {
            vscode.workspace
                .getConfiguration()
                .update("editor.guides.indentation", myBool, 1); // 1 means Userwide
        } catch (err) {
            //
        }
    };

    const indent3 = (boo: boolean) => {
        try {
            vscode.workspace
                .getConfiguration()
                .update("editor.guides.bracketPairs", myBool, 1); // 1 means Userwide
        } catch (err) {
            //
        }
    };

    indent1(myBool);
    indent2(myBool);
    indent3(myBool);

    // vscode.workspace
    //     .getConfiguration()
    //     .update("editor.highlightActiveIndentGuide", myBool, 1); // 1 means Userwide
};

interface IConfigOfVscode {
    inlayHints: boolean; // "editor.inlayHints.enabled"
    lineHighlightBackground?: string; // "workbench.colorCustomizations" -> "editor.lineHighlightBackground"
    lineHighlightBorder?: string; // "workbench.colorCustomizations" -> "editor.lineHighlightBorder"
    editorWordWrap?: "on" | "off"; // "editor.wordWrap"
    diffEditorWordWrap?: "on" | "off"; // "diffEditor.wordWrap"
    // markdownEditorWordWrap?: string; // "[markdown]_editor.wordWrap"
    renderIndentGuides?: boolean; // "editor.renderIndentGuides" - old API of indent guides
    guidesIndentation: boolean; // "editor.guides.indentation" - new API of indent guides
    guidesBracketPairs: boolean; // "editor.guides.bracketPairs" - // new advanced indent guides
    // highlightActiveIndentGuide?: boolean; // "editor.highlightActiveIndentGuide"
    [key: string]: string | boolean | undefined;
}

// for archive
// const configOfVscodeBeforeBlockman: IConfigOfVscode = {
//     renderIndentGuides: true,
// };

// for blockman
const configOfVscodeWithBlockman: IConfigOfVscode = {
    inlayHints: false,
    lineHighlightBackground: "#1073cf2d",
    lineHighlightBorder: "#9fced11f",
    editorWordWrap: "off",
    diffEditorWordWrap: "off",
    renderIndentGuides: false,
    guidesIndentation: false,
    guidesBracketPairs: false,
};

// let vvvv = vscode.workspace.getConfiguration().get("editor.wordWrap");

const setUserwideConfigOfVscode = (userwideConfig: IConfigOfVscode) => {
    let vscodeColorConfig: any = vscode.workspace
        .getConfiguration("workbench")
        .get("colorCustomizations");

    vscode.workspace.getConfiguration("workbench").update(
        "colorCustomizations",
        {
            ...vscodeColorConfig,
            "editor.lineHighlightBackground":
                userwideConfig.lineHighlightBackground,
            "editor.lineHighlightBorder": userwideConfig.lineHighlightBorder,
        },
        1,
    );

    vscode.workspace
        .getConfiguration()
        .update("editor.wordWrap", userwideConfig.editorWordWrap, 1);
    vscode.workspace
        .getConfiguration()
        .update("diffEditor.wordWrap", userwideConfig.diffEditorWordWrap, 1);

    // let vscodeMarkdownConfig: any = vscode.workspace
    //     .getConfiguration()
    //     .get("[markdown]");

    // vscode.workspace.getConfiguration().update(
    //     "[markdown]",
    //     {
    //         ...vscodeMarkdownConfig,
    //         "editor.wordWrap": userwideConfig.markdownEditorWordWrap,
    //     },
    //     1,
    // );

    if (userwideConfig.renderIndentGuides !== undefined) {
        setUserwideIndentGuides(userwideConfig.guidesBracketPairs);
    }
};

// maybe not needed anymore
const importantMessage = () => {
    vscode.window.showInformationMessage(`blaaaa`, { modal: true });
};

const softRestart = () => {
    nukeAllDecs();
    nukeJunkDecorations();
    infosOfControlledEditors = [];
    updateAllControlledEditors({ alsoStillVisibleAndHist: true });
};

let settingsChangeTimout: NodeJS.Timeout | undefined;

export function activate(context: ExtensionContext) {
    stateHolder.myState = context.globalState;
    // const onOff: boolean | undefined =
    //     context.globalState.get("blockman_data_on");
    // if (onOff !== undefined) {
    //     glo.isOn = onOff;
    // } else {
    //     context.globalState.update("blockman_data_on", true);
    //     glo.isOn = true;
    // }

    updateBlockmanLineHeightAndLetterSpacing();
    // adjustVscodeUserConfig();
    setColorDecoratorsBool();
    if (glo.isOn) {
        setUserwideIndentGuides(false);
    }

    bracketManager = new DocumentDecorationManager();
    vscode.extensions.onDidChange(() => restart());

    // console.log("all Config:", vscode.workspace.getConfiguration()); // lineHighlightBorder

    // let bbqq = context.globalStorageUri;

    if (stateHolder.myState) {
        const st = stateHolder.myState;
        const iicounter = st.get(iiGlobal);
        const iicounter2 = st.get(iiGlobal2);
        const iicounter3 = st.get(iiGlobal3);
        // console.log(iicounter);

        if (iicounter === undefined) {
            console.log("first activation 1");
            // collectVSCodeConfigArchive();
            setUserwideConfigOfVscode(configOfVscodeWithBlockman);
            setLightColorComboIfLightTheme();

            st.update(iiGlobal, "1");
            // console.log("iyo undefined, gaxda 1:", st.get(iiGlobal));
        } else if (iicounter === "1") {
            st.update(iiGlobal, "2");
            // console.log("iyo 1, gaxda 2:", st.get(iiGlobal));
        } else if (iicounter === "2") {
            // console.log("aris 2:", st.get(iiGlobal));
            // ----
        }

        if (iicounter2 === undefined) {
            console.log("first activation 2");
            vscode.workspace
                .getConfiguration()
                .update(
                    "editor.inlayHints.enabled",
                    configOfVscodeWithBlockman.inlayHints,
                    1,
                );

            st.update(iiGlobal2, "1");
        } else if (iicounter2 === "1") {
            st.update(iiGlobal2, "2");
            //
        } else if (iicounter2 === "2") {
            //
        }

        if (iicounter3 === undefined) {
            console.log("first activation 3");
            vscode.workspace
                .getConfiguration()
                .update(
                    "editor.guides.indentation",
                    configOfVscodeWithBlockman.guidesIndentation,
                    1,
                );

            st.update(iiGlobal3, "1");
        } else if (iicounter3 === "1") {
            st.update(iiGlobal3, "2");
            //
        } else if (iicounter3 === "2") {
            //-
        }
    }

    // setLightColorComboIfLightTheme(); // not on every activation
    applyAllBlockmanSettings();

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
            vscode.window.showInformationMessage(
                `Hello, I'm Blockman, a visual helper for software developers.`,
                { modal: false },
            );
        }),

        vscode.commands.registerCommand("blockman.toggleEnableDisable", () => {
            if (glo.isOn) {
                glo.isOn = false;
                // context.globalState.update("blockman_data_on", false);

                nukeAllDecs();
                nukeJunkDecorations();
                infosOfControlledEditors = [];

                // setUserwideConfigOfVscode(configOfVscodeBeforeBlockman);

                setUserwideIndentGuides(true);
            } else {
                glo.isOn = true;
                // context.globalState.update("blockman_data_on", true);

                // setUserwideConfigOfVscode(configOfVscodeWithBlockman);

                setUserwideIndentGuides(false);

                updateAllControlledEditors({ alsoStillVisibleAndHist: true });
            }
        }),

        vscode.commands.registerCommand("blockman.printLeak", () => {
            console.log(notYetDisposedDecsObject.decs);
        }),

        vscode.commands.registerCommand(
            "blockman.toggleTrySupportDoubleWidthChars",
            () => {
                glo.trySupportDoubleWidthChars =
                    !glo.trySupportDoubleWidthChars;
                softRestart();
                const isOn: string = glo.trySupportDoubleWidthChars
                    ? "ON"
                    : "OFF";
                vscode.window.showInformationMessage(
                    `Double-width char support (experimental) is ${isOn}`,
                    { modal: false },
                );
            },
        ),

        vscode.commands.registerCommand("blockman.toggleFreezeFocus", () => {
            const thisEditor = vscode.window.activeTextEditor;
            if (thisEditor) {
                const thisEditorInfo = infosOfControlledEditors.find(
                    (x) => x.editorRef === thisEditor,
                );
                if (thisEditorInfo) {
                    const currFr = thisEditorInfo.focusDuo.currIsFreezed;
                    thisEditorInfo.focusDuo.currIsFreezed = !currFr;
                }
            }
        }),

        vscode.commands.registerCommand("blockman.selectFocused", () => {
            selectFocusedBlock();
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
            updateBlockmanLineHeightAndLetterSpacing();
            setColorDecoratorsBool();

            // console.log("scrrr:", glo.renderTimerForScroll);

            // updateAllControlledEditors({
            //     alsoUndisposed: true,
            // });
            // }

            if (glo.isOn) {
                if (settingsChangeTimout) {
                    clearTimeout(settingsChangeTimout);
                }
                settingsChangeTimout = setTimeout(() => {
                    applyAllBlockmanSettings(); // setTimeout is important because VSCode needs certain amount of time to update latest changes of settings.
                    updateAllControlledEditors({
                        alsoStillVisibleAndHist: true,
                    });
                }, 500);
            } else {
                nukeAllDecs();
                nukeJunkDecorations();
                infosOfControlledEditors = [];
            }
        }),

        vscode.window.onDidChangeTextEditorOptions((event) => {
            if (!glo.isOn) {
                return;
            }
            infosOfControlledEditors.forEach((editorInfo: IEditorInfo) => {
                if (event.textEditor === editorInfo.editorRef) {
                    editorInfo.needToAnalyzeFile = true;
                }
            });
            updateControlledEditorsForOneDoc({
                editor: event.textEditor,
                supMode: "reparse",
            });
        }),

        vscode.window.onDidChangeVisibleTextEditors((event) => {
            if (!glo.isOn) {
                return;
            }
            const visEditors = event;
            updateAllControlledEditors({});
        }),

        workspace.onDidChangeTextDocument((event) => {
            if (!glo.isOn) {
                return;
            }
            // console.log("araaaa nulze meti");
            // return;
            if (event.contentChanges.length > 0) {
                // console.log("changed text");
                const thisDoc = event.document;

                infosOfControlledEditors.forEach((editorInfo: IEditorInfo) => {
                    if (thisDoc === editorInfo.editorRef.document) {
                        editorInfo.needToAnalyzeFile = true;
                    }
                });
                // console.log("chhhhhhhhhhhh:", glo.renderTimerForChange);
                // console.log("reparse");
                updateControlledEditorsForOneDoc({
                    doc: thisDoc,
                    supMode: "reparse",
                });
            }
        }),
        workspace.onDidOpenTextDocument((event) => {
            // documentDecorationManager.onDidOpenTextDocument(event);
            // setTimeout(() => {
            //     let eds = window.visibleTextEditors;
            //     console.log("eds-opennnnnnnn:", eds);
            // }, 2000);
        }),
        vscode.window.onDidChangeTextEditorSelection((event) => {
            const thisDoc = event.textEditor.document;
            // console.log("focus");
            // return;
            if (!glo.isOn) {
                return;
            }

            updateControlledEditorsForOneDoc({
                doc: thisDoc,
                supMode: "focus",
            });
        }),
        vscode.window.onDidChangeTextEditorVisibleRanges((event) => {
            // console.log("scroll");
            // return;
            if (!glo.isOn) {
                return;
            }

            const thisEditor = event.textEditor;
            updateControlledEditorsForOneDoc({
                editor: thisEditor,
                supMode: "scroll",
            });
        }),
        vscode.window.onDidChangeActiveTextEditor((event) => {
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

        softRestart();
    }
}

// tslint:disable-next-line:no-empty
export function deactivate() {}
