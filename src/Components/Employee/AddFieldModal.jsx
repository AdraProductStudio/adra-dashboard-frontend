import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";

const TYPES = [{ value: "input", label: "Input" }, { value: "dropdown", label: "Dropdown" }, { value: "date", label: "Date" }];

// "Add New Field" (design 05) extended with Field Type and dropdown options. Fields are optional to fill in; the label is required.
// With `field` it edits label / options / required (the type of an existing field cannot change).
const AddFieldModal = ({ show, field, onSave, onHide }) => {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("input");
    const [options, setOptions] = useState([]);
    const [optionText, setOptionText] = useState("");
    const [value, setValue] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const editing = !!field;
    const mapped = editing && field.source !== "stored"; // built-in mapped fields: only the label is editable

    useEffect(() => {
        if (!show) return;
        setLabel(field?.label || ""); setType(field?.type || "input"); setOptions(field?.options || []);
        setOptionText(""); setValue(""); setErrors({});
    }, [show, field]);

    const addOption = () => {
        const o = optionText.trim();
        if (!o) return;
        if (o.length > 60) return setErrors((p) => ({ ...p, options: "An option must not exceed 60 characters" }));
        if (options.includes(o)) return setErrors((p) => ({ ...p, options: "This option already exists" }));
        if (options.length >= 50) return setErrors((p) => ({ ...p, options: "A dropdown can have at most 50 options" }));
        setOptions([...options, o]); setOptionText(""); setErrors((p) => ({ ...p, options: undefined }));
    };

    const submit = async (e) => {
        e.preventDefault();
        const found = {};
        if (!label.trim()) found.label = "Field label is required";
        else if (label.trim().length > 60) found.label = "Field label must not exceed 60 characters";
        if (!editing && type === "input" && value.trim().length > 500) found.value = "Field data must not exceed 500 characters";
        if (type === "dropdown" && !mapped && options.length === 0) found.options = "Add at least one dropdown option";
        setErrors(found);
        if (Object.keys(found).length) return;
        setSaving(true);
        try { await onSave({ label: label.trim(), type, options: type === "dropdown" ? options : [], required: true, ...(!editing && type === "input" ? { value: value.trim() } : {}) }); onHide(); }
        catch (err) { setErrors({ label: err.message }); }
        finally { setSaving(false); }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={editing ? "Edit Field" : "Add New Field"} titleId="emp-field-title" size="md" busy={saving} className="emp-modal--small">
            <form onSubmit={submit} noValidate>
                <FieldControl id="emp-field-label" label="Field Label" value={label} onChange={(v) => { setLabel(v); setErrors((p) => ({ ...p, label: undefined })); }} error={errors.label} maxLength={60} />
                <FieldControl id="emp-field-type" label="Field Type" type="dropdown" options={TYPES} value={type} onChange={setType} disabled={editing} />
                {!editing && type === "input" ? (
                    <FieldControl id="emp-field-value" label="Field Data (optional)" value={value} onChange={(v) => { setValue(v); setErrors((p) => ({ ...p, value: undefined })); }} error={errors.value} maxLength={500} placeholder="Leave empty to fill in later" />
                ) : null}
                {type === "dropdown" && !mapped ? (
                    <div className="emp-field">
                        <label htmlFor="emp-field-option" className="emp-field__label">Dropdown Options</label>
                        <div className="emp-options__add">
                            <input id="emp-field-option" className="emp-control" value={optionText} maxLength={60} placeholder="Type an option"
                                onChange={(e) => setOptionText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); } }} />
                            <button type="button" className="emp-btn emp-btn--outline emp-btn--compact" onClick={addOption}>Add</button>
                        </div>
                        <ul className="emp-options" aria-label="Dropdown options">
                            {options.map((o) => (
                                <li key={o} className="emp-chip">{o}
                                    <button type="button" aria-label={`Remove option ${o}`} onClick={() => setOptions(options.filter((x) => x !== o))}><FiX aria-hidden="true" /></button>
                                </li>
                            ))}
                        </ul>
                        {errors.options ? <p className="emp-field__error" role="alert">{errors.options}</p> : null}
                    </div>
                ) : null}
                <div className="emp-actions emp-actions--split">
                    <button type="button" className="emp-btn emp-btn--outline" onClick={onHide} disabled={saving}>Cancel</button>
                    <button type="submit" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                </div>
            </form>
        </EmployeeModal>
    );
};

export default AddFieldModal;
