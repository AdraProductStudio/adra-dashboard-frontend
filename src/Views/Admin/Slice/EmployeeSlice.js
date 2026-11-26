import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employees: [],
    pagination: { page: 1, limit: 10, total: 0, total_pages: 1 },
    listLoading: false,
    listError: "",
    lookups: { departments: [], job_roles: [], periods: [] },
    template: [],            // [{ _id, name, is_system, sections: [{ ..., fields: [] }] }]
    templateLoading: false,
    templateError: "",
};

const EmployeeSlice = createSlice({
    name: "Employee_slice",
    initialState,
    reducers: {
        employeeListState(state, { payload }) {
            if (payload.type === "request") { state.listLoading = true; state.listError = ""; }
            else if (payload.type === "response") {
                state.listLoading = false;
                state.employees = payload.data.employees;
                state.pagination = payload.data.pagination;
            } else { state.listLoading = false; state.employees = []; state.listError = payload.message || "Unable to load employees"; }
        },
        employeeLookupsState(state, { payload }) { state.lookups = payload; },
        employeeTemplateState(state, { payload }) {
            if (payload.type === "request") { state.templateLoading = true; state.templateError = ""; state.template = []; } // never show another employee's tabs
            else if (payload.type === "response") { state.templateLoading = false; state.template = payload.data; }
            else { state.templateLoading = false; state.templateError = payload.message || "Unable to load the employee template"; }
        },
        // local edits after create / rename / delete so the UI updates immediately, without a full reload
        setEmployeeTemplate(state, { payload }) { state.template = payload; },
    },
});

export const { employeeListState, employeeLookupsState, employeeTemplateState, setEmployeeTemplate } = EmployeeSlice.actions;
export default EmployeeSlice.reducer;
