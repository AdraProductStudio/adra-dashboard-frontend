import axiosInstance from "Services/axiosInstance";
import { updateToast } from "Views/Common/Slice/Common_slice";
import { employeeListState, employeeLookupsState, employeeTemplateState } from "Views/Admin/Slice/EmployeeSlice";

// The API answers with HTTP 200 + error_code 0 on success; business errors may arrive as HTTP 201 with success:false.
const unwrap = (res) => {
    const body = res?.data;
    if (body?.error_code === 0 || body?.success === true) return body.data;
    throw new Error(body?.message || "Something went wrong");
};
const request = async (promise) => {
    try {
        return unwrap(await promise);
    } catch (err) {
        throw new Error(err?.message || "Something went wrong"); // normalizes axios rejections (they carry the API body)
    }
};

const qs = (params) => {
    const sp = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") sp.append(k, v); });
    const s = sp.toString();
    return s ? `?${s}` : "";
};

const toForm = (obj) => {
    const f = new FormData();
    Object.entries(obj).forEach(([k, v]) => { if (v !== undefined && v !== null) f.append(k, v); });
    return f;
};

export const employeeApi = {
    lookups: () => request(axiosInstance.get("/employee_lookups")),
    list: (params) => request(axiosInstance.get(`/employees${qs(params)}`)),
    get: (id) => request(axiosInstance.get(`/employees/${id}`)),
    create: (values) => request(axiosInstance.post("/employees", toForm(values))),
    update: (id, body) => request(axiosInstance.put(`/employees/${id}`, body)),
    updatePhoto: (id, photo) => request(axiosInstance.put(`/employees/${id}/photo`, toForm({ photo }))),
    removePhoto: (id) => request(axiosInstance.delete(`/employees/${id}/photo`)),
    remove: (id) => request(axiosInstance.delete(`/employees/${id}`)),

    template: () => request(axiosInstance.get("/employee_template")),
    createTab: (name) => request(axiosInstance.post("/employee_tabs", { name })),
    renameTab: (id, name) => request(axiosInstance.put(`/employee_tabs/${id}`, { name })),
    deleteTab: (id) => request(axiosInstance.delete(`/employee_tabs/${id}`)),
    // per-employee sections: add / delete affect only this employee
    employeeTemplate: (id) => request(axiosInstance.get(`/employees/${id}/template`)),
    createEmployeeTab: (id, name) => request(axiosInstance.post(`/employees/${id}/tabs`, { name })),
    renameEmployeeTab: (id, tabId, name) => request(axiosInstance.put(`/employees/${id}/tabs/${tabId}`, { name })),
    renameEmployeeSection: (id, sectionId, name) => request(axiosInstance.put(`/employees/${id}/sections/${sectionId}`, { name })),
    deleteEmployeeTab: (id, tabId) => request(axiosInstance.delete(`/employees/${id}/tabs/${tabId}`)),
    createEmployeeField: (id, body) => request(axiosInstance.post(`/employees/${id}/fields`, body)),
    deleteEmployeeFields: (id, section_id, ids) => request(axiosInstance.post(`/employees/${id}/fields_delete`, { section_id, ids })),
    createEmployeeSection: (id, tab_id, name) => request(axiosInstance.post(`/employees/${id}/sections`, { tab_id, name })),
    deleteEmployeeSection: (id, sectionId) => request(axiosInstance.delete(`/employees/${id}/sections/${sectionId}`)),
    createSection: (tab_id, name) => request(axiosInstance.post("/employee_sections", { tab_id, name })),
    renameSection: (id, name) => request(axiosInstance.put(`/employee_sections/${id}`, { name })),
    deleteSection: (id) => request(axiosInstance.delete(`/employee_sections/${id}`)),
    createField: (body) => request(axiosInstance.post("/employee_fields", body)),
    updateField: (id, body) => request(axiosInstance.put(`/employee_fields/${id}`, body)),
    deleteFields: (section_id, ids) => request(axiosInstance.post("/employee_fields_delete", { section_id, ids })),
    deleteField: (id) => request(axiosInstance.delete(`/employee_fields/${id}`)),

    tabData: (id, tabId) => request(axiosInstance.get(`/employees/${id}/tabs/${tabId}/data`)),
    saveValues: (id, sectionId, values) => request(axiosInstance.put(`/employees/${id}/sections/${sectionId}/values`, { values })),

    createJob: (id, body) => request(axiosInstance.post(`/employees/${id}/job_details`, body)),
    updateJob: (id, rowId, body) => request(axiosInstance.put(`/employees/${id}/job_details/${rowId}`, body)),
    deleteJob: (id, rowId) => request(axiosInstance.delete(`/employees/${id}/job_details/${rowId}`)),

    uploadDocument: (id, sectionId, { name, submitted_date, file }) =>
        request(axiosInstance.post(`/employees/${id}/sections/${sectionId}/documents`, toForm({ name, submitted_date, file }))),
    updateDocument: (id, docId, { name, submitted_date, file }) =>
        request(axiosInstance.put(`/employees/${id}/documents/${docId}`, toForm({ name, submitted_date, file }))),
    documentLink: (id, docId, disposition) => request(axiosInstance.get(`/employees/${id}/documents/${docId}/file${qs({ disposition })}`)),
    deleteDocument: (id, docId) => request(axiosInstance.delete(`/employees/${id}/documents/${docId}`)),
};

// ---------------------------------------------------------------- thunks (list page state lives in Redux)
export const handleGetEmployees = (params) => async (dispatch) => {
    dispatch(employeeListState({ type: "request" }));
    try {
        dispatch(employeeListState({ type: "response", data: await employeeApi.list(params) }));
    } catch (err) {
        dispatch(employeeListState({ type: "failure", message: err.message }));
    }
};

export const handleGetEmployeeLookups = () => async (dispatch) => {
    try {
        dispatch(employeeLookupsState(await employeeApi.lookups()));
    } catch (err) {
        dispatch(updateToast({ message: err.message, type: "error" }));
    }
};

export const handleGetEmployeeTemplate = (employeeId) => async (dispatch) => {
    dispatch(employeeTemplateState({ type: "request" }));
    try {
        dispatch(employeeTemplateState({ type: "response", data: (await employeeApi.employeeTemplate(employeeId)).tabs }));
    } catch (err) {
        dispatch(employeeTemplateState({ type: "failure", message: err.message }));
    }
};

export const toast = (message, type = "success") => updateToast({ message, type });
