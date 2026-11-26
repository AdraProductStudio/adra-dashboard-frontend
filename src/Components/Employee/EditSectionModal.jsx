import React, { useEffect, useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";
import { employeeApi } from "Views/Admin/Action/EmployeeAction";
import { validateFieldValue } from "Utils/employee";

// Edit modal of a section card (design 04): renders whatever fields the section has, with the right control per type.
const EditSectionModal = ({ show, resetKey, section, employeeId, onHide, onSaved, onDeleteFields, notify }) => {
    const [draft, setDraft] = useState({});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [selecting, setSelecting] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => { setDraft({}); setErrors({}); setSelecting(false); setSelected([]); }, [resetKey]);
    if (!section) return null;

    const fields = section.fields || [];
    const valueOf = (f) => (Object.prototype.hasOwnProperty.call(draft, f._id) ? draft[f._id] : f.value);

    const stopSelecting = () => { setSelecting(false); setSelected([]); };
    const toggle = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

    const removeSelected = async () => {
        if (saving || !selected.length) return;
        setSaving(true);
        try {
            await onDeleteFields(selected);
            setDraft((p) => Object.fromEntries(Object.entries(p).filter(([k]) => !selected.includes(k))));
            stopSelecting();
        } catch (err) { notify(err.message, "error"); }
        finally { setSaving(false); }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (selecting) return removeSelected();
        if (saving) return;
        const found = {};
        fields.forEach((f) => { const touched = Object.prototype.hasOwnProperty.call(draft, f._id); if (!f.read_only && (touched || f.value)) { const m = validateFieldValue(f, valueOf(f)); if (m) found[f._id] = m; } });
        setErrors(found);
        if (Object.keys(found).length) return;
        if (!Object.keys(draft).length) return onHide();
        setSaving(true);
        try {
            const saved = await employeeApi.saveValues(employeeId, section._id, draft);
            notify("Details saved successfully");
            onSaved(saved);
            onHide();
        } catch (err) { notify(err.message, "error"); }
        finally { setSaving(false); }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={section.name} titleId="emp-edit-section-title" busy={saving}
            headerExtra={onDeleteFields && fields.length ? (
                <button type="button" className={`emp-iconbtn emp-iconbtn--danger${selecting ? " emp-iconbtn--active" : ""}`} aria-pressed={selecting}
                    aria-label={selecting ? "Cancel field selection" : "Select fields to delete"} title={selecting ? "Cancel selection" : "Delete fields"}
                    onClick={() => (selecting ? stopSelecting() : setSelecting(true))} disabled={saving}>
                    {selecting ? <FiX aria-hidden="true" /> : <FiTrash2 aria-hidden="true" />}
                </button>
            ) : null}
            footer={<>
                <button type="button" className="emp-btn emp-btn--outline" onClick={selecting ? stopSelecting : onHide} disabled={saving}>Cancel</button>
                {selecting
                    ? <button type="submit" form="emp-section-form" className="emp-btn emp-btn--danger" disabled={saving || !selected.length}>{saving ? "Deleting..." : `Delete${selected.length ? ` (${selected.length})` : ""}`}</button>
                    : <button type="submit" form="emp-section-form" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>}
            </>}>
            <form id="emp-section-form" className="emp-grid" onSubmit={submit} noValidate>
                {fields.map((f) => (
                    <div className={`emp-field-wrap${selecting ? " emp-field-wrap--select" : ""}${selected.includes(f._id) ? " is-selected" : ""}`} key={f._id}>
                        {selecting && !f.is_system ? (
                            <input type="checkbox" className="emp-field-check" checked={selected.includes(f._id)} disabled={saving}
                                onChange={() => toggle(f._id)} aria-label={`Select ${f.label}`} />
                        ) : null}
                        <div className="emp-field-wrap__control">
                            <FieldControl id={`emp-sec-${f._id}`} label={f.label} type={f.type} required={f.required} options={f.options} disabled={f.read_only || selecting}
                                value={valueOf(f)} error={errors[f._id]}
                                onChange={(v) => { setDraft((p) => ({ ...p, [f._id]: v })); setErrors((p) => ({ ...p, [f._id]: undefined })); }} />
                        </div>
                    </div>
                ))}
                {fields.length === 0 ? <p className="emp-muted">This section has no fields yet. Use + on the section card to add one.</p> : null}
            </form>
        </EmployeeModal>
    );
};

export default EditSectionModal;
