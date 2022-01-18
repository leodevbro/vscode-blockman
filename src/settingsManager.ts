import * as vscode from "vscode";
import { ColorThemeKind, workspace } from "vscode";
import { colorCombos, IColorCombo } from "./colors";
import {
    glo,
    optionsForRightEdgeBaseOfBlocks,
    TyRightEdgeBase,
} from "./extension";

// Possible color values are almost (Please see the notes below) all CSS color/gradient values.
// ---- 'transparent' (or any rgba/hsla... value with partial transparency) - as itself or as inside gradient, works fine for borders, but for backgrounds, transparency is problematic, so 'transparent' will be the color of editor background.
// ---- 'none' is the same as 'transparent', but 'none' works only as itself, not as inside gradient.
// ---- 'neutral' (or undefined, null, false, '', ) means it can be overriden by any other setting. If nothing overrides it, then it should be transparent (Or editor background).

export const editorBackgroundFormula = "var(--vscode-editor-background)";

export const makeInnerKitchenNotation = (
    possiblyLegitColor: any, // it may be gradient
    tempTransparent?: "back",
): string => {
    // !!! IMPORTANT !!!
    // In order to be able to use gradient in borders,
    // new rendering function uses background property with
    // padding-box (for background) and border-box (for border) values.

    // CSS background with padding-box and border-box values
    // does not work if any of them is solid color.

    // for example, this works fine:

    /*
    background: 
        linear-gradient(red, red) padding-box,
        linear-gradient(green, green) border-box;
    */

    // but this does not work:

    /*
    background: 
        red padding-box,
        green border-box;
    */

    // So, instead of sending solid color, maybe we should always
    // convert it as linear-gradient notation.

    if (typeof possiblyLegitColor !== "string") {
        return "neutral";
    }

    const trimmed = possiblyLegitColor.trim();

    if (trimmed === "" || trimmed === "neutral") {
        return "neutral";
    }

    if (["none", "transparent"].includes(trimmed)) {
        if (tempTransparent === "back") {
            return `linear-gradient(to right, ${editorBackgroundFormula}, ${editorBackgroundFormula})`;
        } else {
            return `linear-gradient(to right, ${"transparent"}, ${"transparent"})`;
        }
    }

    if (trimmed.includes(`url(`)) {
        return trimmed;
    }

    if (trimmed.includes("gradient")) {
        return trimmed;
    } else {
        return `linear-gradient(to right, ${trimmed}, ${trimmed})`;
    }
};

export enum AdvancedColoringFields {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    fromD0ToInward_All = "fromD0ToInward_All",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    fromD0ToInward_FocusTree = "fromD0ToInward_FocusTree",

    //
    //

    // eslint-disable-next-line @typescript-eslint/naming-convention
    fromFocusToOutward_FocusTree = "fromFocusToOutward_FocusTree",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    fromFocusToOutward_All = "fromFocusToOutward_All",

    //
    //

    // eslint-disable-next-line @typescript-eslint/naming-convention
    fromFocusToInward_All = "fromFocusToInward_All",
}

export interface IOneChainOfColors {
    priority: number;
    sequence: string[];
}

export interface IAdvancedColoringChain {
    borders: IOneChainOfColors | undefined;
    backgrounds: IOneChainOfColors | undefined;
}

export const defaultsForAdvancedColoringOptions = {
    [AdvancedColoringFields.fromD0ToInward_All]: [10, 0, 1, 1],
    [AdvancedColoringFields.fromFocusToOutward_All]: [20, 0, 0, 1],

    [AdvancedColoringFields.fromD0ToInward_FocusTree]: [30, 0, 1, 1],

    [AdvancedColoringFields.fromFocusToOutward_FocusTree]: [40, 0, 1, 1],

    [AdvancedColoringFields.fromFocusToInward_All]: [50, 0, 0, 1],
};

