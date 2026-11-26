import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { FiCamera, FiChevronDown, FiChevronLeft, FiMail, FiMoreHorizontal, FiPhone, FiPlus, FiTrash2, FiUserPlus } from "react-icons/fi";
import useCommonState, { useCustomNavigate, useDispatch } from "ResuableFunctions/CustomHooks";
import Avatar from "Components/Employee/Avatar";
import ConfirmDialog from "Components/Employee/ConfirmDialog";
import NameModal from "Components/Employee/NameModal";
import EditItemModal from "Components/Employee/EditItemModal";
import AddFieldModal from "Components/Employee/AddFieldModal";
import EditSectionModal from "Components/Employee/EditSectionModal";
import FieldSectionCard from "Components/Employee/FieldSectionCard";
import JobDetailsCard from "Components/Employee/JobDetailsCard";
import DocumentsCard from "Components/Employee/DocumentsCard";
import EmployeeFormModal from "Components/Employee/EmployeeFormModal";
import { employeeApi, handleGetEmployeeLookups, handleGetEmployeeTemplate, toast } from "Views/Admin/Action/EmployeeAction";
import { setEmployeeTemplate } from "Views/Admin/Slice/EmployeeSlice";
import { PHOTO_EXTENSIONS, PHOTO_MAX_BYTES, formatLongDate, periodBadgeClass, validateFile } from "Utils/employee";

