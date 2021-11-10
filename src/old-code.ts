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

/*

const collectVSCodeConfigArchive = () => {
    return; // this function maybe not needed
    
    let vscodeColorConfig: any = vscode.workspace
        .getConfiguration("workbench")
        .get("colorCustomizations");

    console.log("vscodeColorConfig");
    console.log(vscodeColorConfig);

    configOfVscodeBeforeBlockman.lineHighlightBackground = (
        vscodeColorConfig as any
    )["editor.lineHighlightBackground"];

    configOfVscodeBeforeBlockman.lineHighlightBorder = (
        vscodeColorConfig as any
    )["editor.lineHighlightBorder"];

    configOfVscodeBeforeBlockman.editorWordWrap = vscode.workspace
        .getConfiguration()
        .get("editor.wordWrap");

    configOfVscodeBeforeBlockman.diffEditorWordWrap = vscode.workspace
        .getConfiguration()
        .get("diffEditor.wordWrap");

    configOfVscodeBeforeBlockman.markdownEditorWordWrap = (
        vscode.workspace.getConfiguration().get("[markdown]") as any
    )["editor.wordWrap"];

    configOfVscodeBeforeBlockman.renderIndentGuides = vscode.workspace
        .getConfiguration()
        .get("editor.renderIndentGuides");

    configOfVscodeBeforeBlockman.highlightActiveIndentGuide = vscode.workspace
        .getConfiguration()
        .get("editor.highlightActiveIndentGuide");

    console.log("configOfVscodeBeforeBlockman");
    console.log(configOfVscodeBeforeBlockman);

    if (stateHolder.myState) {
        const st = stateHolder.myState;

        // st.update(iiGlobal, "1");

        for (let key in configOfVscodeBeforeBlockman) {
            const v = configOfVscodeBeforeBlockman[key];
            // console.log(typeof key);

            // st.update(`blockman_data_${key}`, v);
        }

        // for (let key in configOfVscodeBeforeBlockman) {
        //     const v = configOfVscodeBeforeBlockman[key];
        //     // console.log(typeof key);

        //     const thisV = st.get(`datablockman${key}`);
        //     console.log("esaa", thisV, typeof thisV);
        // }
    }

};

*/

// DEPRICATED
/*
let focusTimout: NodeJS.Timeout | undefined;
const updateFocus = (editorInfo?: IEditorInfo) => {
    if (focusTimout) {
        clearTimeout(focusTimout);
    }
    focusTimout = setTimeout(() => {
        const thisEditor =
            editorInfo?.editorRef || vscode.window.activeTextEditor;

        if (thisEditor) {
            const thisEditorInfo =
                editorInfo ||
                infosOfcontrolledEditors.find(
                    (x) => x.editorRef === thisEditor,
                );
            if (thisEditorInfo) {
                if (
                    thisEditorInfo.needToAnalyzeFile ||
                    thisEditorInfo.focusDuo.currIsFreezed
                ) {
                    return;
                }

                // updateFocusInfo(thisEditorInfo);
                console.log("timer0"); // ::-:
                updateRender({
                    editorInfo: thisEditorInfo,
                    timer: 0,
                });
            }
        }

        // boloshi clean junk focusBlocks
    }, glo.renderTimerForFocus);
    
};
*/

/*
export const updateAllControlledEditors0 = ({
    alsoStillVisibleAndHist, //
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
            // focusedBlock: null, //
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
        ...infosOfStillVisibleEditors, //
        ...infosOfNewEditors,
    ];

    infosOfControlledEditors = finalArrOfInfos; //

    infosOfNewEditors.forEach((editorInfo: IEditorInfo) => {
        editorInfo.needToAnalyzeFile = true;
        updateRender({ editorInfo, timer: glo.renderTimerForInit }); //
    });
    //
    if (alsoStillVisibleAndHist) {
        infosOfStillVisibleEditors.forEach((editorInfo: IEditorInfo) => {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;
            editorInfo.needToAnalyzeFile = true;
            updateRender({ editorInfo, timer: glo.renderTimerForInit }); //
        });
    } //
};

*/




