import React from "react";
import SectionHeader from "./SectionHeader";
import { formatDate } from "Utils/employee";

const display = (f) => {
    if (!f.value) return "-";
    return f.type === "date" ? formatDate(f.value) : f.value;
};

// Label / value card (Personal Information, Address Information, ...). Two columns fill row by row, in the order of the fields.
const FieldSectionCard = ({ section, canEdit, onAddField, onEdit, onRename, onDelete }) => {
    const fields = section.fields || [];
    return (
        <section className="emp-section" aria-label={section.name}>
            <SectionHeader title={section.name} canEdit={canEdit} isSystem={section.is_system}
                onAdd={onAddField} addLabel={`Add a new field to ${section.name}`}
                onEdit={onEdit} editLabel={`Edit ${section.name}`} onRename={onRename} onDelete={!section.is_system ? onDelete : undefined} />
            {fields.length === 0 ? (
                <p className="emp-muted emp-section__empty">No fields yet.{canEdit ? " Use + to add one." : ""}</p>
            ) : (
                <dl className={`emp-kv emp-kv--${section.columns}`}>
                    {fields.map((f) => (
                        <div className="emp-kv__row" key={f._id}>
                            <dt>{f.label}</dt>
                            <dd>{display(f)}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </section>
    );
};

export default FieldSectionCard;
