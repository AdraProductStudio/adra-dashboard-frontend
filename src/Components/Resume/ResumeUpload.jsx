import React, { useRef, useState } from 'react';
import { RiFileUploadLine, RiFilePdf2Line, RiCloseLine, RiCheckboxCircleFill, RiErrorWarningLine } from 'react-icons/ri';
import { RESUME_MAX_SIZE_LABEL, formatFileSize, validateResumeFile } from 'Utils/resumeFile';

/**
 * Drag & drop PDF resume picker.
 *  - file:     the currently selected File (or undefined)
 *  - onSelect: called with a valid File
 *  - onRemove: called when the candidate removes the file
 *  - onError:  optional, called with a validation message (e.g. to show a toast)
 */
const ResumeUpload = ({ label = "Resume", isMandatory = false, file, onSelect, onRemove, onError, Err }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState(null);

    const handleFile = (picked) => {
        const message = validateResumeFile(picked);
        if (message) {
            setLocalError(message);
            if (onError) onError(message);
            return;
        }
        setLocalError(null);
        onSelect(picked);
    };

    const handleInputChange = (e) => {
        handleFile(e.target.files?.[0]);
        e.target.value = ""; // lets the same file be picked again after a rejection
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const openPicker = () => inputRef.current?.click();
    const error = localError || Err;

    return (
        <div className="resume-upload">
            <label className="text-secondary mb-1 fs-14">
                {label}{isMandatory ? <span className="text-danger"> *</span> : null}
            </label>

            <input
                ref={inputRef}
                type="file"
                className="d-none"
                accept="application/pdf,.pdf"
                onChange={handleInputChange}
            />

            {file ? (
                <div className="resume-upload__file">
                    <div className="resume-upload__pdf-badge"><RiFilePdf2Line size={26} /></div>
                    <div className="resume-upload__file-info">
                        <p className="resume-upload__file-name" title={file.name}>{file.name}</p>
                        <p className="resume-upload__file-meta">
                            <RiCheckboxCircleFill className="resume-upload__ok" /> PDF · {formatFileSize(file.size)} · Ready to upload
                        </p>
                    </div>
                    <button type="button" className="resume-upload__btn-link" onClick={openPicker}>Replace</button>
                    <button type="button" className="resume-upload__remove" onClick={() => { setLocalError(null); onRemove(); }} aria-label="Remove resume">
                        <RiCloseLine size={20} />
                    </button>
                </div>
            ) : (
                <div
                    className={`resume-upload__dropzone ${dragging ? 'is-dragging' : ''} ${error ? 'has-error' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={openPicker}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                >
                    <div className="resume-upload__icon"><RiFileUploadLine size={28} /></div>
                    <p className="resume-upload__title">Drag &amp; drop your resume here, or <span>browse</span></p>
                    <p className="resume-upload__hint">PDF only · Maximum {RESUME_MAX_SIZE_LABEL}</p>
                </div>
            )}

            {error ? (
                <div className="resume-upload__error" role="alert">
                    <RiErrorWarningLine size={16} /> {error}
                </div>
            ) : null}
        </div>
    );
};

export default ResumeUpload;
