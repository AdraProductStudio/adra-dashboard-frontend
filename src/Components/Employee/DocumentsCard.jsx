import React, { useState } from "react";
import { FiDownload, FiEye, FiTrash2, FiUpload } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import UploadDocumentModal from "./UploadDocumentModal";
import { employeeApi } from "Views/Admin/Action/EmployeeAction";
import { formatDate, openFileUrl } from "Utils/employee";

// "Personal Documents" table (design 07): download, replace, view and delete per row.
const DocumentsCard = ({ section, employeeId, canEdit, onChange, onConfirmDelete, onRename, onEditSection, onDelete, notify }) => {
    const [modal, setModal] = useState({ open: false, doc: null });
    const docs = section.documents || [];

    const submit = async (payload) => {
        if (modal.doc) {
            const updated = await employeeApi.updateDocument(employeeId, modal.doc._id, payload);
            onChange(docs.map((d) => (d._id === updated._id ? updated : d)));
            notify("Document updated successfully");
        } else {
            const created = await employeeApi.uploadDocument(employeeId, section._id, payload);
            onChange([created, ...docs]);
            notify("Document uploaded successfully");
        }
    };

    const open = async (d, disposition) => {
        try {
            const link = await employeeApi.documentLink(employeeId, d._id, disposition);
            await openFileUrl(link.url, { download: disposition === "attachment", fileName: link.file_name });
        } catch (err) { notify(err.message, "error"); }
    };

    return (
        <section className="emp-section" aria-label={section.name}>
            <SectionHeader title={section.name} canEdit={canEdit} isSystem={section.is_system}
                onAdd={() => setModal({ open: true, doc: null })} addLabel={`Upload a document to ${section.name}`}
                onEdit={!section.is_system ? onEditSection : undefined} editLabel={`Edit ${section.name}`} onRename={onRename} onDelete={!section.is_system ? onDelete : undefined} />
            <div className="emp-tablewrap">
                <table className="emp-table">
                    <thead><tr><th scope="col">Document Name</th><th scope="col">Document Submitted Date</th><th scope="col" className="emp-table__actions-head">Action</th></tr></thead>
                    <tbody>
                        {docs.length === 0 ? <tr><td colSpan={3} className="emp-muted emp-table__empty">No documents uploaded yet.</td></tr> : docs.map((d) => (
                            <tr key={d._id}>
                                <td>{d.name}</td>
                                <td>{formatDate(d.submitted_date)}</td>
                                <td className="emp-table__actions">
                                    <button type="button" className="emp-iconbtn emp-iconbtn--tiny" aria-label={`Download ${d.name}`} title="Download" onClick={() => open(d, "attachment")}><FiDownload aria-hidden="true" /></button>
                                    {canEdit ? <button type="button" className="emp-iconbtn emp-iconbtn--tiny" aria-label={`Replace ${d.name}`} title="Replace" onClick={() => setModal({ open: true, doc: d })}><FiUpload aria-hidden="true" /></button> : null}
                                    <button type="button" className="emp-iconbtn emp-iconbtn--tiny emp-iconbtn--blue" aria-label={`View ${d.name}`} title="View" onClick={() => open(d, "inline")}><FiEye aria-hidden="true" /></button>
                                    {canEdit ? <button type="button" className="emp-iconbtn emp-iconbtn--tiny emp-iconbtn--danger" aria-label={`Delete ${d.name}`} title="Delete" onClick={() => onConfirmDelete(d)}><FiTrash2 aria-hidden="true" /></button> : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UploadDocumentModal show={modal.open} document={modal.doc} onHide={() => setModal({ open: false, doc: null })} onSubmit={submit} />
        </section>
    );
};

export default DocumentsCard;
