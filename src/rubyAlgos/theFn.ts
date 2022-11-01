// eslint-disable-next-line @typescript-eslint/naming-convention
const RubyParser = require("ruby_parser");
import { IEditorInfo } from "../extension";
import { findLineZeroAndInLineIndexZero, IPositionEachZero } from "../utils";
import { isPrim, tyBranchable, tyPrim } from "../utils3";

// eslint-disable-next-line @typescript-eslint/naming-convention
const json_dfsPre_recurs_ast = (
    root: tyBranchable,
    editorInfo: IEditorInfo,
): IPositionEachZero[] => {
    const recursFn = (
        item: tyBranchable | tyPrim,
        listInp: IPositionEachZero[],
    ): void => {
        if (isPrim(item)) {
            // listInp.push(item as tyPrim);
            return;
        }

        const branches = Object.entries(item as tyBranchable);

        for (const [branchKey, branchVal] of branches) {
            if (["body", "if_true"].includes(branchKey)) {
                const begin: number = (branchVal as any).expression_l.begin - 1;
                const end: number = (branchVal as any).expression_l.end;

                const { lineZero: beginLZ, inLineIndexZero: beginIIZ } =
                    findLineZeroAndInLineIndexZero({
                        globalIndexZero: begin,
                        editorInfo,
                    });

                const { lineZero: endLZ, inLineIndexZero: endIIZ } =
                    findLineZeroAndInLineIndexZero({
                        globalIndexZero: begin,
                        editorInfo,
                    });

                // ----------------

                listInp.push(
                    {
                        type: "s",
                        globalIndexZero: begin,
                        lineZero: beginLZ,
                        inLineIndexZero: beginIIZ,
                    },
                    {
                        type: "e",
                        globalIndexZero: end,
                        lineZero: endLZ,
                        inLineIndexZero: endIIZ,
                    },
                );
            }
            recursFn(branchVal, listInp);
        }
    };

    const list: IPositionEachZero[] = [];
    recursFn(root, list);
    return list;
};

const rubyParserObj = new RubyParser();

export const rubyFn = (
    rubyTextInput: string,
    editorInfo: IEditorInfo,
): IPositionEachZero[] => {
    const initialAst = rubyParserObj.parse({ rubyString: rubyTextInput });

    const statementsArr = initialAst.statements;

    let mySuperList: IPositionEachZero[] = [];

    try {
        mySuperList = json_dfsPre_recurs_ast(statementsArr, editorInfo);
    } catch (err) {
        console.log("error while tokenizing Ruby file");
        console.log(err);
    }

    // console.log("daaaa");
    // console.log(rubyParserObj.getAst());

    return mySuperList;
};
