export default function InputBox({
    labelText, 
    labelClass, 
    id,
    type,
    inRef,
    customClass,
    ops = [],
    selRef,
    initText,
    handleChange,
    min,
    max,
}) {
    const today = new Date().toISOString().slice(0, 10);
    const opTags = ops.map((item) => (
        <option key={item} value={item} >
            {item}
        </option>
    ));

    return (
        <div className="w-auto">
             {labelText && (
                <label htmlFor={id}
                 className={`text-[#222] font-semibold text-sm
                    ${labelClass}`}
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
                    ref={inRef}
                    className={`lg:min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4]
                        ${customClass}`}
                    onChange={handleChange}
                />
            ) : type === "dropDown" ? (
                <select
                    id={id}
                    ref={selRef}
                    className={`min-w-40 h-[30px] focus:outline-0 focus:border-[#5582e2] focus:border-2 border rounded p-1 text-sm border-[#E4E4E4]
                        ${customClass}`}
                    onChange={handleChange}
                >
                    <option defaultValue="">{initText}</option>
                    {opTags}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    ref={inRef}
                    className={customClass}
                />
            )}
        </div>
    );
}
