import React, { forwardRef } from "react";

const InputBox = forwardRef(
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
            placeholder,
            unit = "",
            handleBlur,
            selRef, // select용 ref
            inRef, // input용 ref
            disabled,
        },
        ref
    ) => {
        const onChange = (e) => {
            if (handleChange) {
                handleChange(e);
            }
        };

        const onBlur = () => {
            if (unit && value && !value.endsWith(unit)) {
                const updatedValue = `${value} ${unit}`;
                if (handleChange) {
                    handleChange({ target: { value: updatedValue } });
                }
            }
            if (handleBlur) {
                handleBlur();
            }
        };

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
                        type="date"
                        min={min}
                        max={max}
                        ref={inRef || ref} // `ref`를 `input`에 직접 연결
                        value={value}
                        disabled={disabled}
                        className={`lg:min-w-32 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={onChange}
                    />
                ) : type === "datetime" ? (
                    <input
                        id={id}
                        type="datetime-local"
                        min={min}
                        max={max}
                        ref={inRef || ref} // `ref`를 `input`에 직접 연결
                        value={value}
                        disabled={disabled}
                        className={`lg:min-w-25 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={onChange}
                    />
                ) : type === "dropDown" ? (
                    <select
                        id={id}
                        ref={selRef || ref} // `ref`를 `select`에 직접 연결
                        value={value}
                        disabled={disabled}
                        className={`min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={onChange}
                    >
                        {initText && (
                            <option value="" disabled hidden>
                                {initText}
                            </option>
                        )}
                        {opTags}
                    </select>
                ) : type === "textArea" ? (
                    <textarea
                        id={id}
                        ref={inRef || ref} // `ref`를 `textarea`에 직접 연결
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`w-full focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#cdcdcd] ${customClass}`}
                    />
                ) : (
                    <input
                        id={id}
                        type="text" // 기본 input type을 지정
                        ref={inRef || ref} // `ref`를 `input`에 직접 연결
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        className={`h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                    />
                )}
            </div>
        );
    }
);

export default InputBox;
