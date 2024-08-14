import React, { forwardRef, useEffect } from "react";
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
            inRef,  // input용 ref
        },
        ref
    ) => {
        useEffect(() => {
            if (ref && typeof ref === 'function') {
                ref(ref.current);
            }
        }, [ref]);

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
                        ref={inRef || ref}  // `ref`를 `input`에 연결
                        value={value}
                        className={`lg:min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={onChange}
                    />
                ) :  type === "datetime" ? (
                    <input
                        id={id}
                        type="datetime-local"
                        min={min}
                        max={max}
                        ref={inRef || ref}  // `ref`를 `input`에 연결
                        value={value}
                        className={`lg:min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={onChange}
                    />
                )  :type === "dropDown" ? (
                    <select
                        id={id}
                        ref={selRef || ref}  // `ref`를 `select`에 연결
                        value={value}
                        className={`min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                        onChange={onChange}
                    >
                        <option value="">{initText}</option>
                        {opTags}
                    </select>
                ) : type === "textArea" ? (
                    <textarea
                        id={id}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`w-full focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#cdcdcd] ${customClass}`}
                    />
                ) : (
                    <input
                        id={id}
                        ref={inRef || ref}
                        value={value}                        
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`lg:min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4] ${customClass}`}
                    />
                )}
            </div>
        );
    }
);

export default InputBox;
