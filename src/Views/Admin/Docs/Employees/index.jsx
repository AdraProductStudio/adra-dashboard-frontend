import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactPaginateComp from "Components/Pagination/ReactPaginateComp";
import { FiFilter, FiSearch, FiUserPlus, FiUsers, FiX } from "react-icons/fi";
import useCommonState, { useCustomNavigate, useDispatch } from "ResuableFunctions/CustomHooks";
import EmployeeCard from "Components/Employee/EmployeeCard";
import EmployeeFormModal from "Components/Employee/EmployeeFormModal";
import FieldControl from "Components/Employee/FieldControl";
import { jobTypeOpts } from "Utils/employee";
import { handleGetEmployeeLookups, handleGetEmployees, toast } from "Views/Admin/Action/EmployeeAction";

const PAGE_SIZE = 10;

// Employees list (design 01): server-side search, filters and pagination.
const Employees = () => {
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();
    const { commonState } = useCommonState();
    const isAdmin = commonState?.user_role === "admin";
    const { employees, pagination, listLoading, listError, lookups } = useSelector((s) => s.employeeState);

    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({ department: "", job_role: "", period: "" });
    const [page, setPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => { dispatch(handleGetEmployeeLookups()); }, [dispatch]);

    // debounce the search box
    useEffect(() => {
        const t = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(() => {
        dispatch(handleGetEmployees({ search: query, ...filters, page, limit: PAGE_SIZE }));
    }, [dispatch, query, filters, page]);
    useEffect(() => { load(); }, [load]);

    const activeFilters = Object.values(filters).filter(Boolean).length;
    const setFilter = (k) => (v) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };
    const opts = (l) => l.map((x) => ({ value: x._id, label: x.name }));
    const notify = (message, type = "success") => dispatch(toast(message, type));

    return (
        <div className="emp-page">
            <div className="emp-page__head">
                <h1 className="emp-page__title">Employees</h1>
                <div className="emp-toolbar">
                    <div className="emp-filter">
                        <button type="button" className="emp-btn emp-btn--outline emp-toolbar__filter" aria-expanded={showFilter} aria-controls="emp-filter-panel" onClick={() => setShowFilter((s) => !s)}>
                            <FiFilter aria-hidden="true" /> Filter{activeFilters ? <span className="emp-filter__count">{activeFilters}</span> : null}
                        </button>
                        {showFilter ? (
                            <div id="emp-filter-panel" className="emp-filter__panel" role="group" aria-label="Filter employees" onKeyDown={(e) => { if (e.key === "Escape") setShowFilter(false); }}>
                                <div className="emp-filter__head">
                                    <span className="emp-filter__title">Filters</span>
                                    <button type="button" className="emp-filter__close" aria-label="Close filters" title="Close" onClick={() => setShowFilter(false)}><FiX aria-hidden="true" /></button>
                                </div>
                                <FieldControl id="emp-f-dep" label="Department" type="dropdown" options={opts(lookups.departments)} value={filters.department} onChange={setFilter("department")} placeholder="All" />
                                <FieldControl id="emp-f-role" label="Job Role" type="dropdown" options={opts(lookups.job_roles)} value={filters.job_role} onChange={setFilter("job_role")} placeholder="All" />
                                <FieldControl id="emp-f-period" label="Job Type" type="dropdown" options={jobTypeOpts(lookups.periods)} value={filters.period} onChange={setFilter("period")} placeholder="All" />
                                <button type="button" className="emp-link" onClick={() => { setFilters({ department: "", job_role: "", period: "" }); setPage(1); }}>Clear filters</button>
                            </div>
                        ) : null}
                    </div>
                    <div className="emp-search" role="search">
                        <label htmlFor="emp-search" className="visually-hidden">Search employees</label>
                        <input id="emp-search" type="search" className="emp-search__input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} maxLength={60} />
                        <FiSearch aria-hidden="true" className="emp-search__icon" />
                    </div>
                    {isAdmin ? (
                        <>
                            <span className="emp-toolbar__divider" aria-hidden="true" />
                            <button type="button" className="emp-btn emp-btn--primary emp-toolbar__add" onClick={() => setShowAdd(true)}><FiUserPlus aria-hidden="true" /> Add Employee</button>
                        </>
                    ) : null}
                </div>
            </div>

            {listLoading ? (
                <div className="emp-state" role="status" aria-live="polite"><div className="spinner-border spinner-border-sm" aria-hidden="true" /> Loading employees...</div>
            ) : listError ? (
                <div className="emp-state emp-state--error" role="alert">{listError} <button type="button" className="emp-link" onClick={load}>Try again</button></div>
            ) : employees.length === 0 ? (
                <div className="emp-empty" role="status">
                    <FiUsers aria-hidden="true" className="emp-empty__icon" />
                    <p className="emp-empty__title">No employees found.</p>
                    {isAdmin && !query && !activeFilters ? (
                        <>
                            <p className="emp-muted emp-empty__text">There are no employees yet. Create the first one to get started.</p>
                            <button type="button" className="emp-btn emp-btn--primary" onClick={() => setShowAdd(true)}><FiUserPlus aria-hidden="true" /> Create Employee</button>
                        </>
                    ) : null}
                </div>
            ) : (
                <>
                    <ul className="emp-grid-cards">
                        {employees.map((e) => <li key={e._id}><EmployeeCard employee={e} onOpen={(id) => navigate(`/dashboard/employees/${id}`)} /></li>)}
                    </ul>
                    {pagination.total_pages > 1 ? (
                        <nav aria-label="Employees pages" className="mt-3">
                            <ReactPaginateComp pageCount={pagination.total} currentPage={page} onPageChange={({ selected }) => setPage(selected + 1)} />
                        </nav>
                    ) : null}
                </>
            )}

            <EmployeeFormModal show={showAdd} onHide={() => setShowAdd(false)} lookups={lookups} notify={notify} onSaved={() => { setPage(1); load(); }} />
        </div>
    );
};

export default Employees;
