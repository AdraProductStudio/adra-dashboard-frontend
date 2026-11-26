import React, { useEffect, useState } from "react";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";

// Single-input dialog: "Add New Menu" (tab), "Add New Section", renames.
const NameModal = ({ show, title, label = "Name", initial = "", onSave, onHide }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (show) { setName(initial); setError(""); } }, [show, initial]);

    const submit = async (e) => {
        e.preventDefault();
        const v = name.trim();
        if (!v) return setError(`${label} is required`);
        if (v.length > 60) return setError(`${label} must not exceed 60 characters`);
        setSaving(true);
        try { await onSave(v); onHide(); } catch (err) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={title} titleId="emp-name-title" size="md" busy={saving} className="emp-modal--small">
            <form onSubmit={submit} noValidate>
                <FieldControl id="emp-name-input" label={label} value={name} onChange={(v) => { setName(v); setError(""); }} error={error} maxLength={60} />
                <div className="emp-actions emp-actions--split">
                    <button type="button" className="emp-btn emp-btn--outline" onClick={onHide} disabled={saving}>Cancel</button>
                    <button type="submit" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                </div>
            </form>
        </EmployeeModal>
    );
};

export default NameModal;
