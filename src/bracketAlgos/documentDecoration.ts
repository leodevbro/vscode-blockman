import * as vscode from "vscode";
// import Bracket from "./bracket";
import BracketClose from "./bracketClose";
import { IStackElement } from "./IExtensionGrammar";
import LanguageConfig from "./languageConfig";
import LineState from "./lineState";
import Settings from "./settings";
import TextLine from "./textLine";
import { ignoreBracketsInToken, LineTokens } from "./vscodeFiles";
// import { TextDocumentContentChangeEvent } from "vscode";

import { glo, IEditorInfo, updateAllControlledEditors } from "../extension";
import { nukeAllDecs, nukeJunkDecorations } from "../utils2";

// let refresherTimeout: NodeJS.Timeout | undefined = undefined;
let leakCleanTimeoutStarted = false;

export default class DocumentDecoration {
    public readonly settings: Settings;

    // This program caches lines, and will only analyze linenumbers including or above a modified line
    public lines: TextLine[] = [];
    private readonly document: vscode.TextDocument;
    private readonly languageConfig: LanguageConfig;
    private scopeDecorations: vscode.TextEditorDecorationType[] = [];
    private scopeSelectionHistory: vscode.Selection[][] = [];

    constructor(
        document: vscode.TextDocument,
        config: LanguageConfig,
        settings: Settings,
    ) {
        this.settings = settings;
        this.document = document;
        this.languageConfig = config;
    }

    public dispose() {
        this.disposeScopeDecorations();
    }

    // Lines are stored in an array, if line is requested outside of array bounds
    // add emptys lines until array is correctly sized
    public getLine(index: number, state: IStackElement): TextLine {
        if (index < this.lines.length) {
            return this.lines[index];
        } else {
            if (this.lines.length === 0) {
                this.lines.push(
                    new TextLine(
                        state,
                        new LineState(this.settings, this.languageConfig),
                        0,
                    ),
                );
            }

            if (index < this.lines.length) {
                return this.lines[index];
            }

            if (index === this.lines.length) {
                const previousLine = this.lines[this.lines.length - 1];
                const newLine = new TextLine(
                    state,
                    previousLine.cloneState(),
                    index,
                );

                this.lines.push(newLine);
                return newLine;
            }

            throw new Error("Cannot look more than one line ahead");
        }
    }

    public tokenizeDocument(editorInfo: IEditorInfo): {
        char: string;
        type: number;
        inLineIndexZero: number;
        lineZero: number;
    }[] {
        // console.log("Tokenizing " + this.document.fileName);

        // One document may be shared by multiple editors (side by side view)
        const editors: vscode.TextEditor[] =
            vscode.window.visibleTextEditors.filter(
                (e) => this.document === e.document,
            );

        if (editors.length === 0) {
            console.warn(
                "No editors associated with document: " +
                    this.document.fileName,
            );

            // if (refresherTimeout) {
            // clearTimeout(refresherTimeout); // maybe it's better without it
            // }

            // refresherTimeout = setTimeout(() => {
            // console.log("before if");
            if (!leakCleanTimeoutStarted) {
                // console.log("after if");
                leakCleanTimeoutStarted = true;
                setTimeout(() => {
                    leakCleanTimeoutStarted = false;
                    // junkDecors3dArr.push(editorInfo.decors);
                    nukeJunkDecorations();
                    nukeAllDecs();
                    updateAllControlledEditors({ alsoStillVisible: true });
                }, 120000);
            }

            return [];
        }

        // console.time("tokenizeDocument");

        this.lines = [];

        const lineIndex = this.lines.length;
        const lineCount = this.document.lineCount;
        if (lineIndex < lineCount) {
            // console.log("Reparse from line: " + (lineIndex + 1));
            for (let i = lineIndex; i < lineCount; i++) {
                const newLine = this.tokenizeLine(i, editorInfo);
                this.lines.push(newLine);
            }
        }

        // console.log("Coloring document");

        // IMPORTANT
        let myBrackets: {
            char: string;
            type: number;
            inLineIndexZero: number;
            lineZero: number;
        }[] = [];
        for (const line of this.lines) {
            const brackets = line.getAllBrackets();
            for (const bracket of brackets) {
                myBrackets.push({
                    char: bracket.token.character,
                    type: bracket.token.type,
                    inLineIndexZero: bracket.token.range.start.character,
                    lineZero: bracket.token.range.start.line,
                });
            }
        }

        // console.log("myBrackets:", myBrackets);
        return myBrackets;

        // IMPORTANT GO GO GO
        // this.colorDecorations(editors);

        // console.timeEnd("tokenizeDocument");
    }

