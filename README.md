[![](https://vsmarketplacebadge.apphb.com/version-short/leodevbro.blockman.svg)](https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman)
[![](https://vsmarketplacebadge.apphb.com/installs-short/leodevbro.blockman.svg)](https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/leodevbro.blockman.svg)](https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman)
[![](https://vsmarketplacebadge.apphb.com/rating-short/leodevbro.blockman.svg)](https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman)

<p><strong><a href="#donation">Donation</a></strong> is really appreciated. Blockman is a hard work of many months. My name is <a href="https://leodevbro.github.io">Levan Katsadze (ლევან კაცაძე)</a>, 1995-03-03, from Tbilisi, <a href="https://en.wikipedia.org/wiki/Georgia_(country)">Georgia (Not USA)</a>.</p>

<p><strong>Support (With PayPal):</strong> <a href="https://www.buymeacoffee.com/leodevbro">https://www.buymeacoffee.com/leodevbro</a></p>

<br />
<br />
<br />

<p><strong>For better experience:</strong> Blockman <strong>WILL CHANGE</strong> these 7 items in VSCode settings (only one-time at the installation event). You can change them again when you want. These 7 settings are very non-vital, so maybe you don't even need to backup them first.</p>

```jsonc
// settings.json (User/Global config, not Workspace config)
// To open this file in VSCode, press F1, type 'settings json' and choose 'Preferences: Open Settings (JSON)'
{
    // ...
    "editor.inlayHints.enabled": false,
    "editor.renderIndentGuides": false, // old API for indent guides
    "editor.guides.indentation": false, // new API for indent guides
    "editor.wordWrap": "off",
    "diffEditor.wordWrap": "off",

    "workbench.colorCustomizations": {
        // ...
        "editor.lineHighlightBorder": "#9fced11f",
        "editor.lineHighlightBackground": "#1073cf2d"
    }
}
```

<br />

<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/still-image/icon-prod/blockman-icon-128---png.png"
  alt="VSCode Blockman Icon"
  width="128px"
/></p>
<h3 align="center" style="color: hsl(262, 90%, 45%);"><strong>Blockman</strong></h3>
<p align="center">VSCode Extension For Nested Block Highlighting</p>

<p align="center"><em>You can toggle enable/disable: Press F1 and then type "blockman toggle".</em></p>
<p align="center"><em>Also You can go to Blockman settings and set Black List Of File Formats to disable Blockman for certain files.</em></p>
  
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/still-image/infograph/intro-before-after---png.png"
  alt="alt text testing"
/></p>
  
<p>Animated PNG:</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/main-demo---c2-apng.png"
  alt="alt text testing"
/></p>
  
<p>Supported programming languages:</p>
<p><strong>Non-indentation based languages:</strong> JavaScript, JSX, TypeScript, TSX, C, C#, C++, Java, PHP, R, Go (Golang), Dart, Rust, Swift, PowerShell, SQL, HTML, CSS, LESS, SCSS and more...</p>
<p><strong>Indentation based languages:</strong> currently Python and Yaml.</p>

<br />

If you use <strong>double width</strong> characters like these Chinese characters: `字符串最大字符串最`, then you may want to run the experimental command to support such characters. Press `F1` and type the command name: `Blockman Toggle Try Support Double Width Chars`.

<br />
  
<p align="center">Python code:</p>

<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/python-demo---c2-apng.png"
  alt="alt text testing"
/></p>

<br />

<h1 align="center">Blockman settings</h1>
  
<p align="center">You can change nesting depth</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/depth---c2-apng.png"
  alt="alt text testing"
/></p>
  
<br />
  
<p align="center">You can choose color combos</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/color-combos---c2-apng.png"
  alt="alt text testing"
/></p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/still-image/infograph/color-combos---png.png"
  alt="alt text testing"
/></p>
  
<br />
  
<p align="center">You can change color of each depth</p>
<p align="center">Colors can be any CSS color value: red, green... rgb(), hsl(), linear-gradient()...</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/custom-depth-colors---c2-apng.png"
  alt="alt text testing"
/></p>
  
<br />
  
<p align="center">You can change focused block colors and general border color</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/focus-colors-and-general-border-color---c2-apng.png"
  alt="alt text testing"
/></p>

<br />
  
<p align="center">You can change basis of block analysis</p>
<p align="center">(Curly brackets, square brackets, round brackets, tags, indentation)</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/based-on-bracket-types---c2-apng.png"
  alt="alt text testing"
/></p>
  
<br />
  
<p align="center">Currently only Python and Yaml are supported from indentation based languages</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/indent-tokens---c2-apng.png"
  alt="alt text testing"
/></p>
<p>You can provide other tokenizer algorithms and we can add them into this extension, so Blockman will be able to highlight blocks based on different or more advanced logic, or add support for other indentation based languages.</p>
  
<br />
  
<p align="center">You can disable rendering single line blocks</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/settings/single-line-block---c2-apng.png"
  alt="alt text testing"
/></p>

<br />

<h1 align="center">All Blockman quick commands</h1>

```
Press F1 and find "Blockman Toggle Enable/Disable"
Press F1 and find "Blockman Select Focused" (Select text inside focused block)
Press F1 and find "Blockman Toggle Freeze/Unfreeze Focus"
Press F1 and find "Blockman Toggle Try Support Double Width Chars (e.g. Chinese)"
```

<br />

<h1 align="center">All Blockman settings</h1>

```jsonc
// settings.json (User/Global config, not Workspace config)
// To open this file in VSCode, press F1, type 'settings json' and choose 'Preferences: Open Settings (JSON)'

// Each item is with default value
{
    // ...
    "blockman.n03MaxDepth": 12, // -1 is no blocks, 0 is ground block, 1 is first depth blocks, 2 is second depth blocks
    "blockman.n04ColorComboPreset": "Classic Dark 1 (Gradients)",

    "blockman.n05CustomColorOfDepth0": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.

    "blockman.n06CustomColorOfDepth1": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n07CustomColorOfDepth2": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n08CustomColorOfDepth3": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n09CustomColorOfDepth4": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n10CustomColorOfDepth5": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.

    "blockman.n11CustomColorOfDepth6": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n12CustomColorOfDepth7": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n13CustomColorOfDepth8": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n14CustomColorOfDepth9": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.
    "blockman.n15CustomColorOfDepth10": "", // Any CSS color, e.g. rgb, rgba, hsl. Type 'none' for transparent.

    "blockman.n16EnableFocus": true, // Highlight block differently if caret is inside it.
    "blockman.n17CustomColorOfFocusedBlock": "", // Requires 'Enable Focus' to be true/enabled. Type 'same' if you want it to be same color as if not focused.
    "blockman.n18CustomColorOfFocusedBlockBorder": "", // Requires 'Enable Focus' to be true/enabled. Type 'same' if you want it to be same color as if not focused.
    "blockman.n19CustomColorOfBlockBorder": "",
    "blockman.n20CustomColorOfDepth0Border": "",

    "blockman.n21BorderRadius": 5,
    "blockman.n22AnalyzeCurlyBrackets": true, // Render blocks inside curly brackets {}, keep in mind: the parser/tokenizer will ignore brackets inside comments, inside strings and inside some other areas.
    "blockman.n23AnalyzeSquareBrackets": false, // Render blocks inside square brackets [], keep in mind: the parser/tokenizer will ignore brackets inside comments, inside strings and inside some other areas.
    "blockman.n24AnalyzeRoundBrackets": false, // Render blocks inside Round brackets (), keep in mind: the parser/tokenizer will ignore brackets inside comments, inside strings and inside some other areas.
    "blockman.n25AnalyzeTags": true, // Render blocks inside HTML/XML/JSX/TSX tags <tag></tag>, keep in mind: the parser/tokenizer will ignore tags inside comments, inside strings and inside some other areas.

    "blockman.n26AnalyzeIndentDedentTokens": true, // This option affects only files of indentation based languages like Python. Currently only Python and Yaml are supported for indentation analysis. Keep in mind: the parser/tokenizer will ignore indentations inside comments, inside strings and inside some other areas.
    "blockman.n27AlsoRenderBlocksInsideSingleLineAreas": false, // {I am a single line area} <p>Me too</p>. Focused single line block will still be rendered even if this setting is off.

    "blockman.n28TimeToWaitBeforeRerenderAfterLastChangeEvent": 1.2, // (Seconds). For optimization: enter more time for slow computers. Less than 0.05 is NOT recommended even for fast computers.
    "blockman.n29TimeToWaitBeforeRerenderAfterLastFocusEvent": 0.2, // (Seconds). For optimization: enter more time for slow computers. Less than 0.2 is NOT recommended because double-clicking may become problematic.
    "blockman.n30TimeToWaitBeforeRerenderAfterLastScrollEvent": 0.1, // (Seconds). For optimization: enter more time for slow computers. Less than 0.05 is NOT recommended even for fast computers.
    "blockman.n31RenderIncrementBeforeAndAfterVisibleRange": 22, // Less is faster because less blocks will be rendered outside the viewport but scrolling may become less comfortable. If less than 1 (e.g. -5), the blocks will render in limited area.

    "blockman.n32BlackListOfFileFormats": "plaintext, markdown, " // Disable blockman for certain file formats, e.g. plaintext, markdown, css, less, scss, html, json, jsonc, typescriptreact, typescript, javascriptreact, javascript, python, go, dart, php, c, csharp, cpp, java.
}
```

<br />

<h1 align="center">Things to consider</h1>
  
<p>1) Each line of code must have less than 3000 characters, otherwise blocks will not be rendered in entire file.</p>

<p>2) Please don't use non-monospace font. Use only monospace font like 'Oxygen Mono', '<a href="https://bpgfonts.wordpress.com/2017/12/21/bpg-2017-dejavu-sansmono/">BPG 2017 DejaVu Sans Mono</a>' or other. Block-rendering is based on equal character-frame-widths, because pixel locations of characters <a href="https://github.com/microsoft/vscode/issues/118994">is not accessible</a> through VSCode API.</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/still-image/infograph/monospace-font---png.png"
  alt="alt text testing"
/></p>

```
Just for the information, the letter "ლ" is Georgian alphabet character,
like: ა, ბ, გ, დ, ე, ვ, ზ, თ, ი, კ, ლ, მ, ნ, ო, პ, ჟ, რ, ს, ტ, უ, ფ, ქ, ღ, ყ, შ, ჩ, ც, ძ, წ, ჭ, ხ, ჯ, ჰ.
```

<p>3) If you want to use mix of multiple fonts (like in the image above), Please don't use any non-monospace font. Use monospace fonts which have at least almost same width of character. For example: 'Oxygen Mono' and '<a href="https://bpgfonts.wordpress.com/2017/12/21/bpg-2017-dejavu-sansmono/">BPG 2017 DejaVu Sans Mono</a>' have not only equal char frame width by themselves alone, but also almost equal char frame width to each other.</p>
  
<p><strong>For Georgian (ქართული) language oriented developers:</strong> without multiple font mixing, just <a href="https://bpgfonts.wordpress.com/2017/12/21/bpg-2017-dejavu-sansmono/">BPG 2017 DejaVu Sans Mono</a> as a single font seems fine for me, and maybe you can use it too. I think it is the one and only monospace font which has English and Georgian lowercase letters, as well as <a href="https://www.unicode.org/charts/script/chart_Georgian.html">Georgian CAPITAL (uppercase) letters</a>.</p>

<p><strong>For English language oriented developers:</strong> the same statement above goes here.</p>

<br />

<p>4) If you want to use ligatured monospace font like "Fira Code" (Typographic ligatures are when multiple characters appear to combine into a single character), please make sure that the font maintains the text width on every line with ligatures like there were no ligatures. "Fira Code" seems fine, and maybe most of ligatured monospace fonts are fine.<br />

</p>
  
<p>5) Recommended to turn off word wrap. Blocks will not render properly if there is any word wrapping.</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/word-wrap---c2-apng.png"
  alt="alt text testing"
/></p>
  
<br />

<p>6) Recommended to turn off "Editor: Guides: Indentation" (new) / "Editor: Render Indent Guides" (old).</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/indent-guide---c2-apng.png"
  alt="alt text testing"
