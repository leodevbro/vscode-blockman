# Change Log

All notable changes to the "blockman" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.4.1] - 2021-12-26

-   Fixed z-index mistake

## [1.4.0] - 2021-12-25

-   Added advanced coloring settings (N33 A01, N33 A02, ... N33 A05)
-   Added new quick command "Blockman Toggle Keep Off State After Restarting VSCode"

## [1.3.3] - 2021-11-15

-   Updated optimization notes in README.

## [1.3.2] - 2021-11-11

-   For now, borders support gradients and also "transparent" value,
    backgrounds also support gradients but do not support "transparent" value,
    so if you type "none" in any background field, the color will become
    the same color as the editor background.

## [1.3.1] - 2021-11-11

-   Mostly fixed major bug of coloring

## [1.3.0] - 2021-11-10

-   Added ability in Blockman settings to choose preferred color combos for Dark, Light and High Contrast theme kinds.
-   Borders now support gradient value too, e.g. linear-gradient(to right, red, blue)
-   Added two color combos with gradient borders (Super gradients)
-   Large changes made on the peformance optimization structures

## [1.2.16] - 2021-10-23

-   Updated README.md about the indent guides API.

## [1.2.15] - 2021-10-23

-   Adapted to the indent guides API change of the vscode update

## [1.2.11] - 2021-09-25

-   Minor fix of focus freeze command name

## [1.2.10] - 2021-09-25

-   Fixed selecting incorrect range using 'Select Focus' command when line contains tab characters
-   Focus Freeze is now more resistant: Focus will be in the correct block even if you change something inside or after it.

## [1.2.9] - 2021-09-25

-   Fixed line height issue (The issue was caused by VSCode update)
-   Added command: press F1 and find 'Blockman Select Focused' (selects the text inside focused block)
-   Added command: press F1 and find 'Blockman Toggle Freeze/Unfreeze Focus'

## [1.2.8] - 2021-08-29

-   Updated README file
-   Updated descriptions of Blockman settings
-   Fixed some issues of yaml tokenization

## [1.2.5] - 2021-08-22

-   Yaml language support
-   Increased char number limit on each line from 500 chars to 3000 chars.
-   At the Blockman installation event -> "editor.inlayHints.enabled": false,

## [1.0.1] ... [1.2.0]

-   Non documented changes

## [1.0.0] - 2021-05-28

-   Initial release