/*
export const updateAllControlledEditors = ({
    alsoStillVisibleAndHist,
}: {
    alsoStillVisibleAndHist?: boolean;
}) => {
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjj", infosOfControlledEditors.length);
    const supMode = "init";
    const visibleEditors = vscode.window.visibleTextEditors;

    const infosOfStillVisibleEditors: IEditorInfo[] = [];
    const newEdRefs: vscode.TextEditor[] = [];
    const totallyWithNewDoc: vscode.TextEditor[] = [];

    const newEdInfosWithHistDocs: IEditorInfo[] = [];

    visibleEditors.forEach((visEd) => {
        const contrEdInfoWhichIsCurrVisViaDirect =
            infosOfControlledEditors.find(
                (contrEdInfo) => contrEdInfo.editorRef === visEd, // if ediorRef is direct equal, then it means it is still visible
            );
        const contrEdInfoWhichIsCurrVisViaDoc = infosOfControlledEditors.find(
            (contrEdInfo) => haveSameDocs(contrEdInfo.editorRef, visEd),
        );

        if (contrEdInfoWhichIsCurrVisViaDirect) {
            infosOfStillVisibleEditors.push(contrEdInfoWhichIsCurrVisViaDirect);
        } else if (!contrEdInfoWhichIsCurrVisViaDoc) {
            totallyWithNewDoc.push(visEd);
        } else if (contrEdInfoWhichIsCurrVisViaDoc) {
            const nnn = {
                editorRef: visEd, // new
                needToAnalyzeFile: false, // new
                textLinesMap: contrEdInfoWhichIsCurrVisViaDoc.textLinesMap,
                decors: [],
                upToDateLines: {
                    upEdge: -1,
                    lowEdge: -1,
                },
                focusDuo: {
                    curr: null,
                    prev: null,
                },
                timerForDo: contrEdInfoWhichIsCurrVisViaDoc.timerForDo,
                renderingInfoForFullFile:
                    contrEdInfoWhichIsCurrVisViaDoc.renderingInfoForFullFile, // new

                monoText: contrEdInfoWhichIsCurrVisViaDoc.monoText,
                colorDecoratorsArr:
                    contrEdInfoWhichIsCurrVisViaDoc.colorDecoratorsArr,
            };
            newEdInfosWithHistDocs.push(nnn);
        }
    });

    console.log(
        "infosOfStillVisibleEditors-length:",
        infosOfStillVisibleEditors,
    );

    // nukeJunkDecorations();
    if (infosOfStillVisibleEditors.length === 0) {
        nukeJunkDecorations();
        nukeAllDecs();
    }

    const controlledEditors = infosOfControlledEditors.map(
        (edInfo) => edInfo.editorRef,
    );

    const stillVisibleEditors = infosOfStillVisibleEditors.map(
        (edInfo) => edInfo.editorRef,
    );

    const newEditors = totallyWithNewDoc;

    const infosOfHistVisitorEditors = newEdInfosWithHistDocs;

    console.log("infosOfHistVisitorEditors");
    console.log(infosOfHistVisitorEditors);

    console.log("newEditors");
    console.log(
        newEditors.length,
        visibleEditors.length,
        controlledEditors.length,
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
            // focusedBlock: null,
            monoText: "",
            colorDecoratorsArr: [],
        });
    });

    // console.log("infosOfControlledEditors.length");
    // console.log(infosOfControlledEditors.length);

    const infosOfDisposedEditorsCands = infosOfControlledEditors.filter(
        (edInfo) => !stillVisibleEditors.includes(edInfo.editorRef),
    );

    let infosOfDisposedEditors: IEditorInfo[] = [];
    let infosOfHistEditors: IEditorInfo[] = [];

    const dispCandLen = infosOfDisposedEditorsCands.length;
    // console.log("dispCandLen:", dispCandLen);

    if (alsoStillVisibleAndHist) {
        infosOfDisposedEditors = infosOfDisposedEditorsCands;
    } else {
        if (dispCandLen > glo.maxHistoryOfParsedTabs) {
            const cutIndex = dispCandLen - glo.maxHistoryOfParsedTabs;

            infosOfDisposedEditors = infosOfDisposedEditorsCands.slice(
                0,
                cutIndex,
            );

            infosOfHistEditors = infosOfDisposedEditorsCands.slice(
                cutIndex,
                dispCandLen,
            );
        } else {
            infosOfHistEditors = infosOfDisposedEditorsCands;
        }
    }

    infosOfDisposedEditors.forEach((edInfo) => {
        junkDecors3dArr.push(edInfo.decors);
    });

    // console.log(
    //     "hist, stillVis, new:",
    //     infosOfHistEditors.length,
    //     infosOfStillVisibleEditors.length,
    //     infosOfNewEditors.length,
    // );

    let finalArrOfInfos = [
        ...infosOfHistEditors,
        ...infosOfHistVisitorEditors,
        ...infosOfStillVisibleEditors,
        ...infosOfNewEditors,
    ];

    // finalArrOfInfos = [...new Set(finalArrOfInfos)];
    // console.log("finalArrOfInfos");
    // console.log(finalArrOfInfos);

    infosOfControlledEditors = finalArrOfInfos;

    infosOfNewEditors.forEach((editorInfo: IEditorInfo) => {
        editorInfo.needToAnalyzeFile = true;
        updateRender({ editorInfo, timer: glo.renderTimerForInit });
    });

    infosOfHistVisitorEditors.forEach((editorInfo) => {
        // junkDecors3dArr.push(editorInfo.decors);
        console.log("reeeeeeeeeeeee-------------------------");
        editorInfo.needToAnalyzeFile = false;
        updateRender({ editorInfo, timer: glo.renderTimerForInit });
    });

    if (alsoStillVisibleAndHist) {
        infosOfHistEditors.forEach((edInfo) => {
            junkDecors3dArr.push(edInfo.decors);
        });
        infosOfStillVisibleEditors.forEach((editorInfo: IEditorInfo) => {
            editorInfo.upToDateLines.upEdge = -1;
            editorInfo.upToDateLines.lowEdge = -1;
            editorInfo.needToAnalyzeFile = true;
            updateRender({ editorInfo, timer: glo.renderTimerForInit });
        });
    }
};

*/