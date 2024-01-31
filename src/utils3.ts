import * as vscode from "vscode";

export type TyPrim = number | string | boolean | null | undefined;
export type TyBranchable =
    | (TyBranchable | TyPrim)[]
    | { [key: string]: TyBranchable | TyPrim };

export const isPrim = (value: any): boolean => {
    // if (typeof value === "object" && value !== null) {
    //     return false;
    // } else {
    //     return true;
    // }

    if (
        [null, undefined].includes(value) ||
        ["string", "number", "boolean"].includes(typeof value)
    ) {
        return true;
    } else {
        return false;
    }
};

/*
export const json_dfsPre_recurs_v1 = (root: tyBranchable | tyPrim): tyPrim[] => {
    const recursFn = (item: tyBranchable | tyPrim, listInp: tyPrim[]): void => {
        if (isPrim(item)) {
            listInp.push(item as tyPrim);
            return;
        }

        const branches = Object.values(item as tyBranchable);

        for (const branch of branches) {
            recursFn(branch, listInp);
        }
    };

    const list: tyPrim[] = [];
    recursFn(root, list);
    return list;
};

*/

export type LineCharCoord = {
    c: number;
    character: number;
    e: number;
    line: number;
};

export type OnePossibleCodelensItem = {
    command?: any;
    isResolved: boolean;
    range: {
        c: LineCharCoord;
        e: LineCharCoord;
        end: LineCharCoord;
        start: LineCharCoord;

        isEmpty: boolean;
        isSingleLine: boolean;
    };
};

export type OnePossibleColorDecoratorItem = {
    color: {
        alpha: number;
        blue: number;
        green: number;
        red: number;
    };

    range: {
        c: LineCharCoord;
        e: LineCharCoord;
        start: LineCharCoord;
        end: LineCharCoord;

        isEmpty: boolean;
        isSingleLine: boolean;
    };
};

export const getEditorColorDecoratorsArr = async (
    editor: vscode.TextEditor,
): Promise<OnePossibleColorDecoratorItem[]> => {
    const theNativeColorDecoratorsArr: OnePossibleColorDecoratorItem[] =
        (await vscode.commands.executeCommand(
            "vscode.executeDocumentColorProvider",
            editor.document.uri,
        )) || [];

    return theNativeColorDecoratorsArr;
};

export const getEditorCodeLensItemsArr = async (
    editor: vscode.TextEditor,
): Promise<OnePossibleCodelensItem[]> => {
    const codeLensItemsArr: OnePossibleCodelensItem[] =
        (await vscode.commands.executeCommand(
            "vscode.executeCodeLensProvider",
            editor.document.uri,
        )) || [];

    return codeLensItemsArr;
};

export const getEditorCodeLensItemsLinesSet = async (
    editor: vscode.TextEditor,
): Promise<Set<number>> => {
    const codeLensItemsArr = await getEditorCodeLensItemsArr(editor);

    const codelensItemsLinesSet = new Set<number>(
        codeLensItemsArr.map((x) => {
            const rawNum = x.range.start.line;
            return rawNum; // zero index of line which is after a codelens item
        }),
    );

    return codelensItemsLinesSet;
};
