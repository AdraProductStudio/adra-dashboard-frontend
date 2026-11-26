import React from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import Avatar from "./Avatar";
import { periodBadgeClass } from "Utils/employee";

const EmployeeCard = ({ employee, onOpen }) => (
    <button type="button" className="emp-card" onClick={() => onOpen(employee._id)} aria-label={`Open details of ${employee.full_name}`}>
        <span className="emp-card__photo">
            <Avatar src={employee.photo_url} alt="" />
            {employee.period ? <span className={periodBadgeClass(employee.period.name)}>{employee.period.name}</span> : null}
        </span>
        <span className="emp-card__name">{employee.full_name}</span>
        <span className="emp-card__role">{employee.job_role?.name}</span>
        <span className="emp-card__line"><FiMail aria-hidden="true" /> <span className="emp-card__text">{employee.email}</span></span>
        <span className="emp-card__line"><FiPhone aria-hidden="true" /> <span>{employee.phone}</span></span>
    </button>
);

export default EmployeeCard;
