export interface IColorCombo {
    name: string;

    onEachDepth: string[];

    border: string;
    borderOfDepth0: string;
    borderOfFocusedBlock: string;

    focusedBlock: string;
}

export const colorCombos: IColorCombo[] = [
    {
        name: "Classic Dark 1 (Gradients)", // ===============================================

        onEachDepth: [
            `linear-gradient(to right, hsl(0, 0%, 5.7%), hsl(0, 0%, 5%))`,

            `linear-gradient(to right, hsl(0, 0%, 7.1%), hsl(0, 0%, 6.5%))`,
            `linear-gradient(to right, hsl(0, 0%, 9.5%), hsl(0, 0%, 8.5%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,

            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
            `linear-gradient(to right, hsl(0, 0%, 12.8%), hsl(0, 0%, 11.8%))`,
        ],

        border: `hsl(0, 0%, 24%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            // "linear-gradient(to right, hsl(250, 30%, 9%), hsl(219, 25%, 7%))",
            "linear-gradient(to right, hsl(205, 60%, 8%), hsl(210, 20%, 6%))",

        // "hsl(205, 60%, 8%)",

        // "linear-gradient(to right, hsl(212, 31%, 16%), hsl(210, 20%, 6%))",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark 1 (Solid colors)",

        onEachDepth: [
            `hsl(0, 0%, 5.7%)`,

            `hsl(0, 0%, 7.1%)`,
            `hsl(0, 0%, 9.5%)`,
            `hsl(0, 0%, 12.8%)`,
            `hsl(0, 0%, 12.8%)`,
            `hsl(0, 0%, 12.8%)`,

            `hsl(0, 0%, 12.8%)`,
            `hsl(0, 0%, 12.8%)`,
            `hsl(0, 0%, 12.8%)`,
            `hsl(0, 0%, 12.8%)`,
            `hsl(0, 0%, 12.8%)`,
        ],

        border: `hsl(0, 0%, 24%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(205, 60%, 8%)",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark 2 (Gradients)", // ===============================================

        onEachDepth: [
            `hsl(0, 0%, 6.3%)`,

            `hsl(0, 0%, 7.8%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,

            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
        ],

        border: `hsl(0, 0%, 24%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            // "linear-gradient(to right, hsl(250, 30%, 9%), hsl(219, 25%, 7%))",
            "linear-gradient(to right, hsl(205, 60%, 8%), hsl(210, 20%, 6%))",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark 2 (Solid colors)",

        onEachDepth: [
            `hsl(0, 0%, 6.3%)`,

            `hsl(0, 0%, 7.8%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,

            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
            `hsl(0, 0%, 11%)`,
        ],

        border: `hsl(0, 0%, 24%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(205, 60%, 8%)",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark 3 (Gradients)", // ===============================================

        onEachDepth: [
            `linear-gradient(to right, hsl(0, 0%, 5.5%), hsl(0, 0%, 4%))`,

            `linear-gradient(to right, hsl(0, 0%, 8%), hsl(0, 0%, 6.5%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,

            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
            `linear-gradient(to right, hsl(0, 0%, 14%), hsl(0, 0%, 13%))`,
        ],

        border: `hsl(0, 0%, 28%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            // "linear-gradient(to right, hsl(250, 30%, 9%), hsl(219, 25%, 7%))",
            "linear-gradient(to right, hsl(205, 60%, 8%), hsl(210, 20%, 6%))",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark 3 (Solid colors)",

        onEachDepth: [
            `hsl(0, 0%, 5.5%)`,

            `hsl(0, 0%, 8%)`,
            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,

            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,
            `hsl(0, 0%, 14%)`,
        ],

        border: `hsl(0, 0%, 28%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(205, 60%, 8%)",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark Oppo (Gradients)", // ===============================================

        onEachDepth: [
            `hsl(0, 0%, 11%)`,

            `hsl(0, 0%, 9%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,

            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
        ],

        border: `hsl(0, 0%, 22%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            // "linear-gradient(to right, hsl(250, 30%, 9%), hsl(219, 25%, 7%))",
            "linear-gradient(to right, hsl(205, 60%, 8%), hsl(210, 20%, 6%))",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Dark Oppo (Solid colors)",

        onEachDepth: [
            `hsl(0, 0%, 11%)`,

            `hsl(0, 0%, 9%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,

            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
            `hsl(0, 0%, 6%)`,
        ],

        border: `hsl(0, 0%, 22%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(205, 60%, 8%)",

        borderOfFocusedBlock: "hsl(30, 60%, 40%)",
    },

    {
        name: "Classic Light (Gradients)", // ===============================================

        onEachDepth: [
            `linear-gradient(to right, hsl(0, 0%, 100%), hsl(0, 0%, 99%))`,

            `linear-gradient(to right, hsl(0, 0%, 97%), hsl(0, 0%, 96%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,

            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
            `linear-gradient(to right, hsl(0, 0%, 94%), hsl(0, 0%, 92.7%))`,
        ],

        border: `hsl(0, 0%, 80%)`,
        borderOfDepth0: `hsl(220, 70%, 90%)`,

        // focusedBlock: `linear-gradient(to right, hsl(235, 52%, 90%), hsl(218, 35%, 86%))`,
        focusedBlock: `linear-gradient(to right, hsl(202, 90%, 96%), hsl(215, 90%, 95%))`,

        borderOfFocusedBlock: "hsl(212, 90%, 74%)",
    },

    {
        name: "Classic Light (Solid colors)",

        onEachDepth: [
            `hsl(0, 0%, 100%)`,

            `hsl(0, 0%, 97%)`,
            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,

            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,
            `hsl(0, 0%, 94%)`,
        ],

        border: `hsl(0, 0%, 80%)`,
        borderOfDepth0: `hsl(220, 70%, 90%)`,

        focusedBlock: `hsl(202, 90%, 96%)`,

        borderOfFocusedBlock: "hsl(212, 90%, 74%)",
    },

    {
        name: "Oxygen Dark (Gradients)", // ===============================================

        onEachDepth: [
            `linear-gradient(to right, rgb(5,3,14), rgb(5,3,15))`,

            `linear-gradient(to right, rgb(8,4,19), rgb(9,5,21))`,
            `linear-gradient(to right, rgb(11,6,24), rgb(14,8,30))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,

            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
            `linear-gradient(to right, rgb(16,9,33), rgb(21,12,43))`,
        ],

        border: `hsl(262, 30%, 25%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Oxygen Dark (Solid colors)",

        onEachDepth: [
            `rgb(5,3,14)`,

            `rgb(8,4,19)`,
            `rgb(11,6,24)`,
            `rgb(16,9,33)`,
            `rgb(16,9,33)`,
            `rgb(16,9,33)`,

            `rgb(16,9,33)`,
            `rgb(16,9,33)`,
            `rgb(16,9,33)`,
            `rgb(16,9,33)`,
            `rgb(16,9,33)`,
        ],

        border: `hsl(262, 30%, 25%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(231, 15%, 7%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Argon Dark (Gradients)",

        onEachDepth: [
            `linear-gradient(to right, hsl(254, 57%, 4%), hsl(250, 57%, 3.5%))`,

            `linear-gradient(to right, hsl(261, 59%, 6%), hsl(259, 57%, 5%))`,
            `linear-gradient(to right, hsl(269, 62%, 7%), hsl(265, 60%, 6%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,

            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
            `linear-gradient(to right, hsl(275, 60%, 8%), hsl(272, 55%, 7%))`,
        ],

        border: `hsla(287, 67%, 16%, 0.9)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Argon Dark (Solid colors)",

        onEachDepth: [
            `hsl(254, 57%, 4%)`,

            `hsl(261, 59%, 6%)`,
            `hsl(269, 62%, 7%)`,
            `hsl(275, 60%, 8%)`,
            `hsl(275, 60%, 8%)`,
            `hsl(275, 60%, 8%)`,

            `hsl(275, 60%, 8%)`,
            `hsl(275, 60%, 8%)`,
            `hsl(275, 60%, 8%)`,
            `hsl(275, 60%, 8%)`,
            `hsl(275, 60%, 8%)`,
        ],

        border: `hsla(287, 67%, 16%, 0.9)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(231, 15%, 7%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Sapphire (Gradients)",

        onEachDepth: [
            `hsl(208, 30%, 4%)`,

            `hsl(213, 35%, 6%)`,
            `hsl(218, 40%, 8%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,

            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
        ],

        // border: `hsl(240, 50%, 28%)`,
        border: `hsla(240, 70%, 70%, 0.5)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Sapphire (Solid colors)",

        onEachDepth: [
            `hsl(208, 30%, 4%)`,

            `hsl(213, 35%, 6%)`,
            `hsl(218, 40%, 8%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,

            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
            `hsl(228, 45%, 10%)`,
        ],

        // border: `hsl(240, 50%, 28%)`,
        border: `hsla(240, 70%, 70%, 0.5)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(231, 15%, 7%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Satura (Gradients)",

        onEachDepth: [
            `hsl(214, 28%, 5%)`,

            `hsl(216, 28%, 7%)`,
            `hsl(216, 16%, 16%)`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,

            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
        ],

        border: `hsl(235, 15%, 30%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Satura (Solid colors)",

        onEachDepth: [
            `hsl(214, 28%, 5%)`,

            `hsl(216, 28%, 7%)`,
            `hsl(216, 16%, 16%)`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,

            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
            `hsl(216, 14%, 14%`,
        ],

        border: `hsl(235, 15%, 30%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(231, 15%, 7%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Lobelia (Gradients)",

        onEachDepth: [
            `linear-gradient(to right, hsl(205, 55%, 10%), hsl(202, 55%, 8%))`,

            `linear-gradient(to right, hsl(205, 49%, 18%), hsl(205, 49%, 18%))`,
            `linear-gradient(to right, hsl(205, 34%, 18%), hsl(208, 34%, 18%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,

            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
            `linear-gradient(to right, hsl(205, 30%, 14%), hsl(205, 30%, 14%))`,
        ],

        border: `hsl(206, 30%, 30%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Lobelia (Solid colors)",

        onEachDepth: [
            `hsl(205, 55%, 10%)`,

            `hsl(205, 49%, 18%)`,
            `hsl(205, 34%, 18%)`,
            `hsl(205, 30%, 14%)`,
            `hsl(205, 30%, 14%)`,
            `hsl(205, 30%, 14%)`,

            `hsl(205, 30%, 14%)`,
            `hsl(205, 30%, 14%)`,
            `hsl(205, 30%, 14%)`,
            `hsl(205, 30%, 14%)`,
            `hsl(205, 30%, 14%)`,
        ],

        border: `hsl(206, 30%, 30%)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(231, 15%, 7%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Small Galaxy (Gradients)",

        onEachDepth: [
            `linear-gradient(to right, hsl(210, 30%, 7%), hsl(210, 30%, 6%))`,

            `linear-gradient(to right, hsl(230, 30%, 9%), hsl(228, 30%, 8%))`,
            `linear-gradient(to right, hsl(250, 30%, 11%), hsl(248, 30%, 10%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,

            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
            `linear-gradient(to right, hsl(275, 30%, 12%), hsl(272, 30%, 11%))`,
        ],

        border: `hsla(287, 0%, 100%, 0.15)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Small Galaxy (Solid colors)",

        onEachDepth: [
            `hsl(210, 30%, 7%)`,

            `hsl(230, 30%, 9%)`,
            `hsl(250, 30%, 11%)`,
            `hsl(275, 30%, 12%)`,
            `hsl(275, 30%, 12%)`,
            `hsl(275, 30%, 12%)`,

            `hsl(275, 30%, 12%)`,
            `hsl(275, 30%, 12%)`,
            `hsl(275, 30%, 12%)`,
            `hsl(275, 30%, 12%)`,
            `hsl(275, 30%, 12%)`,
        ],

        border: `hsla(287, 0%, 100%, 0.15)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock: "hsl(231, 15%, 7%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Pale Pink (Gradients)",

        onEachDepth: [
            `linear-gradient(to right, hsl(300, 4%, 8.5%), hsl(300, 4%, 7.5%))`,

            `linear-gradient(to right, hsl(300, 4%, 12%), hsl(300, 4%, 10%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,

            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
            `linear-gradient(to right, hsl(300, 4%, 15%), hsl(300, 4%, 13%))`,
        ],

        border: `hsla(287, 0%, 100%, 0.15)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            // "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",
            "linear-gradient(to right, hsl(205, 60%, 8%), hsl(210, 20%, 6%))",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },

    {
        name: "Pale Pink (Solid colors)",

        onEachDepth: [
            `hsl(300, 4%, 8.5%)`,

            `hsl(300, 4%, 12%)`,
            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,

            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,
            `hsl(300, 4%, 15%)`,
        ],

        border: `hsla(287, 0%, 100%, 0.15)`,
        borderOfDepth0: `hsla(0, 0%, 100%, 0.25)`,

        focusedBlock:
            // "linear-gradient(to right, hsl(231, 15%, 7%), hsl(210, 22%, 5%))",
            "hsl(205, 60%, 8%)",

        borderOfFocusedBlock: "hsl(30, 40%, 50%)",
    },
];

// hsl(212, 31%, 16%)
