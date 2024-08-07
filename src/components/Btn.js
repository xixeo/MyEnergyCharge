import React from "react";

export default function Btn({
    caption,
    btnColor,
    color,
    btnRound,
    btnBorder,
    borderColor,
    handleClick,
    customClass
}) {
    const bg = {
        blue: "bg-blue-500",
        orange: "bg-orange-300",
        red: "bg-red-300",
    };

    const bgHover = {
        blue: "hover:bg-blue-500",
        orange: "hover:bg-orange-500",
        red: "hover:bg-red-500",
    };

    const round = {
        "r-0": "rounded-none",
        "r-sm": "rounded",
        "r-md": "rounded-md",
        "r-lg": "rounded-lg",
        "r-f": "rounded-full",
    };

    const borderW = {
        "b-0": "border-0",
        "b-1": "border",
    };

    return (
        <button
            onClick={handleClick}
            className={`
                                    inline-flex justify-center items-center 
                                    ${bg[btnColor]}
                                    text-${color}
                                    ${bgHover[btnColor]}
                                    ${round[btnRound]}
                                    ${borderW[btnBorder]}
                                    border-${borderColor}
                                    ${customClass}
                                    `}
        >
            {caption}
        </button>
    );
}
