# Change Log

All notable changes to the "blockman" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.2.16] - 2021-10-29

-   Added ability in Blockman settings to choose preferred color combos for Dark, Light and High Contrast theme kinds.

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
