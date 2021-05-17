/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import ColorMode from "./colorMode";
import TextMateLoader from "./textMateLoader";
import { ThemeColor } from "vscode";

export default class Settings {
    public readonly TextMateLoader = new TextMateLoader();

    // public readonly colorMode: ColorMode;
    public readonly contextualParsing: boolean | undefined;
    // public readonly forceIterationColorCycle: boolean;
    // public readonly forceUniqueOpeningColor: boolean;
    public readonly regexNonExact: RegExp | undefined;
    public readonly timeOutLength: number | undefined;
    // public readonly highlightActiveScope: boolean;
    // public readonly showVerticalScopeLine: boolean;
    // public readonly showHorizontalScopeLine: boolean;
    // public readonly showBracketsInGutter: boolean;
    // public readonly showBracketsInRuler: boolean;
    // public readonly scopeLineRelativePosition: boolean;
    // public readonly colors: string[];
    // public readonly unmatchedScopeColor: string;
    public readonly excludedLanguages: Set<string>;
    public isDisposed = false;
    constructor() {
        // const workspaceColors = vscode.workspace.getConfiguration(
        //     "workbench.colorCustomizations",
        //     undefined,
        // );

        // const configuration = vscode.workspace.getConfiguration(
        //     "bracket-pair-colorizer-2",
        //     undefined,
        // );

        // this.scopeLineRelativePosition = configuration.get(
        //     "scopeLineRelativePosition",
        // ) as boolean;

        // if (typeof this.scopeLineRelativePosition !== "boolean") {
        //     throw new Error("scopeLineRelativePosition is not a boolean");
        // }

        // this.showBracketsInGutter = configuration.get(
        //     "showBracketsInGutter",
        // ) as boolean;

        // if (typeof this.showBracketsInGutter !== "boolean") {
        //     throw new Error("showBracketsInGutter is not a boolean");
        // }

        // this.showBracketsInRuler = configuration.get(
        //     "showBracketsInRuler",
        // ) as boolean;

        // if (typeof this.showBracketsInRuler !== "boolean") {
        //     throw new Error("showBracketsInRuler is not a boolean");
        // }

        // this.rulerPosition = configuration.get("rulerPosition") as string;

        // if (typeof this.rulerPosition !== "string") {
        //     throw new Error("rulerPosition is not a string");
        // }

        // this.unmatchedScopeColor = configuration.get(
        //     "unmatchedScopeColor",
        // ) as string;

        // if (typeof this.unmatchedScopeColor !== "string") {
        //     throw new Error("unmatchedScopeColor is not a string");
        // }

        // this.forceUniqueOpeningColor = configuration.get(
        //     "forceUniqueOpeningColor",
        // ) as boolean;

        // if (typeof this.forceUniqueOpeningColor !== "boolean") {
        //     throw new Error("forceUniqueOpeningColor is not a boolean");
        // }

        // this.forceIterationColorCycle = configuration.get(
        //     "forceIterationColorCycle",
        // ) as boolean;

        // if (typeof this.forceIterationColorCycle !== "boolean") {
        //     throw new Error("forceIterationColorCycle is not a boolean");
        // }

        // this.colorMode = (ColorMode as any)[
        //     configuration.get("colorMode") as string
        // ];

        // if (typeof this.colorMode !== "number") {
        //     throw new Error("colorMode enum could not be parsed");
        // }

        // this.colors = configuration.get("colors") as string[];
        // if (!Array.isArray(this.colors)) {
        //     throw new Error("colors is not an array");
        // }

        // const excludedLanguages = configuration.get(
        //     "excludedLanguages",
        // ) as string[];

        // if (!Array.isArray(excludedLanguages)) {
        //     throw new Error("excludedLanguages is not an array");
        // }

        this.excludedLanguages = new Set([]);
    }
}
