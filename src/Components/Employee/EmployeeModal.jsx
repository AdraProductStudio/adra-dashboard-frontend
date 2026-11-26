import React from "react";
import Modal from "react-bootstrap/Modal";

// Accessible modal shell used by every Employee dialog. react-bootstrap provides the focus trap, Esc to close,
// aria-modal and focus restore; `busy` blocks closing while a request is in flight.
const EmployeeModal = ({ show, onHide, title, titleId, size = "lg", busy = false, headerExtra = null, children, footer = null, className = "" }) => (
    <Modal
        show={show}
        onHide={busy ? undefined : onHide}
        centered
        size={size}
        backdrop="static"
        keyboard={!busy}
        aria-labelledby={titleId}
        contentClassName={`emp-modal ${className}`}
    >
        <Modal.Header className="emp-modal__header">
            <Modal.Title as="h2" id={titleId} className="emp-modal__title">{title}</Modal.Title>
            {headerExtra}
        </Modal.Header>
        <Modal.Body className="emp-modal__body">{children}</Modal.Body>
        {footer ? <Modal.Footer className="emp-modal__footer">{footer}</Modal.Footer> : null}
    </Modal>
);

export default EmployeeModal;
