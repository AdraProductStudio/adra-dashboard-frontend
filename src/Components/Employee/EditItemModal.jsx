import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";

// "Edit tab" / "Edit section": rename + delete. Default items can only be renamed; custom items can be deleted here.
const EditItemModal = ({ show, title, label = "Name", initial = "", isDefault, onSave, onDelete, onHide }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    useEffect(() => { if (show) { setName(initial); setError(""); } }, [show, initial]);

    const submit = async (e) => {
        e.preventDefault();
        const v = name.trim();
        if (!v) return setError(`${label} is required`);
        if (v.length > 60) return setError(`${label} must not exceed 60 characters`);
        if (v === initial) return onHide();
        setSaving(true);
        try { await onSave(v); onHide(); } catch (err) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={title} titleId="emp-edit-item-title" size="md" busy={saving} className="emp-modal--small">
            <form onSubmit={submit} noValidate>
                <FieldControl id="emp-edit-item-name" label={label} value={name} onChange={(v) => { setName(v); setError(""); }} error={error} maxLength={60} />
                <div className="emp-actions emp-actions--between">
                    {isDefault || !onDelete ? <span /> : <button type="button" className="emp-btn emp-btn--danger-outline" onClick={onDelete} disabled={saving}><FiTrash2 aria-hidden="true" /> Delete</button>}
                    <span className="emp-actions__right">
                        <button type="button" className="emp-btn emp-btn--outline" onClick={onHide} disabled={saving}>Cancel</button>
                        <button type="submit" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                    </span>
                </div>
            </form>
        </EmployeeModal>
    );
};

export default EditItemModal;
