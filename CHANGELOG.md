# Change Log

All notable changes to the "blockman" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.7.8] - 2024-10-04

-   Fix extension activation error because of the latest update (1.94.0) changes of VS Code

## [1.7.7] - 2024-04-20

-   Fix "Rightmost Edge Of Viewport" of right side base rendering

## [1.7.6] - 2024-02-01

-   Add ability to make black list of file formats act as a white list.
        Just type '^' (caret symbol) at the left of the list, and it will become a white list.
        Like this: '^ typescript, typescriptreact'

-   Now Blockman will try to fill spaces caused by codeLens annotations.
        Well, VS Code has a limitation about rendering the block as an entire block div,
        So, Blockman renders div boxes for each line, and it creates an illusion of one big div block.
        But as the codeLens annotations create spaces between lines, it acts as a visual breaker of the nice illusion of big block.
        So, now, Blockman is trying to find the locations of the codeLens annotations, and then to fill those spaces to unbreak the illusion of a nice big div block.

## [1.7.5] - 2023-07-11

-   Add to settings:
        n27B01 Hide Block Of Focused Single Line Area

## [1.7.4] - 2023-05-04

-   Add settings for max char count limit of any line in any file.
    "blockman.n36A01MaxCharCountInAnyLine", Default is 3000.
    Blockman will not work in a file if the file has at least one line with N (or more) number of chars. Default is 3000.

## [1.7.3] - 2023-04-30

-   Add two new settings for border thickness:
        "blockman.n34A01BorderThicknessOfNonFocusedBlock",
        "blockman.n34A02BorderThicknessOfFocusedBlock",

-   Add setting for recommendation dialog:
        "n35A01DisableRecommendationDialog"

## [1.7.2] - 2023-03-17

-   Add remote support when running in VS Code server
-   Add video intro link in README

## [1.7.0] - 2023-01-15

-   The F1 command: "Blockman Toggle Enable/Disable" will no longer show/hide indent guides".
-   New F1 command: "Blockman Toggle Enable/Disable And Force Show/Hide Indent Guides".
-   No more forced change of VS Code settings at the install event. Now user can decide with a dialog.
-   Removed F1 command: "Blockman Toggle Disable/Enable Automatic Showing/Hiding Indent Guides"
-   Removed F1 command: "Blockman Toggle Keep Off State After Restarting VS Code"

## [1.6.4] - 2022-11-10

-   Major improvement of Ruby langauge support

## [1.6.3] - 2022-11-08

-   Critical bug-fix for Ruby langauge

## [1.6.0] - 2022-11-01

-   Added Support for Ruby langauge

## [1.5.9] - 2022-06-12

-   Added Sponsor Button

## [1.5.8] - 2022-05-07

-   Minor correction of README

## [1.5.7] - 2022-03-22

-   Added support for SQL begin/end blocks. Big thanks to zelixir.

## [1.5.6] - 2022-02-21

-   Added double-width chars for generally used Korean characters

## [1.5.5] - 2022-02-19

-   Changed default border-radius from 5px to 6px.
-   updated README

## [1.5.4] - 2022-02-05

-   Added "border-only" instrucion in README
-   Minor improvements

## [1.5.0] - 2022-01-18

-   Added 3 settings: n04Sub04, n04Sub05 and n04Sub06. These settings are about right side padding.
        User now can define min distance between right side edges,
        also user now can define additional right side padding, and also right side base strategy.

## [1.4.7] - 2022-01-09

-   Updated donation info

## [1.4.6] - 2022-01-07

-   Added new quick command "Blockman Toggle Disable/Enable Automatic Showing/Hiding Indent Guides"

## [1.4.5] - 2022-01-03

-   Fixed mouse wheel zoom behavior
-   Removed the quick commands of height zooming (because no more needed)

## [1.4.2] - 2022-01-02

-   Added quick commands ('Blockman Zoom Line Height' and 'Blockman Unzoom Line Height') to adjust line height with zoom levels

## [1.4.1] - 2021-12-26

-   Fixed z-index mistake

## [1.4.0] - 2021-12-25

-   Added advanced coloring settings (N33 A01, N33 A02, ... N33 A05)
-   Added new quick command "Blockman Toggle Keep Off State After Restarting VS Code"

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

-   Adapted to the indent guides API change of the VS Code update

## [1.2.11] - 2021-09-25

-   Minor fix of focus freeze command name

## [1.2.10] - 2021-09-25

-   Fixed selecting incorrect range using 'Select Focus' command when line contains tab characters
-   Focus Freeze is now more resistant: Focus will be in the correct block even if you change something inside or after it.

## [1.2.9] - 2021-09-25

-   Fixed line height issue (The issue was caused by VS Code update)
-   Added command: press F1 and find 'Blockman Select Focused' (selects the text inside focused block)
-   Added command: press F1 and find 'Blockman Toggle Freeze/Unfreeze Focus'

## [1.2.8] - 2021-08-29

-   Updated README file
-   Updated descriptions of Blockman settings
-   Fixed some issues of yaml tokenization

## [1.2.5] - 2021-08-22

-   Yaml language support
-   Increased char number limit on each line from 500 chars to 3000 chars.
-   At the Blockman installation event -> "editor.inlayHints.enabled": false (now "off"),

## [1.0.1] ... [1.2.0]

-   Non documented changes

## [1.0.0] - 2021-05-28

-   Initial release
