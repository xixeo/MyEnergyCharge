export default function TailInput({ id, type, inRef, customClass }) {
    const today = new Date().toISOString().slice(0, 10);
    return (
        <div>
            {type === 'date' ? (
                <input
                    type={type}
                    defaultValue={today}
                    id={id}
                    ref={inRef}
                    className={customClass}
                />
            ) : (
                <input
                    type={type}
                    id={id}
                    ref={inRef}
                    className={customClass}
                />
            )}
        </div>
    );
}
