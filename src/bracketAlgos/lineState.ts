import { Position } from "vscode";
import Bracket from "./bracket";
import BracketClose from "./bracketClose";
import ColorMode from "./colorMode";
import IBracketManager from "./IBracketManager";
import LanguageConfig from "./languageConfig";
import MultipleBracketGroups from "./multipleIndexes";
import Settings from "./settings";
import SingularBracketGroup from "./singularIndex";
import Token from "./token";

export default class LineState {
    private readonly bracketManager: IBracketManager;
    private previousBracketColor: string | undefined;
    private readonly settings: Settings;
    private readonly languageConfig: LanguageConfig;

    constructor(
        settings: Settings,
        languageConfig: LanguageConfig,
        previousState?: {
            readonly colorIndexes: IBracketManager;
            readonly previousBracketColor: string;
        },
    ) {
        this.settings = settings;
        this.languageConfig = languageConfig;

        let cM = 1;

        if (previousState !== undefined) {
            this.bracketManager = previousState.colorIndexes;
            this.previousBracketColor = previousState.previousBracketColor;
        } else {
            switch (cM) {
                case 0:
                    this.bracketManager = new SingularBracketGroup(settings);
                    break;
                case 1:
                    this.bracketManager = new MultipleBracketGroups(
                        settings,
                        languageConfig,
                    );
                    break;
                default:
                    throw new RangeError("Not implemented enum value");
            }
        }
    }

    public getBracketHash() {
        return this.bracketManager.getHash();
    }

    public cloneState(): LineState {
        const clone = {
            colorIndexes: this.bracketManager.copyCumulativeState(),
            previousBracketColor: this.previousBracketColor as string,
        };

        return new LineState(this.settings, this.languageConfig, clone);
    }

    public getClosingBracket(position: Position): BracketClose | undefined {
        return this.bracketManager.getClosingBracket(position);
    }

    public offset(startIndex: number, amount: number) {
        this.bracketManager.offset(startIndex, amount);
    }

    public addBracket(
        type: number,
        character: string,
        beginIndex: number,
        lineIndex: number,
        open: boolean,
    ) {
        const token = new Token(type, character, beginIndex, lineIndex);
        if (open) {
            this.addOpenBracket(token);
        } else {
            this.addCloseBracket(token);
        }
    }

    public getAllBrackets(): Bracket[] {
        return this.bracketManager.getAllBrackets();
    }

    private addOpenBracket(token: Token) {
        this.bracketManager.addOpenBracket(token, 0);
    }

    private addCloseBracket(token: Token) {
        this.bracketManager.addCloseBracket(token);
    }
}
