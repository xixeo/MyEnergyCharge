import React from "react";

// React.forwardRef를 사용하여 ref를 전달받는 컴포넌트를 생성
const InputBox = React.forwardRef(
    (
        {
            labelText,
            labelClass,
            id,
            type,
            customClass,
            ops = [],
            initText,
            handleChange,
            min,
            max,
            value,
            idx,
            placeholder
        },
        ref
    ) => {
        const today = new Date().toISOString().slice(0, 10);
        const opTags = ops.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
        ));

        return (
            <div className="w-auto">
                {labelText && (
                    <label
                        htmlFor={id}
                        className={`text-[#222] font-semibold text-sm ${labelClass}`}
                    >
                        {labelText}
                    </label>
                )}
                {type === "date" ? (
                    <input
                        id={id}
                        type={type}
                        min={min}
                        max={max}
                        defaultValue={today}
                        ref={ref}
                        value={value}
                        className={`lg:min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={handleChange}
                    />
                ) : type === "dropDown" ? (
                    <select
                        id={id}
                        ref={ref}
                        value={value}
                        className={`min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={handleChange}
                    >
                        <option value="">{initText}</option>
                        {opTags}
                    </select>
                ) : type === "textArea" ? (
                    <textarea
                        id={id}
                        key={idx}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#cdcdcd] ${customClass}`}
                    />
                ) : (
                    <input
                        id={id}
                        ref={ref}
                        className={`lg:min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                    />
                )}
            </div>
        );
    }
);

export default InputBox;
