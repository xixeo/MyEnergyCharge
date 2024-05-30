import React from "react";

export default function SelectBox({
    id,
    ops,
    selRef,
    initText,
    handleChange,
    customClass,
}) {
    const opTags = ops.map((item) => (
        <option key={item} value={item}>
            {item}
        </option>
    ));

    return (
        <select id={id} ref={selRef} className={customClass} onChange={handleChange}>
            <option defaultValue="">{initText}</option>
            {opTags}
        </select>
    );
}