const generateOneChainOfColorsForEachDepth = (
    myString: any, // e.g. '50,0,0,0; hsl(0, 0%, 100%, 0.25)>red>blue'
    // where first number relates priority

    // Second number relates zero-based index of first item of first loop, So it splits what should be looped from what should not be looped.

    // third number relates loop part reversion:
    //---- 0: original,
    //---- 1: reversed,

    // fourth number relates looping strategy:
    //---- 0: all the continuation items to be 'neutral', 'neutral' means it will be overriden by any other setting.
    //---- 1: Only the last item will be looped. Yes, it will ignore the second option;
    //---- 2: loop as forward,
    //---- 3: loop as pair of forward and backward,

    // type "!" to disable the sequence, like this: '!50,0,0,0; hsl(0, 0%, 100%, 0.25)>red>blue'

    // kind: keyof typeof defaultsForAdvancedColoringOptions, // maybe not needed
    tempTransparent?: "back",
): { priority: number; sequence: string[] } | undefined => {
    if (typeof myString !== "string") {
        return undefined;
    }
    let tr = myString.trim();
    if (!tr || tr[0] === "!") {
        return undefined;
    }
    const trL = tr.length;
    if (tr[trL - 1] === ">") {
        tr = tr.slice(0, trL - 1);
    }

    const optionsAndColorsAsTwoStrings = tr.split(";").map((x) => x.trim());

    const optionsSequenceRaw = optionsAndColorsAsTwoStrings[0]
        .split(",")
        .map((x) => x.trim());

    if (
        optionsSequenceRaw.length !== 4 ||
        optionsSequenceRaw.some((x) => x === "")
    ) {
        return undefined;
    }

    const optionsSequence = optionsSequenceRaw.map((x) => Number(x));

    for (let i = 0; i < optionsSequence.length; i += 1) {
        if (i === 0) {
            const prio = optionsSequence[i];
            if (Number.isNaN(prio)) {
                return undefined;
            }
            continue;
        } else if (!Number.isInteger(optionsSequence[i])) {
            return undefined;
        }
    }

    const priority = optionsSequence[0];
    let loopStartIndex = optionsSequence[1];
    const reverseLoop = optionsSequence[2];
    const loopingStrategy = optionsSequence[3];

    // ------------

    const coloringSequence = optionsAndColorsAsTwoStrings[1]
        .split(">")
        .map((x) => makeInnerKitchenNotation(x.trim(), tempTransparent));

    if (
        coloringSequence.length === 0 ||
        coloringSequence.some((x) => x === "")
    ) {
        return undefined;
    }

    if ([0, 1].includes(loopingStrategy)) {
        loopStartIndex = coloringSequence.length - 1;
    }

    if (
        priority < -1000000 ||
        priority > 1000000 ||
        reverseLoop < 0 ||
        reverseLoop > 1 ||
        loopingStrategy < 0 ||
        loopingStrategy > 3 ||
        loopStartIndex < 0 ||
        loopStartIndex > coloringSequence.length - 1
    ) {
        return undefined;
    }

    // ..........................

    // Now we have optionsSequence and coloringSequence

    // ============
    // ===================

    const nonLoopPart = coloringSequence.slice(0, loopStartIndex);

    const loopPart = coloringSequence.slice(
        loopStartIndex,
        coloringSequence.length,
    );

    const reversedOrNotLoopPart =
        reverseLoop === 0 ? [...loopPart] : [...loopPart].reverse();

    const loopLen = reversedOrNotLoopPart.length;

    const legitSequence = [...nonLoopPart, ...reversedOrNotLoopPart];

    const leLen = legitSequence.length;

    const lengthOfDepths = glo.maxDepth + 2; // because glo.maxDepth is as minus 1

    if (lengthOfDepths < 1) {
        return undefined;
    }

    const finalArrayOfColors: string[] = [];

    if (loopingStrategy === 0) {
        // the rest are neutral
        finalArrayOfColors.push(...legitSequence);
        // the rest will be undefined, so they will be neutral
    } else if (loopingStrategy === 1) {
        //1: the rest are last item
        finalArrayOfColors.push(...legitSequence);
        const lastItem = legitSequence[leLen - 1];
        for (let i = leLen; i <= lengthOfDepths - 1; i += 1) {
            finalArrayOfColors.push(lastItem);
        }
    } else if (loopingStrategy === 2) {
        // 2: loop as forward
        finalArrayOfColors.push(...nonLoopPart);
        while (finalArrayOfColors.length < lengthOfDepths) {
            finalArrayOfColors.push(...[...reversedOrNotLoopPart]);
        }
        finalArrayOfColors.length = lengthOfDepths;
    } else if (loopingStrategy === 3) {
        //3: loop as pair of forward and backward
        finalArrayOfColors.push(...nonLoopPart);

        const inner = reversedOrNotLoopPart.slice(1, loopLen - 1);
        const innerRev = [...inner].reverse();

        const head = reversedOrNotLoopPart[0];
        const tail = reversedOrNotLoopPart[loopLen - 1];

        while (finalArrayOfColors.length < lengthOfDepths) {
            finalArrayOfColors.push(head, ...inner, tail, ...innerRev);
        }
        finalArrayOfColors.length = lengthOfDepths;
    }

    return { priority, sequence: finalArrayOfColors };
};

