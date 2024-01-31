import { workspace } from "vscode";

export const osIsMac = () => {
    const zen = {
        isMac: false,
        osChecked: false,
    };

    if (!zen.osChecked) {
        try {
            // console.log("start of node os check");
            const os = require("os"); // Comes with node.js
            const myOS: string = os.type().toLowerCase();
            const macCheck = myOS === "darwin";
            if (macCheck === true) {
                zen.isMac = true;
            }
            zen.osChecked = true;
            // console.log("end of node os check");
        } catch (err) {
            console.log(`Maybe error of: require("os")`);
            console.log(err);
        }
    }

    if (!zen.osChecked) {
        try {
            // console.log("start of web os check");
            // @ts-ignore
            const macCheck =
                // @ts-ignore
                navigator.userAgent.toLowerCase().indexOf("mac") !== -1;
            console.log("macCheck:", macCheck);
            if (macCheck === true) {
                zen.isMac = true;
            }
            zen.osChecked = true;
            // console.log("end of web os check");
        } catch (err) {
            console.log(`Maybe error of: window.navigator.userAgent`);
            console.log(err);
        }
    }

    if (!zen.osChecked) {
        throw new Error(
            "could not determine OS --- !zen.osChecked --- osIsMac fn",
        );
    }

    // console.log("OS is Mac:", zen.isMac);
    return zen.isMac;
};

export const getEditorLineHeight = (): number => {
    const editorConfig: any = workspace.getConfiguration("editor");

    const lineHeightConf: number = editorConfig.get("lineHeight");
    const fontSize: number = editorConfig.get("fontSize");

    if (typeof lineHeightConf !== "number") {
        throw new Error(
            `typeof lineHeightConf !== 'number' --- getEditorLineHeight`,
        );
    }

    if (typeof fontSize !== "number") {
        throw new Error(`typeof fontSize !== 'number' --- getEditorLineHeight`);
    }

    // from here (maybe now updated):
    // https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/config/fontInfo.ts

    // The exact historical code:
    // https://github.com/microsoft/vscode/blob/694f90fbf8003ad6c16363fba653af3e9f3ae36c/src/vs/editor/common/config/fontInfo.ts#L63-L74

    const GOLDEN_LINE_HEIGHT_RATIO = osIsMac() ? 1.5 : 1.35;
    const MINIMUM_LINE_HEIGHT = 8;

    let lineHeight = lineHeightConf;

    if (lineHeight === 0) {
        lineHeight = GOLDEN_LINE_HEIGHT_RATIO * fontSize;
    } else if (lineHeight < MINIMUM_LINE_HEIGHT) {
        // Values too small to be line heights in pixels are in ems.
        lineHeight = lineHeight * fontSize;
    }

    // Enforce integer, minimum constraints
    lineHeight = Math.round(lineHeight);
    if (lineHeight < MINIMUM_LINE_HEIGHT) {
        lineHeight = MINIMUM_LINE_HEIGHT;
    }

    return lineHeight;
};

export const getCodeLensHeight = (): number => {
    // from here (maybe now updated):
    // https://github.com/microsoft/vscode/blob/main/src/vs/editor/contrib/codelens/browser/codelensController.ts
    // private _getLayoutInfo()
    //
    // The exact historical code:
    // https://github.com/microsoft/vscode/blob/ba2cf46e20df3edf77bdd905acde3e175d985f70/src/vs/editor/contrib/codelens/browser/codelensController.ts#L82-L90

    const lineHeight: number = getEditorLineHeight();

    const editorConfig: any = workspace.getConfiguration("editor");

    const fontSizeConf: number = editorConfig.get("fontSize");
    const codeLensFontSizeConf: number = editorConfig.get("codeLensFontSize");

    if (typeof fontSizeConf !== "number") {
        throw new Error(
            `typeof fontSizeConf !== 'number' --- getCodeLensHeight`,
        );
    }

    if (fontSizeConf === 0) {
        throw new Error(`fontSizeConf === 0 --- getCodeLensHeight`);
    }

    if (typeof codeLensFontSizeConf !== "number") {
        throw new Error(
            `typeof codeLensFontSizeConf !== 'number' --- getCodeLensHeight`,
        );
    }

    const lineHeightFactor = Math.max(1.3, lineHeight / fontSizeConf);
    let fontSize = codeLensFontSizeConf;
    if (!fontSize || fontSize < 5) {
        fontSize = (fontSizeConf * 0.9) | 0;
    }

    const codeLensHeight = (fontSize * lineHeightFactor) | 0;

    return codeLensHeight;
};

export const getRatioOfCodeLensHeightByEditorLineHeight = () => {
    const editorLineHeight = getEditorLineHeight();
    if (typeof editorLineHeight !== "number") {
        throw new Error(
            `typeof editorLineHeight !== 'number' --- getRatioOfCodeLensHeightByEditorLineHeight`,
        );
    }
    if (editorLineHeight === 0) {
        throw new Error(
            `editorLineHeight === 0 --- getRatioOfCodeLensHeightByEditorLineHeight`,
        );
    }

    const codeLensHeight = getCodeLensHeight();

    return codeLensHeight / editorLineHeight;
};
