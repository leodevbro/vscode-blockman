export const atInstallEventMessage = `Blockman recommends for better experience to change these 7 items in VS Code settings. Would you try it now?

{
    // ...
    "editor.inlayHints.enabled": "off",
    "editor.guides.indentation": false,
    "editor.guides.bracketPairs": false,
    "editor.wordWrap": "off",
    "diffEditor.wordWrap": "off",

    "workbench.colorCustomizations": {
        // ...
        "editor.lineHighlightBorder": "#9fced11f",
        "editor.lineHighlightBackground": "#1073cf2d"
    }
}

`;

export enum OptionsAtInstall {
    yes = "Yeah, let's set those settings",
    no = "No, thanks",
}