/></p>
  
<br />

<p>7) Recommended to set pale color (e.g. pale blue) to lineHighlightBorder and lineHighlightBackground like this:</p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/video/line-hl---c2-apng.png"
  alt="alt text testing"
/></p>
<p align="center"><img
  src="https://raw.githubusercontent.com/leodevbro/vscode-blockman/main/demo-media/still-image/infograph/line-hl---png.png"
  alt="alt text testing"
/></p>

```jsonc
// settings.json
// To open this file (as global config) in VSCode, press F1, type 'settings json' and choose 'Preferences: Open Settings (JSON)'
{
    // ...
    "workbench.colorCustomizations": {
        // ...
        "editor.lineHighlightBorder": "#9fced11f",
        "editor.lineHighlightBackground": "#1073cf2d",

        // Or for specific vscode themes:
        "[Default Dark+]": {
            // ...
            // "editor.lineHighlightBorder": "#9fced11f"
            // "editor.lineHighlightBackground": "#1073cf2d",
        },
        "[Abyss]": {
            // ...
            // "editor.lineHighlightBorder": "#9fced11f",
            // "editor.lineHighlightBackground": "#1073cf2d"
        }
    }
}
```

<br />

<h1>Optimization Notes</h1>
<p>Optimization is taken very seriously, half of the work is dedicated just for the optimization. The source code is full of logic which prevents many unnecessary block re-renderings.</p>
  
