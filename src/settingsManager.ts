import * as vscode from "vscode";
import { ColorThemeKind, workspace } from "vscode";
import { colorCombos, IColorCombo } from "./colors";
import { glo } from "./extension";

export const makeGradientNotation = (possiblySolidColor: string): string => {
    // !!! IMPORTANT !!!
    // New rendering function uses background with
    // content-box and padding-box values.

    // CSS background with content-box and padding-box values
    // does not work if content-box value is solid color.

    // for example, this works fine for solid red:

    /*
    background: 
        linear-gradient(red, red) padding-box,
        green border-box;
    */

    // but this does not work:

    /*
    background: 
        red padding-box,
        green border-box;
    */

    // So, instead of sending solid color, maybe we should always
    // send it as linear-gradient notiation for padding-box (background) value.

    if (possiblySolidColor.toLowerCase().indexOf("gradient") !== -1) {
        return possiblySolidColor;
    } else {
        return `linear-gradient(to right, ${possiblySolidColor}, ${possiblySolidColor})`;
    }
};

const chooseColorCombo = (
    selectedCombo: string | undefined,
    darkCombo: string | undefined,
    lightCombo: string | undefined,
    highContrastCombo: string | undefined,
): string | undefined => {
    const currVscodeThemeKind = vscode.window.activeColorTheme.kind;

    const isTruthy = (combo?: string) => {
        if (combo && combo !== "None") {
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
        glo.coloring.onEachDepth = thisColorCombo.onEachDepth.map((color) =>
            makeGradientNotation(color),
        ); // important to copy the array, using map() or using [...array]

        glo.coloring.focusedBlock = makeGradientNotation(
            thisColorCombo.focusedBlock,
        );

        glo.coloring.border = thisColorCombo.border;
        glo.coloring.borderOfDepth0 = thisColorCombo.borderOfDepth0;
        glo.coloring.borderOfFocusedBlock = thisColorCombo.borderOfFocusedBlock;
    }

    customColorsOnEachDepth.map((color, i) => {
        if (color) {
            // glo.coloring.onEachDepth[i] = color;
            glo.coloring.onEachDepth[i] = makeGradientNotation(color);
        }
    });

    if (customColorOfFocusedBlock) {
        glo.coloring.focusedBlock = makeGradientNotation(
            customColorOfFocusedBlock,
        );
    }
    if (customColorOfFocusedBlockBorder) {
        glo.coloring.borderOfFocusedBlock = customColorOfFocusedBlockBorder;
    }
    if (customColorOfBlockBorder) {
        glo.coloring.border = customColorOfBlockBorder;
    }
    if (customColorOfDepth0Border) {
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
};