const EmployeeDetails = () => {
    const { employee_id: employeeId } = useParams();
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();
    const { commonState } = useCommonState();
    const canEdit = commonState?.user_role === "admin"; // UI hint only: the API enforces the role again
    const { template, templateLoading, templateError, lookups } = useSelector((s) => s.employeeState);
    const notify = useCallback((message, type = "success") => dispatch(toast(message, type)), [dispatch]);

    const [employee, setEmployee] = useState(null);
    const [empState, setEmpState] = useState({ loading: true, error: "" });
    const [tabId, setTabId] = useState(null);
    const [tabData, setTabData] = useState({ loading: false, error: "", sections: [] });
    const [modal, setModal] = useState(null); // { type, ... }
    const [busy, setBusy] = useState(false);
    const [editSeq, setEditSeq] = useState(0); // bumps each time the section edit dialog is opened fresh
    const photoInput = useRef(null);
    const photoMenuRef = useRef(null);
    const [photoMenu, setPhotoMenu] = useState(false);
    useEffect(() => {
        if (!photoMenu) return undefined;
        const onDown = (e) => { if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) setPhotoMenu(false); };
        const onKey = (e) => { if (e.key === "Escape") setPhotoMenu(false); };
        document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
    }, [photoMenu]);

    // ------------------------------------------------------------ loading
    const loadEmployee = useCallback(async (quiet) => {
        if (!quiet) setEmpState({ loading: true, error: "" });
        try { setEmployee(await employeeApi.get(employeeId)); setEmpState({ loading: false, error: "" }); }
        catch (err) { if (!quiet) setEmpState({ loading: false, error: err.message }); }
    }, [employeeId]);

    // The first tab is requested together with the employee and the tab list ("first" is resolved by the API), so nothing waits
    // on anything else. Visited tabs are cached and shown instantly while a quiet refresh runs, so switching tabs feels immediate.
    const tabReq = useRef(0); // ignore responses from an older tab/employee request
    const tabCache = useRef({});
    const loadTab = useCallback(async (id, { quiet = false } = {}) => {
        if (!id) return;
        const req = ++tabReq.current;
        if (!quiet) setTabData({ loading: true, error: "", sections: [] });
        try {
            const d = await employeeApi.tabData(employeeId, id);
            if (req !== tabReq.current) return;
            tabCache.current[d.tab._id] = d.sections;
            setTabId(d.tab._id);
            setTabData({ loading: false, error: "", sections: d.sections });
        } catch (err) { if (req === tabReq.current) setTabData({ loading: false, error: err.message, sections: quiet ? tabCache.current[id] || [] : [] }); }
    }, [employeeId]);

    const selectTab = useCallback((id) => {
        setTabId(id);
        const cached = tabCache.current[id];
        if (cached) { setTabData({ loading: false, error: "", sections: cached }); loadTab(id, { quiet: true }); }
        else loadTab(id);
    }, [loadTab]);

    useEffect(() => {
        tabCache.current = {};
        setTabId(null);
        setTabData({ loading: true, error: "", sections: [] });
        loadEmployee(false);
        loadTab("first");
        dispatch(handleGetEmployeeTemplate(employeeId));
        dispatch(handleGetEmployeeLookups());
    }, [dispatch, loadEmployee, loadTab, employeeId]);

    // keep the cache in step with local edits (add / delete / save)
    useEffect(() => { if (tabId && !tabData.loading && !tabData.error) tabCache.current[tabId] = tabData.sections; }, [tabId, tabData]);

    // ------------------------------------------------------------ local state helpers (immediate UI updates)
    const patchSection = (sectionId, fn) => setTabData((p) => ({ ...p, sections: p.sections.map((s) => (s._id === sectionId ? fn(s) : s)) }));
    const patchTemplate = (fn) => dispatch(setEmployeeTemplate(fn(template)));
    const patchTemplateSection = (sectionId, fn) => patchTemplate((t) => t.map((tab) => ({ ...tab, sections: tab.sections.map((s) => (s._id === sectionId ? fn(s) : s)) })));
    const activeTab = template.find((t) => t._id === tabId);
    const sectionById = (id) => tabData.sections.find((s) => s._id === id);
    const close = () => setModal(null);

    const run = async (fn, okMessage, next = null) => {
        setBusy(true);
        try { await fn(); if (okMessage) notify(okMessage); setModal(next); }
        catch (err) { notify(err.message, "error"); }
        finally { setBusy(false); }
    };

    // ------------------------------------------------------------ tabs / sections / fields
    const addTab = async (name) => {
        const tab = await employeeApi.createEmployeeTab(employeeId, name);
        patchTemplate((t) => [...t, { ...tab, sections: [] }]);
        tabCache.current[tab._id] = [];
        setTabId(tab._id);
        setTabData({ loading: false, error: "", sections: [] });
        notify("Tab created successfully");
    };
    const renameTab = async (name) => {
        const tab = await employeeApi.renameEmployeeTab(employeeId, modal.tab._id, name);
        patchTemplate((t) => t.map((x) => (x._id === tab._id ? { ...x, name: tab.name } : x)));
        notify("Tab updated successfully");
    };
    const deleteTab = () => run(async () => {
        await employeeApi.deleteEmployeeTab(employeeId, modal.tab._id);
        const rest = template.filter((t) => t._id !== modal.tab._id);
        patchTemplate(() => rest);
        delete tabCache.current[modal.tab._id];
        if (rest[0]) selectTab(rest[0]._id); else { setTabId(null); setTabData({ loading: false, error: "", sections: [] }); }
    }, "Tab deleted successfully");

    // A new tab / section is created for every employee (each gets its own copy); deleting one removes it from every employee.
    const addSection = async (name) => {
        const s = await employeeApi.createEmployeeSection(employeeId, tabId, name);
        setTabData((p) => ({ ...p, sections: [...p.sections, s.kind === "documents" ? { ...s, documents: [] } : s.kind === "job_table" ? { ...s, rows: [] } : { ...s, fields: [] }] }));
        notify("Section created successfully");
    };
    const renameSection = async (name) => {
        const s = await employeeApi.renameEmployeeSection(employeeId, modal.section._id, name);
        patchSection(s._id, (x) => ({ ...x, name: s.name }));
        patchTemplateSection(s._id, (x) => ({ ...x, name: s.name }));
        notify("Section updated successfully");
    };
    const deleteSection = () => run(async () => {
        const id = modal.section._id;
        await employeeApi.deleteEmployeeSection(employeeId, id);
        setTabData((p) => ({ ...p, sections: p.sections.filter((s) => s._id !== id) }));
    }, "Section deleted successfully");

    const saveField = async (payload) => {
        const { sectionId, field } = modal;
        if (field) {
            const f = await employeeApi.updateField(field._id, payload);
            patchSection(sectionId, (s) => ({ ...s, fields: s.fields.map((x) => (x._id === f._id ? { ...x, ...f } : x)) }));
            patchTemplateSection(sectionId, (s) => ({ ...s, fields: s.fields.map((x) => (x._id === f._id ? f : x)) }));
            notify("Field updated successfully");
        } else {
            const { value = "", ...def } = payload;
            const f = await employeeApi.createEmployeeField(employeeId, { section_id: sectionId, ...def });
            let saved = "";
            if (value) { // optional data typed in the dialog goes to this employee; empty stays empty
                try { await employeeApi.saveValues(employeeId, sectionId, { [f._id]: value }); saved = value; }
                catch (err) { notify(`Field created, but its data was not saved: ${err.message}`, "error"); }
            }
            patchSection(sectionId, (s) => ({ ...s, fields: [...s.fields, { ...f, value: saved }] }));
            patchTemplateSection(sectionId, (s) => ({ ...s, fields: [...s.fields, f] }));
            notify("Field created successfully");
        }
        setModal(modal.returnTo || null);
    };
    const deleteField = () => run(async () => {
        const { sectionId, field } = modal;
        await employeeApi.deleteField(field._id);
        patchSection(sectionId, (s) => ({ ...s, fields: s.fields.filter((x) => x._id !== field._id) }));
        patchTemplateSection(sectionId, (s) => ({ ...s, fields: s.fields.filter((x) => x._id !== field._id) }));
    }, "Field deleted successfully", modal.returnTo);

    // Bulk delete from the section edit dialog: one request, then the UI is patched locally (no reload).
    const deleteFields = async (ids) => {
        await employeeApi.deleteEmployeeFields(employeeId, editSectionId, ids);
        const keep = (s) => ({ ...s, fields: s.fields.filter((x) => !ids.includes(x._id)) });
        patchSection(editSectionId, keep);
        patchTemplateSection(editSectionId, keep);
        notify(`${ids.length} field${ids.length > 1 ? "s" : ""} deleted successfully`);
    };

    // ------------------------------------------------------------ employee actions
    const deleteEmployee = async () => {
        setBusy(true);
        try { await employeeApi.remove(employeeId); notify("Employee deleted successfully"); navigate("/dashboard/employees", { replace: true }); }
        catch (err) { notify(err.message, "error"); setBusy(false); }
    };

    const changePhoto = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const msg = validateFile(file, { extensions: PHOTO_EXTENSIONS, maxBytes: PHOTO_MAX_BYTES, label: "Photo" });
        if (msg) return notify(msg, "error");
        try { setEmployee(await employeeApi.updatePhoto(employeeId, file)); notify("Photo updated successfully"); }
        catch (err) { notify(err.message, "error"); }
    };

    const removePhoto = () => run(async () => { setEmployee(await employeeApi.removePhoto(employeeId)); }, "Profile picture removed successfully");

    const onTabKeys = (e) => {
        const i = template.findIndex((t) => t._id === tabId);
        if (e.key === "ArrowRight" && i < template.length - 1) selectTab(template[i + 1]._id);
        if (e.key === "ArrowLeft" && i > 0) selectTab(template[i - 1]._id);
    };

    // ------------------------------------------------------------ render
    if (empState.loading) return (
        <div className="emp-page">
            <div className="emp-page__head emp-page__head--back">
                <button type="button" className="emp-back" onClick={() => navigate("/dashboard/employees")} aria-label="Back to employees"><FiChevronLeft aria-hidden="true" /></button>
                <h1 className="emp-page__title">Employee - Details</h1>
            </div>
            <div className="emp-details emp-details--loading" role="status" aria-live="polite">
                <aside className="emp-profile"><div className="emp-state"><div className="spinner-border spinner-border-sm" aria-hidden="true" /> Loading employee...</div></aside>
                <div className="emp-main" />
            </div>
        </div>
    );
    if (empState.error || !employee) return (
        <div className="emp-state emp-state--error" role="alert">
            {empState.error || "Employee not found"}{" "}
            <button type="button" className="emp-link" onClick={() => navigate("/dashboard/employees")}>Back to employees</button>
        </div>
    );

    const renderSection = (s) => {
        if (s.kind === "job_table") return (
            <JobDetailsCard key={s._id} section={s} employeeId={employeeId} periods={lookups.periods} canEdit={canEdit} notify={notify}
                onChange={(rows) => patchSection(s._id, (x) => ({ ...x, rows }))} onConfirmDelete={(row) => setModal({ type: "confirm-job", row })} />
        );
        if (s.kind === "documents") return (
            <DocumentsCard key={s._id} section={s} employeeId={employeeId} canEdit={canEdit} notify={notify}
                onChange={(documents) => patchSection(s._id, (x) => ({ ...x, documents }))} onConfirmDelete={(doc) => setModal({ type: "confirm-doc", doc })}
                onRename={() => setModal({ type: "rename-section", section: s })} onEditSection={() => setModal({ type: "edit-doc-section", section: s })}
                onDelete={() => setModal({ type: "confirm-section", section: s })} />
        );
        return (
            <FieldSectionCard key={s._id} section={s} canEdit={canEdit}
                onAddField={() => setModal({ type: "field", sectionId: s._id, field: null })}
                onEdit={() => { setEditSeq((n) => n + 1); setModal({ type: "edit-section", sectionId: s._id }); }}
                onRename={() => setModal({ type: "rename-section", section: s })}
                onDelete={() => setModal({ type: "confirm-section", section: s })} />
        );
    };

    // The edit dialog is hidden (not unmounted) while a field dialog is open on top of it, so unsaved input survives.
    const editSectionId = modal?.type === "edit-section" ? modal.sectionId : modal?.returnTo?.sectionId;
    const editingSection = editSectionId ? sectionById(editSectionId) : null;
    const fieldReturn = (m) => m?.returnTo || null;

    return (
        <div className="emp-page">
            <div className="emp-page__head emp-page__head--back">
                <button type="button" className="emp-back" onClick={() => navigate("/dashboard/employees")} aria-label="Back to employees"><FiChevronLeft aria-hidden="true" /></button>
                <h1 className="emp-page__title">{employee.full_name} - Details</h1>
            </div>

            <div className="emp-details">
                <aside className="emp-profile" aria-label="Employee profile">
                    <div className="emp-profile__top">
                        <div className="emp-profile__photo">
                            <Avatar src={employee.photo_url} alt={`${employee.full_name}'s photo`} eager />
                            {canEdit ? (
                                <>
                                    <div className="emp-profile__photomenu" ref={photoMenuRef}>
                                        <button type="button" className="emp-profile__photobtn" aria-label="Profile picture options" title="Profile picture" aria-haspopup="menu" aria-expanded={photoMenu} onClick={() => setPhotoMenu((o) => !o)}><FiUserPlus aria-hidden="true" /></button>
                                        {photoMenu ? (
                                            <div className="emp-photomenu__list" role="menu">
                                                <button type="button" role="menuitem" className="emp-photomenu__item" onClick={() => { setPhotoMenu(false); photoInput.current?.click(); }}><FiCamera aria-hidden="true" />{employee.photo_url ? "Change photo" : "Upload photo"}</button>
                                                {employee.photo_url ? <button type="button" role="menuitem" className="emp-photomenu__item emp-photomenu__item--danger" onClick={() => { setPhotoMenu(false); setModal({ type: "confirm-photo" }); }}><FiTrash2 aria-hidden="true" />Remove photo</button> : null}
                                            </div>
                                        ) : null}
                                    </div>
                                    <input ref={photoInput} type="file" className="visually-hidden" tabIndex={-1} aria-hidden="true" accept={PHOTO_EXTENSIONS.map((x) => `.${x}`).join(",")} onChange={changePhoto} />
                                </>
                            ) : null}
                        </div>
                        <div className="emp-profile__id">
                            <p className="emp-profile__name">{employee.full_name}</p>
                            <p className="emp-muted emp-profile__role">{employee.job_role?.name}</p>
                            {employee.period ? <span className={periodBadgeClass(employee.period.name)}>{employee.period.name}</span> : null}
                        </div>
                    </div>
                    <ul className="emp-profile__contact">
                        <li><FiMail aria-hidden="true" /> <span className="emp-card__text">{employee.email}</span></li>
                        <li><FiPhone aria-hidden="true" /> {employee.phone}</li>
                    </ul>
                    <dl className="emp-profile__meta">
                        <div><dt>Department</dt><dd>{employee.department?.name}</dd></div>
                        <div><dt>Role</dt><dd>{employee.job_role?.name}</dd></div>
                        <div><dt>Date Of Joining</dt><dd>{formatLongDate(employee.joining_date)}</dd></div>
                        <div><dt>Period</dt><dd>{employee.period?.name || "-"}</dd></div>
                    </dl>
                    {canEdit ? (
                        <Dropdown className="emp-profile__action">
                            <Dropdown.Toggle as="button" type="button" className="emp-btn emp-btn--primary w-100">Action <FiChevronDown aria-hidden="true" /></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as="button" onClick={() => setModal({ type: "edit-employee" })}>Edit employee</Dropdown.Item>
                                <Dropdown.Item as="button" className="text-danger" onClick={() => setModal({ type: "confirm-employee" })}>Delete employee</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : null}
                </aside>

                <div className="emp-main">
                    <div className="emp-tabs">
                        <div role="tablist" aria-label="Employee information" className="emp-tabs__list" onKeyDown={onTabKeys}>
                            {template.map((t) => (
                                <button key={t._id} id={`emp-tab-${t._id}`} role="tab" type="button" aria-selected={t._id === tabId} aria-controls="emp-tabpanel"
                                    tabIndex={t._id === tabId ? 0 : -1} className={`emp-tab${t._id === tabId ? " emp-tab--active" : ""}`} onClick={() => selectTab(t._id)}>{t.name}</button>
                            ))}
                        </div>
                        {canEdit ? (
                            <div className="emp-tabs__tools">
                                {activeTab ? (
                                    <button type="button" className="emp-iconbtn emp-iconbtn--plain" aria-label={`Edit ${activeTab.name} tab`} title="Edit tab" onClick={() => setModal({ type: "edit-tab", tab: activeTab })}><FiMoreHorizontal aria-hidden="true" /></button>
                                ) : null}
                                <button type="button" className="emp-addbtn" title="Add new section" disabled={!activeTab} onClick={() => setModal({ type: "add-section" })}><FiPlus aria-hidden="true" /><span>Section</span></button>
                                <button type="button" className="emp-addbtn emp-addbtn--primary" title="Add new menu" onClick={() => setModal({ type: "add-tab" })}><FiPlus aria-hidden="true" /><span>Tab</span></button>
                            </div>
                        ) : null}
                    </div>

                    <div id="emp-tabpanel" role="tabpanel" aria-labelledby={tabId ? `emp-tab-${tabId}` : undefined} className="emp-tabpanel">
                        {templateLoading || tabData.loading ? (
                            <div className="emp-state" role="status" aria-live="polite"><div className="spinner-border spinner-border-sm" aria-hidden="true" /> Loading...</div>
                        ) : templateError || tabData.error ? (
                            <div className="emp-state emp-state--error" role="alert">{templateError || tabData.error} <button type="button" className="emp-link" onClick={() => (templateError ? dispatch(handleGetEmployeeTemplate(employeeId)) : loadTab(tabId || "first"))}>Try again</button></div>
                        ) : tabData.sections.length === 0 ? (
                            <div className="emp-state">Nothing here yet.{canEdit ? " Use the + next to the tabs to add a section." : ""}</div>
                        ) : tabData.sections.map(renderSection)}
                    </div>
                </div>
            </div>

            {/* ---- dialogs ---- */}
            <NameModal show={modal?.type === "add-tab"} title="Add New Tab" onSave={addTab} onHide={close} />
            <EditItemModal show={modal?.type === "edit-tab"} title="Edit Tab" label="Tab name" initial={modal?.tab?.name} isDefault={modal?.tab?.is_system}
                onSave={renameTab} onDelete={() => setModal({ type: "confirm-tab", tab: modal.tab })} onHide={close} />
            <EditItemModal show={modal?.type === "edit-doc-section"} title="Edit Section" label="Section name" initial={modal?.section?.name} isDefault={modal?.section?.is_system}
                onSave={renameSection} onHide={close} />
            <NameModal show={modal?.type === "add-section"} title="Add New Section" onSave={addSection} onHide={close} />
            <NameModal show={modal?.type === "rename-section"} title="Rename Section" initial={modal?.section?.name} onSave={renameSection} onHide={close} />

            <EditSectionModal show={modal?.type === "edit-section"} resetKey={editSeq} section={editingSection} employeeId={employeeId} notify={notify}
                onHide={close}
                onSaved={(saved) => { patchSection(saved._id, () => saved); loadEmployee(true); }}
                onDeleteFields={deleteFields} />
            <AddFieldModal show={modal?.type === "field"} field={modal?.field} onSave={saveField} onHide={() => setModal(fieldReturn(modal))} />

            <EmployeeFormModal show={modal?.type === "edit-employee"} employee={employee} lookups={lookups} notify={notify} onHide={close} onSaved={(e) => { setEmployee(e); tabCache.current = {}; loadTab(tabId); }} />

            <ConfirmDialog show={modal?.type === "confirm-employee"} busy={busy} message="Are you sure you want to delete this employee?" onNo={close} onYes={deleteEmployee} />
            <ConfirmDialog show={modal?.type === "confirm-photo"} busy={busy} message="Are you sure you want to remove the profile picture?" onNo={close} onYes={removePhoto} />
            <ConfirmDialog show={modal?.type === "confirm-tab"} busy={busy} message="Are you sure you want to delete this tab and everything in it? It will be removed for all employees." onNo={close} onYes={deleteTab} />
            <ConfirmDialog show={modal?.type === "confirm-section"} busy={busy} message="Are you sure you want to delete this section and all its data? It will be removed for all employees." onNo={() => setModal(modal.returnTo || null)} onYes={deleteSection} />
            <ConfirmDialog show={modal?.type === "confirm-field"} busy={busy} message="Are you sure you want to delete this field?" onNo={() => setModal(modal.returnTo)} onYes={deleteField} />
            <ConfirmDialog show={modal?.type === "confirm-doc"} busy={busy} message="Are you sure you want to delete this Document?" onNo={close}
                onYes={() => run(async () => { await employeeApi.deleteDocument(employeeId, modal.doc._id); setTabData((p) => ({ ...p, sections: p.sections.map((s) => (s.documents ? { ...s, documents: s.documents.filter((d) => d._id !== modal.doc._id) } : s)) })); }, "Document deleted successfully")} />
            <ConfirmDialog show={modal?.type === "confirm-job"} busy={busy} message="Are you sure you want to delete this job detail?" onNo={close}
                onYes={() => run(async () => { await employeeApi.deleteJob(employeeId, modal.row._id); setTabData((p) => ({ ...p, sections: p.sections.map((s) => (s.rows ? { ...s, rows: s.rows.filter((r) => r._id !== modal.row._id) } : s)) })); }, "Job detail deleted successfully")} />
        </div>
    );
};

export default EmployeeDetails;
