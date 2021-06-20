import { IEditorInfo } from "./extension";

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
