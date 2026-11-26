import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FiEdit2, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";

// Header of every section card: title, "+" (add), pencil (edit) and a "..." menu (rename / delete).
const SectionHeader = ({ title, canEdit, onAdd, addLabel, onEdit, editLabel, onRename, onDelete }) => (
    <div className="emp-section__head">
        <h3 className="emp-section__title">{title}</h3>
        {canEdit ? (
            <div className="emp-section__actions">
                {onAdd ? <button type="button" className="emp-iconbtn" aria-label={addLabel} title={addLabel} onClick={onAdd}><FiPlus aria-hidden="true" /></button> : null}
                {onEdit ? <button type="button" className="emp-iconbtn" aria-label={editLabel} title={editLabel} onClick={onEdit}><FiEdit2 aria-hidden="true" /></button> : null}
                <Dropdown align="end">
                    <Dropdown.Toggle as="button" type="button" className="emp-iconbtn emp-iconbtn--plain" aria-label={`More actions for ${title}`}><FiMoreHorizontal aria-hidden="true" /></Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as="button" onClick={onRename}>Rename section</Dropdown.Item>
                        {onDelete ? <Dropdown.Item as="button" className="emp-menu-danger" onClick={onDelete}><FiTrash2 aria-hidden="true" /> Delete section</Dropdown.Item> : null}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        ) : null}
    </div>
);

export default SectionHeader;
