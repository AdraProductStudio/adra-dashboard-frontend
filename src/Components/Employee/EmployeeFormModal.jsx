import React, { useEffect, useState } from "react";
import EmployeeModal from "./EmployeeModal";
import FieldControl from "./FieldControl";
import { employeeApi } from "Views/Admin/Action/EmployeeAction";
import { PHOTO_EXTENSIONS, jobTypeOpts, validateEmployeeForm } from "Utils/employee";

const EMPTY = { full_name: "", email: "", phone: "", department: "", job_role: "", photo: null, joining_date: "", period: "", contract_period: "" };

// Add Employee (design 02). With `employee` it becomes "Edit Employee" and the photo is optional.
const EmployeeFormModal = ({ show, onHide, lookups, employee, onSaved, notify }) => {
    const isEdit = !!employee;
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!show) return;
        setErrors({});
        setValues(employee ? {
            full_name: employee.full_name, email: employee.email, phone: employee.phone,
            department: employee.department?._id || "", job_role: employee.job_role?._id || "", photo: null,
            joining_date: employee.joining_date, period: employee.period?._id || "", contract_period: employee.contract_period || "",
        } : EMPTY);
    }, [show, employee]);

    const set = (k) => (v) => { setValues((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: undefined })); };
    const opts = (list) => list.map((x) => ({ value: x._id, label: x.name }));

    const submit = async (e) => {
        e.preventDefault();
        if (saving) return;
        const found = validateEmployeeForm(values, { photoRequired: !isEdit });
        setErrors(found);
        if (Object.keys(found).length) return;
        setSaving(true);
        try {
            let saved;
            if (isEdit) {
                const { photo, ...body } = values;
                saved = await employeeApi.update(employee._id, body);
                if (photo) saved = await employeeApi.updatePhoto(employee._id, photo);
            } else saved = await employeeApi.create(values);
            notify(isEdit ? "Employee updated successfully" : "Employee created successfully");
            onSaved(saved);
            onHide();
        } catch (err) {
            if (/email/i.test(err.message)) setErrors((p) => ({ ...p, email: err.message }));
            notify(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <EmployeeModal show={show} onHide={onHide} title={isEdit ? "Edit Employee" : "Add Employee"} titleId="emp-form-title" busy={saving}
            footer={<>
                <button type="button" className="emp-btn emp-btn--outline" onClick={onHide} disabled={saving}>Cancel</button>
                <button type="submit" form="emp-form" className="emp-btn emp-btn--primary" disabled={saving}>{saving ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save" : "Create")}</button>
            </>}>
            <form id="emp-form" className="emp-grid" onSubmit={submit} noValidate>
                <FieldControl id="emp-full-name" label="Full Name" required value={values.full_name} onChange={set("full_name")} error={errors.full_name} maxLength={80} />
                <FieldControl id="emp-email" label="Email ID" required value={values.email} onChange={set("email")} error={errors.email} maxLength={120} inputMode="email" />
                <FieldControl id="emp-phone" label="Phone Number" required value={values.phone} onChange={set("phone")} error={errors.phone} maxLength={20} inputMode="tel" />
                <FieldControl id="emp-department" label="Department" type="dropdown" required options={opts(lookups.departments)} value={values.department} onChange={set("department")} error={errors.department} />
                <FieldControl id="emp-job-role" label="Job Role" type="dropdown" required options={opts(lookups.job_roles)} value={values.job_role} onChange={set("job_role")} error={errors.job_role} />
                <FieldControl id="emp-photo" label="Employee Photo" type="file" required={!isEdit} accept={PHOTO_EXTENSIONS.map((x) => `.${x}`).join(",")} fileName={values.photo?.name} onChange={set("photo")} error={errors.photo} />
                <FieldControl id="emp-joining" label="Joining Date" type="date" required value={values.joining_date} onChange={set("joining_date")} error={errors.joining_date} />
                <FieldControl id="emp-period" label="Job Type" type="dropdown" options={jobTypeOpts(lookups.periods)} value={values.period} onChange={set("period")} error={errors.period} />
                <FieldControl id="emp-contract" label="Contract Period" value={values.contract_period} onChange={set("contract_period")} error={errors.contract_period} maxLength={60} />
            </form>
        </EmployeeModal>
    );
};

export default EmployeeFormModal;
