import React, { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";
import { formatDate } from "Utils/employee";
import { employeeApi } from "Views/Admin/Action/EmployeeAction";

const JobRowModal = ({ show, row, periods, employeeId, onHide, onSaved, notify }) => {
    const [v, setV] = useState({ effective_date: "", job_title: "", position_type: "", employment_type: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!show) return;
        setErrors({});
        setV(row ? { effective_date: row.effective_date, job_title: row.job_title, position_type: row.position_type, employment_type: row.employment_type?._id || "" }
            : { effective_date: "", job_title: "", position_type: "", employment_type: "" });
    }, [show, row]);

    const set = (k) => (val) => { setV((p) => ({ ...p, [k]: val })); setErrors((p) => ({ ...p, [k]: undefined })); };

    const submit = async (e) => {
        e.preventDefault();
        const found = {};
        if (!v.effective_date) found.effective_date = "Effective date is required";
        if (!v.job_title.trim()) found.job_title = "Job title is required";
        setErrors(found);
        if (Object.keys(found).length) return;
        setSaving(true);
        try {
            const saved = row ? await employeeApi.updateJob(employeeId, row._id, v) : await employeeApi.createJob(employeeId, v);
            notify(row ? "Job detail updated successfully" : "Job detail added successfully");
            onSaved(saved, !!row);
            onHide();
        } catch (err) { notify(err.message, "error"); }
        finally { setSaving(false); }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={row ? "Edit Job Detail" : "Add Job Detail"} titleId="emp-job-title" busy={saving}
            footer={<>
                <button type="button" className="emp-btn emp-btn--outline" onClick={onHide} disabled={saving}>Cancel</button>
                <button type="submit" form="emp-job-form" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </>}>
            <form id="emp-job-form" className="emp-grid" onSubmit={submit} noValidate>
                <FieldControl id="emp-job-date" label="Effective Date" type="date" required value={v.effective_date} onChange={set("effective_date")} error={errors.effective_date} />
                <FieldControl id="emp-job-name" label="Job Title" required value={v.job_title} onChange={set("job_title")} error={errors.job_title} maxLength={80} />
                <FieldControl id="emp-job-pos" label="Position Type" value={v.position_type} onChange={set("position_type")} maxLength={60} />
                <FieldControl id="emp-job-emp" label="Employment Type" type="dropdown" options={periods.map((p) => ({ value: p._id, label: p.name }))} value={v.employment_type} onChange={set("employment_type")} />
            </form>
        </EmployeeModal>
    );
};

// "Job Details" table (design 06).
const JobDetailsCard = ({ section, employeeId, periods, canEdit, onChange, onConfirmDelete, notify }) => {
    const [modal, setModal] = useState({ open: false, row: null });
    const rows = section.rows || [];

    const saved = (row, isEdit) => onChange(isEdit ? rows.map((r) => (r._id === row._id ? row : r)) : [row, ...rows]);

    return (
        <section className="emp-section" aria-label={section.name}>
            <div className="emp-section__head">
                <h3 className="emp-section__title">{section.name}</h3>
                {canEdit ? <div className="emp-section__actions"><button type="button" className="emp-iconbtn" aria-label="Add a job detail" title="Add a job detail" onClick={() => setModal({ open: true, row: null })}><FiPlus aria-hidden="true" /></button></div> : null}
            </div>
            <div className="emp-tablewrap">
                <table className="emp-table">
                    <thead>
                        <tr><th scope="col">Effective Date</th><th scope="col">Job Title</th><th scope="col">Position Type</th><th scope="col">Employment Type</th><th scope="col">Action</th>{canEdit ? <th scope="col"><span className="visually-hidden">Actions</span></th> : null}</tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? <tr><td colSpan={canEdit ? 5 : 4} className="emp-muted emp-table__empty">No job details yet.</td></tr> : rows.map((r) => (
                            <tr key={r._id}>
                                <td>{formatDate(r.effective_date)}</td><td>{r.job_title}</td><td>{r.position_type || "-"}</td><td>{r.employment_type?.name || "-"}</td>
                                {canEdit ? (
                                    <td className="emp-table__actions">
                                        <button type="button" className="emp-iconbtn emp-iconbtn--tiny" aria-label={`Edit job detail ${r.job_title}`} onClick={() => setModal({ open: true, row: r })}><FiEdit2 aria-hidden="true" /></button>
                                        <button type="button" className="emp-iconbtn emp-iconbtn--tiny emp-iconbtn--danger" aria-label={`Delete job detail ${r.job_title}`} onClick={() => onConfirmDelete(r)}><FiTrash2 aria-hidden="true" /></button>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <JobRowModal show={modal.open} row={modal.row} periods={periods} employeeId={employeeId} onHide={() => setModal({ open: false, row: null })} onSaved={saved} notify={notify} />
        </section>
    );
};

export default JobDetailsCard;
