import ScopePair from "./scopePair";

export default class LanguageDefinition {
    public readonly language: string | undefined;
    public readonly extends?: string;
    public readonly scopes?: ScopePair[];
}
