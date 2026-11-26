import React from "react";
import { FiCalendar, FiChevronDown, FiImage } from "react-icons/fi";

// One labelled control. type: input | dropdown | date | file. The label is tied to the control with htmlFor/id and
// errors are announced through aria-describedby.
const FieldControl = ({ id, label, type = "input", value, onChange, options = [], required, error, disabled, placeholder, accept, fileName, maxLength, inputMode }) => {
    const describedBy = error ? `${id}-error` : undefined;
    const common = { id, disabled, "aria-invalid": !!error, "aria-describedby": describedBy, "aria-required": required || undefined };

    let control;
    if (type === "dropdown") {
        control = (
            <div className="emp-control__wrap">
                <select {...common} className="emp-control emp-control--select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
                    <option value="">{placeholder || ""}</option>
                    {options.map((o) => {
                        const v = typeof o === "string" ? o : o.value;
                        const l = typeof o === "string" ? o : o.label;
                        return <option key={v} value={v}>{l}</option>;
                    })}
                </select>
                <FiChevronDown className="emp-control__icon" aria-hidden="true" />
            </div>
        );
    } else if (type === "date") {
        control = (
            <div className="emp-control__wrap">
                <input {...common} type="date" className="emp-control emp-control--date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} min="1900-01-01" max="2100-12-31" />
                <FiCalendar className="emp-control__icon" aria-hidden="true" />
            </div>
        );
    } else if (type === "file") {
        control = (
            <div className="emp-control__wrap">
                <input {...common} type="file" accept={accept} className="emp-control__file" onChange={(e) => onChange(e.target.files?.[0] || null)} />
                <label htmlFor={id} className="emp-control emp-control--file" aria-hidden="true">
                    <span className="emp-control__filename">{fileName || ""}</span>
                </label>
                <FiImage className="emp-control__icon" aria-hidden="true" />
            </div>
        );
    } else {
        control = <input {...common} type="text" className="emp-control" value={value ?? ""} placeholder={placeholder} maxLength={maxLength} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} autoComplete="off" />;
    }

    return (
        <div className="emp-field">
            <label htmlFor={id} className="emp-field__label">{label}{required ? <span className="emp-field__req" aria-hidden="true"> *</span> : null}</label>
            {control}
            {error ? <p id={`${id}-error`} className="emp-field__error" role="alert">{error}</p> : null}
        </div>
    );
};

export default FieldControl;