    private tokenizeLine(index: number, editorInfo: IEditorInfo) {
        // const originalLine = this.document.lineAt(index).text;
        const monoLine = editorInfo.monoText.slice(
            editorInfo.textLinesMap[index],
            editorInfo.textLinesMap[index + 1],
        );
        // console.log(`originalLine->${originalLine}`);
        // tabsIntoSpaces

        // let tabsize = 4;
        // if (typeof editorInfo.editorRef.options.tabSize === "number") {
        //     tabsize = editorInfo.editorRef.options.tabSize;
        // }

        // let preparedLineText = originalLine;

        // if (this.document.eol === 2) {
        //     preparedLineText = preparedLineText.replace(/\r/g, ``); // may be needed, LF, CRLF
        // }

        // preparedLineText = tabsIntoSpaces(preparedLineText, tabsize);

        // if (glo.trySupportDoubleWidthChars) {
        //     preparedLineText = preparedLineText.replace(
        //         doubleWidthCharsReg,
        //         "Z_",
        //     );
        // }

        const newText = monoLine;
        const previousLineRuleStack =
            index > 0 ? this.lines[index - 1].getRuleStack() : undefined;

        const previousLineState =
            index > 0
                ? this.lines[index - 1].cloneState()
                : new LineState(this.settings, this.languageConfig);

        const tokenized = this.languageConfig.grammar.tokenizeLine2(
            newText,
            previousLineRuleStack,
        );
        const tokens = tokenized.tokens;
        const lineTokens = new LineTokens(tokens, newText);

        const matches = new Array<{ content: string; index: number }>();
        const count = lineTokens.getCount();
        for (let i = 0; i < count; i++) {
            const tokenType = lineTokens.getStandardTokenType(i);
            if (!ignoreBracketsInToken(tokenType)) {
                const searchStartOffset = tokens[i * 2];
                const searchEndOffset =
                    i < count ? tokens[(i + 1) * 2] : newText.length;

                const currentTokenText = newText.substring(
                    searchStartOffset,
                    searchEndOffset,
                );

                let result: RegExpExecArray | null;
                // tslint:disable-next-line:no-conditional-assignment
                while (
                    (result =
                        this.languageConfig.regex.exec(currentTokenText)) !==
                    null
                ) {
                    matches.push({
                        content: result[0],
                        index: result.index + searchStartOffset,
                    });
                }
            }
        }

        const newLine = new TextLine(
            tokenized.ruleStack,
            previousLineState,
            index,
        );
        for (const match of matches) {
            const lookup = this.languageConfig.bracketToId.get(match.content);
            if (lookup) {
                newLine.AddToken(
                    match.content,
                    match.index,
                    lookup.key,
                    lookup.open,
                );
            }
        }
        return newLine;
    }

    private disposeScopeDecorations() {
        for (const decoration of this.scopeDecorations) {
            decoration.dispose();
        }

        this.scopeDecorations = [];
    }

    private searchScopeForwards(
        position: vscode.Position,
    ): BracketClose | undefined {
        for (let i = position.line; i < this.lines.length; i++) {
            const endBracket = this.lines[i].getClosingBracket(position);

            if (endBracket) {
                return endBracket;
            }
        }
    }

    private calculateColumnFromCharIndex(
        lineText: string,
        charIndex: number,
        tabSize: number,
    ): number {
        let spacing = 0;
        for (let index = 0; index < charIndex; index++) {
            if (lineText.charAt(index) === "\t") {
                spacing += tabSize - (spacing % tabSize);
            } else {
                spacing++;
            }
        }
        return spacing;
    }

    private calculateCharIndexFromColumn(
        lineText: string,
        column: number,
        tabSize: number,
    ): number {
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
    }
}