const chooseColorCombo = (
    selectedCombo: string | undefined,
    darkCombo: string | undefined,
    lightCombo: string | undefined,
    highContrastCombo: string | undefined,
): string | undefined => {
    const currVscodeThemeKind = vscode.window.activeColorTheme.kind;

    const isTruthy = (combo?: string) => {
        if (combo && combo.toLowerCase() !== "none") {
            return true;
        } else {
            return false;
        }
    };

    let resultCombo = selectedCombo;

    if (isTruthy(darkCombo) && currVscodeThemeKind === ColorThemeKind.Dark) {
        resultCombo = darkCombo;
        // console.log("dark kind");
    } else if (
        isTruthy(lightCombo) &&
        currVscodeThemeKind === ColorThemeKind.Light
    ) {
        resultCombo = lightCombo;
        // console.log("light king");
    } else if (
        isTruthy(highContrastCombo) &&
        currVscodeThemeKind === ColorThemeKind.HighContrast
    ) {
        resultCombo = highContrastCombo;
        // console.log("HC king");
    }

    // console.log("resultCombo:", resultCombo);

    return resultCombo;
};

export const applyAllBlockmanSettings = () => {
    const blockmanConfig = workspace.getConfiguration("blockman");
    const bc = blockmanConfig;
    // =============
    const candLineHeight: number | undefined = bc.get("n01LineHeight");
    if (
        typeof candLineHeight === "number" &&
        candLineHeight >= 2 &&
        candLineHeight < 130
    ) {
        // glo.eachCharFrameHeight = candLineHeight;
    }
    // =============
    const candEachCharFrameWidth: number | undefined = bc.get(
        "n02EachCharFrameWidth",
    );
    if (
        typeof candEachCharFrameWidth === "number" &&
        candEachCharFrameWidth >= 2 &&
        candEachCharFrameWidth < 130
    ) {
        // glo.eachCharFrameWidth = candEachCharFrameWidth;
    }
    // =============
    const candMaxDepth: number | undefined = bc.get("n03MaxDepth");
    if (typeof candMaxDepth === "number" && candMaxDepth >= -1) {
        glo.maxDepth = Math.floor(candMaxDepth - 1);
        // glo.maxDepth = 100;
    }
    // ============= Coloring
    const selectedColorComboName: string | undefined = bc.get(
        "n04ColorComboPreset",
    );
    const selectedColorComboNameForDarkTheme: string | undefined = bc.get(
        "n04Sub01ColorComboPresetForDarkTheme",
    );
    const selectedColorComboNameForLightTheme: string | undefined = bc.get(
        "n04Sub02ColorComboPresetForLightTheme",
    );
    const selectedColorComboNameForHighContrastTheme: string | undefined =
        bc.get("n04Sub03ColorComboPresetForHighContrastTheme");
    // console.log("selectedColorComboName:", selectedColorComboName);
    let thisColorCombo: IColorCombo | undefined = undefined;

    let chosenColorCombo = chooseColorCombo(
        selectedColorComboName,
        selectedColorComboNameForDarkTheme,
        selectedColorComboNameForLightTheme,
        selectedColorComboNameForHighContrastTheme,
    );

    if (chosenColorCombo) {
        thisColorCombo = colorCombos.find(
            (combo) => combo.name === chosenColorCombo,
        );
    }

    // start moding---------
    // n04Sub04RightSideBaseOfBlocks
    // n04Sub05MinDistanceBetweenRightSideEdges
    // n04Sub06AdditionalPaddingRight
    const fetchedRightSideBaseOfBlocks: string | undefined = bc.get(
        "n04Sub04RightSideBaseOfBlocks",
    );
    const fetchedMinDistanceBetweenRightSideEdges: number | undefined = bc.get(
        "n04Sub05MinDistanceBetweenRightSideEdges",
    );
    const fetchedAdditionalPaddingRight: number | undefined = bc.get(
        "n04Sub06AdditionalPaddingRight",
    );

    if (typeof fetchedRightSideBaseOfBlocks === "string") {
        const myEntries = Object.entries(optionsForRightEdgeBaseOfBlocks) as [
            TyRightEdgeBase,
            string,
        ][];

        for (const [key, value] of myEntries) {
            if (fetchedRightSideBaseOfBlocks === value) {
                glo.edgeExpanding.rightSideBaseOfBlocks = key;
                break;
            }
        }
    }

    if (typeof fetchedMinDistanceBetweenRightSideEdges === "number") {
        glo.edgeExpanding.minDistanceBetweenRightSideEdges =
            fetchedMinDistanceBetweenRightSideEdges;
    }

    if (typeof fetchedAdditionalPaddingRight === "number") {
        glo.edgeExpanding.additionalPaddingRight =
            fetchedAdditionalPaddingRight;
    }

    // end --------------

    const customColorOfDepth0: string | undefined = bc.get(
        "n05CustomColorOfDepth0",
    );
    const customColorOfDepth1: string | undefined = bc.get(
        "n06CustomColorOfDepth1",
    );
    const customColorOfDepth2: string | undefined = bc.get(
        "n07CustomColorOfDepth2",
    );
    const customColorOfDepth3: string | undefined = bc.get(
        "n08CustomColorOfDepth3",
    );
    const customColorOfDepth4: string | undefined = bc.get(
        "n09CustomColorOfDepth4",
    );
    const customColorOfDepth5: string | undefined = bc.get(
        "n10CustomColorOfDepth5",
    );
    const customColorOfDepth6: string | undefined = bc.get(
        "n11CustomColorOfDepth6",
    );
    const customColorOfDepth7: string | undefined = bc.get(
        "n12CustomColorOfDepth7",
    );
    const customColorOfDepth8: string | undefined = bc.get(
        "n13CustomColorOfDepth8",
    );
    const customColorOfDepth9: string | undefined = bc.get(
        "n14CustomColorOfDepth9",
    );
    const customColorOfDepth10: string | undefined = bc.get(
        "n15CustomColorOfDepth10",
    );

    const customColorsOnEachDepth: (string | undefined)[] = [
        customColorOfDepth0,
        customColorOfDepth1,
        customColorOfDepth2,
        customColorOfDepth3,
        customColorOfDepth4,
        customColorOfDepth5,
        customColorOfDepth6,
        customColorOfDepth7,
        customColorOfDepth8,
        customColorOfDepth9,
        customColorOfDepth10,
    ];

    const customColorOfFocusedBlock: string | undefined = bc.get(
        "n17CustomColorOfFocusedBlock",
    );
    const customColorOfFocusedBlockBorder: string | undefined = bc.get(
        "n18CustomColorOfFocusedBlockBorder",
    );
    const customColorOfBlockBorder: string | undefined = bc.get(
        "n19CustomColorOfBlockBorder",
    );
    const customColorOfDepth0Border: string | undefined = bc.get(
        "n20CustomColorOfDepth0Border",
    );

    if (thisColorCombo) {
        glo.coloring.onEachDepth = thisColorCombo.onEachDepth.map(
            (color) => color,
        ); // important to copy the array, using map() or using [...array]

        glo.coloring.focusedBlock = thisColorCombo.focusedBlock;

        glo.coloring.border = thisColorCombo.border;
        glo.coloring.borderOfDepth0 = thisColorCombo.borderOfDepth0;

        glo.coloring.borderOfFocusedBlock = thisColorCombo.borderOfFocusedBlock;
    }

    customColorsOnEachDepth.map((color, i) => {
        if (color && color.trim()) {
            // glo.coloring.onEachDepth[i] = color;
            glo.coloring.onEachDepth[i] = color;
        }
    });

    if (customColorOfFocusedBlock && customColorOfFocusedBlock.trim()) {
        glo.coloring.focusedBlock = customColorOfFocusedBlock;
    }
    if (
        customColorOfFocusedBlockBorder &&
        customColorOfFocusedBlockBorder.trim()
    ) {
        glo.coloring.borderOfFocusedBlock = customColorOfFocusedBlockBorder;
    }
    if (customColorOfBlockBorder && customColorOfBlockBorder.trim()) {
        glo.coloring.border = customColorOfBlockBorder;
    }
    if (customColorOfDepth0Border && customColorOfDepth0Border.trim()) {
        glo.coloring.borderOfDepth0 = customColorOfDepth0Border;
    }

    // ===========
    const enableFocus: boolean | undefined = bc.get("n16EnableFocus");
    if (enableFocus) {
        glo.enableFocus = true;
    } else if (enableFocus === false) {
        glo.enableFocus = false;
    }
    // ===========
    const candBorderRadius: number | undefined = bc.get("n21BorderRadius");
    if (typeof candBorderRadius === "number" && candBorderRadius >= 0) {
        glo.borderRadius = candBorderRadius;
    }
    // ===========
    const analyzeCurlyBrackets: boolean | undefined = bc.get(
        "n22AnalyzeCurlyBrackets",
    );
    if (analyzeCurlyBrackets) {
        glo.analyzeCurlyBrackets = true;
    } else if (analyzeCurlyBrackets === false) {
        glo.analyzeCurlyBrackets = false;
    }
    // ===========
    const analyzeSquareBrackets: boolean | undefined = bc.get(
        "n23AnalyzeSquareBrackets",
    );
    if (analyzeSquareBrackets) {
        glo.analyzeSquareBrackets = true;
    } else if (analyzeSquareBrackets === false) {
        glo.analyzeSquareBrackets = false;
    }
    // ===========
    const analyzeRoundBrackets: boolean | undefined = bc.get(
        "n24AnalyzeRoundBrackets",
    );
    if (analyzeRoundBrackets) {
        glo.analyzeRoundBrackets = true;
    } else if (analyzeRoundBrackets === false) {
        glo.analyzeRoundBrackets = false;
    }
    // ===========
    const analyzeTags: boolean | undefined = bc.get("n25AnalyzeTags");
    if (analyzeTags) {
        glo.analyzeTags = true;
    } else if (analyzeTags === false) {
        glo.analyzeTags = false;
    }
    // ===========
    const analyzeIndentDedentTokens: boolean | undefined = bc.get(
        "n26AnalyzeIndentDedentTokens",
    );
    if (analyzeIndentDedentTokens) {
        glo.analyzeIndentDedentTokens = true;
    } else if (analyzeIndentDedentTokens === false) {
        glo.analyzeIndentDedentTokens = false;
    }
    // ===========
    const alsoRenderBlocksInsideSingleLineAreas: boolean | undefined = bc.get(
        "n27AlsoRenderBlocksInsideSingleLineAreas",
    );
    if (alsoRenderBlocksInsideSingleLineAreas) {
        glo.renderInSingleLineAreas = true;
    } else if (alsoRenderBlocksInsideSingleLineAreas === false) {
        glo.renderInSingleLineAreas = false;
    }
    // ==============
    const timeToWaitBeforeRerenderAfterLastChangeEvent: number | undefined =
        bc.get("n28TimeToWaitBeforeRerenderAfterLastChangeEvent");
    if (
        typeof timeToWaitBeforeRerenderAfterLastChangeEvent === "number" &&
        timeToWaitBeforeRerenderAfterLastChangeEvent >= 0 &&
        timeToWaitBeforeRerenderAfterLastChangeEvent < 10
    ) {
        glo.renderTimerForChange =
            timeToWaitBeforeRerenderAfterLastChangeEvent * 1000;
    }
    // ==============
    const timeToWaitBeforeRerenderAfterlastFocusEvent: number | undefined =
        bc.get("n29TimeToWaitBeforeRerenderAfterLastFocusEvent");
    if (
        typeof timeToWaitBeforeRerenderAfterlastFocusEvent === "number" &&
        timeToWaitBeforeRerenderAfterlastFocusEvent >= 0 &&
        timeToWaitBeforeRerenderAfterlastFocusEvent < 10
    ) {
        glo.renderTimerForFocus =
            timeToWaitBeforeRerenderAfterlastFocusEvent * 1000;
    }
    // ==============
    const timeToWaitBeforeRerenderAfterlastScrollEvent: number | undefined =
        bc.get("n30TimeToWaitBeforeRerenderAfterLastScrollEvent");
    // console.log("iissss:", timeToWaitBeforeRerenderAfterlastScrollEvent);
    if (
        typeof timeToWaitBeforeRerenderAfterlastScrollEvent === "number" &&
        timeToWaitBeforeRerenderAfterlastScrollEvent >= 0 &&
        timeToWaitBeforeRerenderAfterlastScrollEvent < 10
    ) {
        glo.renderTimerForScroll =
            timeToWaitBeforeRerenderAfterlastScrollEvent * 1000;
    }
    // ==============
    const renderIncrementBeforeAndAfterVisibleRange: number | undefined =
        bc.get("n31RenderIncrementBeforeAndAfterVisibleRange");
    // console.log("iissss:", timeToWaitBeforeRerenderAfterlastScrollEvent);
    if (
        typeof renderIncrementBeforeAndAfterVisibleRange === "number" &&
        renderIncrementBeforeAndAfterVisibleRange >= -200 &&
        renderIncrementBeforeAndAfterVisibleRange <= 200
    ) {
        glo.renderIncBeforeAfterVisRange = Math.floor(
            renderIncrementBeforeAndAfterVisibleRange,
        );
    }

    const customBlackListOfFileFormats: string | undefined = bc.get(
        "n32BlackListOfFileFormats",
    );

    // console.log(glo.coloring.border);

    if (typeof customBlackListOfFileFormats === "string") {
        const stringWithoutSpaces = customBlackListOfFileFormats.replace(
            / /g,
            ``,
        );
        const stringWithoutSpacesAndTabs = stringWithoutSpaces.replace(/	/g, ``);

        if (stringWithoutSpacesAndTabs) {
            const mySplitArr = stringWithoutSpacesAndTabs.split(",");
            glo.blackListOfFileFormats = mySplitArr;
        } else {
            glo.blackListOfFileFormats = [];
        }
    }

    // ! IMPORTANT

    glo.coloring.border = makeInnerKitchenNotation(glo.coloring.border);
    glo.coloring.borderOfDepth0 = makeInnerKitchenNotation(
        glo.coloring.borderOfDepth0,
    );
    glo.coloring.borderOfFocusedBlock = makeInnerKitchenNotation(
        glo.coloring.borderOfFocusedBlock,
    );

    glo.coloring.focusedBlock = makeInnerKitchenNotation(
        glo.coloring.focusedBlock,
        "back",
    );
    glo.coloring.onEachDepth = glo.coloring.onEachDepth.map((color) =>
        makeInnerKitchenNotation(color, "back"),
    );

    // console.log(">>>>>>>>>>>>>", glo.coloring.focusedBlock);

    const adCoFromDepth0ToInwardForAllBorders: string | undefined = bc.get(
        "n33A01B1FromDepth0ToInwardForAllBorders",
    );
    const adCoFromDepth0ToInwardForAllBackgrounds: string | undefined = bc.get(
        "n33A01B2FromDepth0ToInwardForAllBackgrounds",
    );
    // --------------------
    const adCoFromFocusToOutwardForAllBorders: string | undefined = bc.get(
        "n33A02B1FromFocusToOutwardForAllBorders",
    );
    const adCoFromFocusToOutwardForAllBackgrounds: string | undefined = bc.get(
        "n33A02B2FromFocusToOutwardForAllBackgrounds",
    );
    // --------------------
    const adCoFromDepth0ToInwardForFocusTreeBorders: string | undefined =
        bc.get("n33A03B1FromDepth0ToInwardForFocusTreeBorders");
    const adCoFromDepth0ToInwardForFocusTreeBackgrounds: string | undefined =
        bc.get("n33A03B2FromDepth0ToInwardForFocusTreeBackgrounds");
    // --------------------
    const adCoFromFocusToOutwardForFocusTreeBorders: string | undefined =
        bc.get("n33A04B1FromFocusToOutwardForFocusTreeBorders");
    const adCoFromFocusToOutwardForFocusTreeBackgrounds: string | undefined =
        bc.get("n33A04B2FromFocusToOutwardForFocusTreeBackgrounds");
    // --------------------
    const adCoFromFocusToInwardForAllBorders: string | undefined = bc.get(
        "n33A05B1FromFocusToInwardForAllBorders",
    );
    const adCoFromFocusToInwardForAllBackgrounds: string | undefined = bc.get(
        "n33A05B2FromFocusToInwardForAllBackgrounds",
    );
    // =======================
    // =======================

    // -----

    const advancedColoringSettingsOfBorders = [
        {
            val: adCoFromDepth0ToInwardForAllBorders,
            kind: AdvancedColoringFields.fromD0ToInward_All,
        },

        {
            val: adCoFromFocusToOutwardForAllBorders,
            kind: AdvancedColoringFields.fromFocusToOutward_All,
        },

        {
            val: adCoFromDepth0ToInwardForFocusTreeBorders,
            kind: AdvancedColoringFields.fromD0ToInward_FocusTree,
        },

        {
            val: adCoFromFocusToOutwardForFocusTreeBorders,
            kind: AdvancedColoringFields.fromFocusToOutward_FocusTree,
        },

        {
            val: adCoFromFocusToInwardForAllBorders,
            kind: AdvancedColoringFields.fromFocusToInward_All,
        },
    ];

    const advancedColoringSettingsOfBackgrounds = [
        {
            val: adCoFromDepth0ToInwardForAllBackgrounds,
            kind: AdvancedColoringFields.fromD0ToInward_All,
        },

        {
            val: adCoFromFocusToOutwardForAllBackgrounds,
            kind: AdvancedColoringFields.fromFocusToOutward_All,
        },

        {
            val: adCoFromDepth0ToInwardForFocusTreeBackgrounds,
            kind: AdvancedColoringFields.fromD0ToInward_FocusTree,
        },

        {
            val: adCoFromFocusToOutwardForFocusTreeBackgrounds,
            kind: AdvancedColoringFields.fromFocusToOutward_FocusTree,
        },

        {
            val: adCoFromFocusToInwardForAllBackgrounds,
            kind: AdvancedColoringFields.fromFocusToInward_All,
        },
    ];

    const processAC = (
        arr: {
            val: string | undefined;
            kind: AdvancedColoringFields;
        }[],
        tempTransparent?: "back",
    ): {
        priority: number;
        sequence: string[];
        kind: AdvancedColoringFields;
    }[] => {
        return arr
            .map((x) => ({
                kind: x.kind,
                val: generateOneChainOfColorsForEachDepth(
                    x.val,
                    tempTransparent,
                ),
            }))
            .filter((x) => !!x.val)
            .map((x) => ({
                priority: x.val!.priority,
                sequence: x.val!.sequence,
                kind: x.kind,
            }))
            .sort((a, b) => b.priority - a.priority); // descending order
    };

    glo.coloring.advanced.forBorders = processAC(
        advancedColoringSettingsOfBorders,
    );

    glo.coloring.advanced.forBackgrounds = processAC(
        advancedColoringSettingsOfBackgrounds,
        "back",
    );

    // ..........
};
