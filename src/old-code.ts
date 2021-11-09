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