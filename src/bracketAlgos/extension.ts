// this file is just a sample of the main file of vscode extention.
import * as vscode from "vscode";
import {
    commands,
    ExtensionContext,
    window,
    workspace,
    extensions,
} from "vscode";
import DocumentDecorationManager from "./documentDecorationManager";

export function activate(context: ExtensionContext) {
    let documentDecorationManager = new DocumentDecorationManager();

    extensions.onDidChange(() => restart());

    context.subscriptions.push(
        commands.registerCommand(
            "bracket-pair-colorizer-2.expandBracketSelection",
            () => {},
        ),

        commands.registerCommand(
            "bracket-pair-colorizer-2.undoBracketSelection",
            () => {},
        ),

        workspace.onDidChangeConfiguration((event) => {
            if (
                event.affectsConfiguration("bracket-pair-colorizer-2") ||
                event.affectsConfiguration("editor.lineHeight") ||
                event.affectsConfiguration("editor.fontSize")
            ) {
                restart();
            }
        }),

        vscode.window.onDidChangeVisibleTextEditors(() => {
            documentDecorationManager.updateAllDocuments();
        }),
        workspace.onDidChangeTextDocument((event) => {
            if (event.contentChanges.length > 0) {
                // documentDecorationManager.onDidChangeTextDocument(event);
            }
        }),
        workspace.onDidCloseTextDocument((event) => {
            documentDecorationManager.onDidCloseTextDocument(event);
        }),
        workspace.onDidOpenTextDocument((event) => {
            // documentDecorationManager.onDidOpenTextDocument(event);
        }),
        vscode.window.onDidChangeTextEditorSelection((event) => {}),
    );

    documentDecorationManager.updateAllDocuments();

    function restart() {
        documentDecorationManager.Dispose();
        documentDecorationManager = new DocumentDecorationManager();
        documentDecorationManager.updateAllDocuments();
    }
}

// tslint:disable-next-line:no-empty
export function deactivate() {}
