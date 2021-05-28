import * as vscode from "vscode";
// import { TagStylerConfig } from "./tagStyler";

const extensionId = "highlight-matching-tag";
const defaultEmptyElements = [
    // "div",
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];

interface ConfigurationOptions {
    context: vscode.ExtensionContext;
    onEditorChange: (e: vscode.TextEditor) => void;
}

class Configuration {
    private get config() {
        const editor = vscode.window.activeTextEditor;
        return vscode.workspace.getConfiguration(
            extensionId,
            editor && editor.document.uri,
        );
    }

    get isEnabled() {
        return !!this.config.get("enabled");
    }

    get highlightSelfClosing() {
        // return !!this.config.get("highlightSelfClosing");
        return false;
    }

    get highlightFromContent() {
        return !!this.config.get("highlightFromContent");
        // return false;
    }

    get highlightFromName() {
        return !!this.config.get("highlightFromName");
    }

    get highlightFromAttributes() {
        return !!this.config.get("highlightFromAttributes");
    }

    get showPath() {
        return !!this.config.get("showPath");
    }

    get showRuler() {
        return !!this.config.get("showRuler");
    }

    get emptyElements() {
        const defaultEmptyTags = this.config.get("noDefaultEmptyElements")
            ? []
            : defaultEmptyElements;
        const customEmptyTags =
            this.config.get<string[]>("customEmptyElements") || [];
        return [...defaultEmptyTags, ...customEmptyTags];
    }

    // get styles() {
    //     return this.config.get<TagStylerConfig>("styles");
    // }

    get hasOldSettings() {
        return !!(
            this.config.get("style") ||
            this.config.get("leftStyle") ||
            this.config.get("rightStyle") ||
            this.config.get("beginningStyle") ||
            this.config.get("endingStyle")
        );
    }

    // public configure({ context, onEditorChange }: ConfigurationOptions) {
    //     context.subscriptions.push(
    //         vscode.window.onDidChangeActiveTextEditor(onEditorChange, this),
    //     );
    // }
}

const configuration = new Configuration();
export { defaultEmptyElements };
export default configuration;
