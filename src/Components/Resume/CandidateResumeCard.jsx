import React, { useState } from 'react';
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import { RiFilePdf2Line, RiExternalLinkLine, RiDownload2Line } from 'react-icons/ri';
import { handleOpenCandidateResume } from 'Views/Admin/Action/AdminAction';
import { formatFileSize } from 'Utils/resumeFile';

// Admin-side resume panel for the Candidate Details page.
const CandidateResumeCard = ({ candidate, className = 'mb-3' }) => {
    const dispatch = useDispatch();
    const [busy, setBusy] = useState(null); // 'view' | 'download' | null
    const resume = candidate?.resume;
    const hasResume = Boolean(resume?.original_name);

    const run = async (mode) => {
        setBusy(mode);
        await dispatch(handleOpenCandidateResume({ candidate_id: candidate?._id, download: mode === 'download' }));
        setBusy(null);
    };

    return (
        <div className={`resume-card ${className}`}>
            <div className="resume-card__eyebrow">Resume</div>
            {hasResume ? (
                <div className="resume-card__body">
                    <button type="button" className="resume-card__file" onClick={() => run('view')} disabled={Boolean(busy)} title="Open resume">
                        <span className="resume-upload__pdf-badge"><RiFilePdf2Line size={26} /></span>
                        <span className="resume-card__file-info">
                            <span className="resume-upload__file-name">{resume.original_name}</span>
                            <span className="resume-upload__file-meta">
                                PDF · {formatFileSize(resume.size)}
                                {resume.uploaded_at ? ` · Uploaded ${new Date(resume.uploaded_at).toLocaleDateString()}` : ''}
                            </span>
                        </span>
                    </button>
                    <div className="resume-card__actions">
                        <button type="button" className="resume-card__btn resume-card__btn--primary" onClick={() => run('view')} disabled={Boolean(busy)}>
                            <RiExternalLinkLine size={16} /> {busy === 'view' ? 'Opening…' : 'View'}
                        </button>
                        <button type="button" className="resume-card__btn" onClick={() => run('download')} disabled={Boolean(busy)}>
                            <RiDownload2Line size={16} /> {busy === 'download' ? 'Preparing…' : 'Download'}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="resume-card__empty mb-0">This candidate did not upload a resume.</p>
            )}
        </div>
    );
};

export default CandidateResumeCard;