<p>File analysis needs super short time, so it's not a big problem. The main problem is that the vscode block rendering functions (<strong>vscode.window.createTextEditorDecorationType</strong> and <strong>setDecorations</strong>) are very slow, and I cannot touch its internal code, because it's just an API of VSCode. So, almost all optimization algorithms are trying to prevent as many unnecessary block renderings as possible. For example, when scrolling, blocks are rendered into only newly visible code, and the blocks which are already visible, stay there and does not rerender.</p>

<br />

<h1>Big thanks to these source codes</h1>
<p><a href="https://github.com/CoenraadS/Bracket-Pair-Colorizer-2">Bracket Pair Colorizer 2</a> (by CoenraadS)</p>
<p><a href="https://github.com/vincaslt/vscode-highlight-matching-tag">Highlight Matching Tag</a> (by vincaslt)</p>
<p><a href="https://github.com/DTStack/dt-python-parser">dt-python-parser</a> (by DTStack)</p>

<br />

<h1>Also Big thanks</h1>
<p>From 1.1.0 version, manual setup of line height and char width is not needed anymore, thanks to <a href="https://github.com/microsoft/vscode/issues/125341">alexdima (Alexandru Dima)</a>.</p>
<p>From 1.2.0 version, the problem of block-rendering widths at the locations of Color Decorators have been fixed for most of monospace fonts. Thanks to <a href="https://stackoverflow.com/questions/68020444/how-to-get-positions-of-all-css-color-decorators-with-vscode-api">rioV8</a> from stackoverflow.</p>

<br />

<h1>Published In:</h1>
<p>Github repository: <a href="https://github.com/leodevbro/vscode-blockman">https://github.com/leodevbro/vscode-blockman</a></p>
<p>Marketplace: <a href="https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman">https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman</a></p>
<p>Open VSX: <a href="https://open-vsx.org/extension/leodevbro/blockman">https://open-vsx.org/extension/leodevbro/blockman</a></p>

<br />

<h1 id="donation">Donation</h1>
<p><strong>Buy Me A Coffee (With PayPal):</strong> <a href="https://www.buymeacoffee.com/leodevbro">https://www.buymeacoffee.com/leodevbro</a></p>
<p><strong>Bitcoin:</strong> bc1qfc068aq6lhrl58l6cf4wk7nsjy44gnk23uwl2y</p>
<p><strong>Etherium:</strong> 0xFDE2574549aB7b2d57C7c1beef6d15FB2416E811</p>
  
<p><strong>Bank account (USD):</strong> GE08TB7774936615100013 (TBCBGE22)</p>
<p><strong>Bank account (GEL/Lari):</strong> GE18TB7774936515100011 (TBCBGE22)</p>
