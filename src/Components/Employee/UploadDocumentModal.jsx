import React, { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";
import { DOCUMENT_EXTENSIONS, DOCUMENT_MAX_BYTES, formatSize, todayIso, validateFile } from "Utils/employee";

// "Upload Document" (design 07). With `document` it replaces the file / edits name and date.
const UploadDocumentModal = ({ show, document: doc, onHide, onSubmit }) => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [drag, setDrag] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!show) return;
        setName(doc?.name || ""); setDate(doc?.submitted_date || todayIso()); setFile(null); setErrors({}); setDrag(false);
    }, [show, doc]);

    const pick = (f) => {
        if (!f) return;
        const msg = validateFile(f, { extensions: DOCUMENT_EXTENSIONS, maxBytes: DOCUMENT_MAX_BYTES, label: "Document" });
        setErrors((p) => ({ ...p, file: msg || undefined }));
        setFile(msg ? null : f);
    };

    const submit = async (e) => {
        e.preventDefault();
        const found = {};
        if (!name.trim()) found.name = "Document name is required";
        if (!date) found.date = "Date is required";
        if (!file && !doc) found.file = "Please choose a file to upload";
        setErrors((p) => ({ ...found, file: found.file || p.file }));
        if (Object.keys(found).length || (errors.file && !file && !doc)) return;
        setSaving(true);
        try { await onSubmit({ name: name.trim(), submitted_date: date, file }); onHide(); }
        catch (err) { setErrors({ file: err.message }); }
        finally { setSaving(false); }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={doc ? "Replace Document" : "Upload Document"} titleId="emp-doc-title" size="md" busy={saving} className="emp-modal--small">
            <form onSubmit={submit} noValidate>
                <FieldControl id="emp-doc-name" label="Document Name" value={name} onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined })); }} error={errors.name} maxLength={100} />
                <FieldControl id="emp-doc-date" label="Date" type="date" value={date} onChange={(v) => { setDate(v); setErrors((p) => ({ ...p, date: undefined })); }} error={errors.date} />
                <div className="emp-field">
                    <div
                        className={`emp-drop${drag ? " emp-drop--active" : ""}${errors.file ? " emp-drop--error" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
                    >
                        <FiUpload aria-hidden="true" />
                        <div>
                            <p className="emp-drop__title">
                                {file ? `${file.name} (${formatSize(file.size)})` : <>Drag &amp; drop your file or <button type="button" className="emp-link" onClick={() => inputRef.current?.click()}>Browse</button></>}
                            </p>
                            <p className="emp-drop__hint">Format: {DOCUMENT_EXTENSIONS.join(", ")} &amp; Max file size: {Math.round(DOCUMENT_MAX_BYTES / 1048576)} MB</p>
                        </div>
                        <input ref={inputRef} type="file" className="visually-hidden" aria-label="Choose a document" tabIndex={-1}
                            accept={DOCUMENT_EXTENSIONS.map((x) => `.${x}`).join(",")} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
                    </div>
                    {errors.file ? <p className="emp-field__error" role="alert">{errors.file}</p> : null}
                </div>
                <div className="emp-actions emp-actions--split">
                    <button type="button" className="emp-btn emp-btn--outline" onClick={onHide} disabled={saving}>Cancel</button>
                    <button type="submit" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? "Uploading..." : "Upload"}</button>
                </div>
            </form>
        </EmployeeModal>
    );
};

export default UploadDocumentModal;
