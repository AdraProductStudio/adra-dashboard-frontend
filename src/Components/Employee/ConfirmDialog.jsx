import React from "react";
import { FiTrash2 } from "react-icons/fi";
import EmployeeModal from "./EmployeeModal";

const ConfirmDialog = ({ show, message, onYes, onNo, busy }) => (
    <EmployeeModal show={show} onHide={onNo} size="sm" titleId="emp-confirm-title" busy={busy} className="emp-modal--confirm"
        title={<span className="visually-hidden">Confirm</span>}>
        <div className="emp-confirm" role="alertdialog" aria-describedby="emp-confirm-msg">
            <FiTrash2 size={28} aria-hidden="true" />
            <p id="emp-confirm-msg" className="emp-confirm__msg">{message}</p>
            <div className="emp-confirm__actions">
                <button type="button" className="emp-btn emp-btn--outline" onClick={onNo} disabled={busy}>No</button>
                <button type="button" className="emp-btn emp-btn--primary" onClick={onYes} disabled={busy} autoFocus>
                    {busy ? "Deleting..." : "Yes"}
                </button>
            </div>
        </div>
    </EmployeeModal>
);

export default ConfirmDialog;
