/* eslint-disable @typescript-eslint/naming-convention */
export type tyPrim = number | string | boolean | null | undefined;
export type tyBranchable =
    | (tyBranchable | tyPrim)[]
    | { [key: string]: tyBranchable | tyPrim };

export const isPrim = (value: any): boolean => {
    // if (typeof value === "object" && value !== null) {
    //     return false;
    // } else {
    //     return true;
    // }

    if (
        [null, undefined].includes(value) ||
        ["string", "number", "boolean"].includes(typeof value)
    ) {
        return true;
    } else {
        return false;
    }
};

/*
export const json_dfsPre_recurs_v1 = (root: tyBranchable | tyPrim): tyPrim[] => {
    const recursFn = (item: tyBranchable | tyPrim, listInp: tyPrim[]): void => {
        if (isPrim(item)) {
            listInp.push(item as tyPrim);
            return;
        }

        const branches = Object.values(item as tyBranchable);

        for (const branch of branches) {
            recursFn(branch, listInp);
        }
    };

    const list: tyPrim[] = [];
    recursFn(root, list);
    return list;
};

*/
