import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';

const getStatusClass = (status) => {
    if (status === 'Completed') return 'test_completed_badge';
    if (status === 'In Progress') return 'test_progress_badge';
    return 'test_not_started_badge';
};

const getGradeLabel = (grade) => {
    if (grade === 'Worst') return 'Progressing';
    if (grade === 'Better') return 'Good';
    if (grade === 'Good') return 'Excellent';
    return grade || '-';
};

const getGradeClass = (grade) => {
    if (grade === 'Good') return 'test_completed_badge';
    if (grade === 'Better') return 'test_progress_badge';
    return 'test_not_started_badge';
};

const ACTIVE_EVALUATION_STATUSES = ['Pending', 'Queued', 'Processing', 'In Progress'];

const getColumnName = (columnIndex) => {
    let value = columnIndex + 1;
    let name = '';

    while (value > 0) {
        const remainder = (value - 1) % 26;
        name = String.fromCharCode(65 + remainder) + name;
        value = Math.floor((value - 1) / 26);
    }

    return name;
};

const getRemainingSeconds = (qaAssessment) => {
    if (qaAssessment?.status !== 'In Progress' || !qaAssessment?.test_ends_on) return null;

    const testEndsOn = new Date(qaAssessment.test_ends_on).getTime();
    if (Number.isNaN(testEndsOn)) return null;

    return Math.max(Math.ceil((testEndsOn - Date.now()) / 1000), 0);
};

const formatRemainingTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '-';

    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes} : ${remainingSeconds}`;
};

const formatDateTime = (value) => {
    if (!value) return '-';

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
};

const QaAnswerSheet = ({ rows }) => {
    const writtenRows = useMemo(
        () => [...(rows || [])].sort(
            (firstRow, secondRow) => Number(firstRow.row_number) - Number(secondRow.row_number)
        ),
        [rows]
    );
    const maximumColumns = writtenRows.reduce(
        (columnCount, row) => Math.max(columnCount, row?.cells?.length || 0),
        0
    );

    if (!writtenRows.length) {
        return <div className='qa-admin-unanswered'>No test-case rows were submitted.</div>;
    }

    return (
        <div className='qa-admin-sheet' role='region' aria-label='Candidate QA answer sheet'>
            <table>
                <thead>
                    <tr>
                        <th className='qa-admin-sheet__corner'></th>
                        {Array.from({ length: maximumColumns }, (_, columnIndex) => (
                            <th scope='col' key={`qa-answer-column-${columnIndex}`}>
                                {getColumnName(columnIndex)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {writtenRows.map((row) => (
                        <tr key={`qa-answer-row-${row.row_number}`}>
                            <th scope='row'>{row.row_number}</th>
                            {Array.from({ length: maximumColumns }, (_, columnIndex) => (
                                <td key={`qa-answer-${row.row_number}-${columnIndex}`}>
                                    {row?.cells?.[columnIndex] || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const QaAssessmentDetails = ({ qaAssessment = {} }) => {
    const status = qaAssessment?.status || 'Not Started';
    const evaluation = qaAssessment?.ai_evaluation || {};
    const items = useMemo(
        () => [...(qaAssessment?.items || [])].sort(
            (firstItem, secondItem) => (
                Number(firstItem?.question_snapshot?.position) -
                Number(secondItem?.question_snapshot?.position)
            )
        ),
        [qaAssessment?.items]
    );
    const questionEvaluations = Array.isArray(evaluation?.question_evaluations)
        ? evaluation.question_evaluations
        : [];
    const [remainingSeconds, setRemainingSeconds] = useState(
        getRemainingSeconds(qaAssessment)
    );
    const [previewQuestion, setPreviewQuestion] = useState(null);

    useEffect(() => {
        const updateRemainingTime = () => {
            setRemainingSeconds(getRemainingSeconds(qaAssessment));
        };

        updateRemainingTime();
        if (status !== 'In Progress') return undefined;

        const timer = window.setInterval(updateRemainingTime, 1000);
        return () => window.clearInterval(timer);
    }, [qaAssessment, status]);

    const getItemEvaluation = (item) => (
        questionEvaluations.find((questionEvaluation) => (
            questionEvaluation?.item_id === item?.item_id ||
            questionEvaluation?.question_key === item?.question_snapshot?.question_key
        )) || {}
    );

    return (
        <div className='col-12 py-3 border-bottom qa-admin-assessment'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3'>
                <h6 className='mb-0'>QA Assessment</h6>
                <div className={`interview_candidate_badge ${getStatusClass(status)}`}>
                    {status}
                </div>
            </div>

            <div className='row g-3 mb-3'>
                <div className='col-12 col-md-4'>
                    <div className='campaign-candidate-card__detail-box h-100'>
                        <div className='campaign-candidate-card__eyebrow mb-1'>Assessment Status</div>
                        <div className='text-dark fw-semibold'>{status}</div>
                    </div>
                </div>

                {status === 'In Progress' ? (
                    <div className='col-12 col-md-4'>
                        <div className='campaign-candidate-card__detail-box h-100'>
                            <div className='campaign-candidate-card__eyebrow mb-1'>Remaining Time</div>
                            <div className='text-dark fw-semibold'>{formatRemainingTime(remainingSeconds)}</div>
                        </div>
                    </div>
                ) : null}

                {qaAssessment?.submission_reason ? (
                    <div className='col-12 col-md-4'>
                        <div className='campaign-candidate-card__detail-box h-100'>
                            <div className='campaign-candidate-card__eyebrow mb-1'>Submission Reason</div>
                            <div className='text-dark fw-semibold text-capitalize'>
                                {qaAssessment.submission_reason}
                            </div>
                        </div>
                    </div>
                ) : null}

                {qaAssessment?.test_submitted_on ? (
                    <div className='col-12 col-md-4'>
                        <div className='campaign-candidate-card__detail-box h-100'>
                            <div className='campaign-candidate-card__eyebrow mb-1'>Submitted At</div>
                            <div className='text-dark fw-semibold'>
                                {formatDateTime(qaAssessment.test_submitted_on)}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {items.length ? (
                <Fragment>
                    <h6 className='mb-3'>QA Questions & Candidate Answers</h6>
                    <div className='qa-admin-question-list'>
                        {items.map((item, itemIndex) => {
                            const question = item?.question_snapshot || {};
                            const itemEvaluation = getItemEvaluation(item);
                            const hasEvaluation = itemEvaluation?.score !== undefined || itemEvaluation?.grade;

                            return (
                                <article className='qa-admin-question' key={item?.item_id || itemIndex}>
                                    <header>
                                        <div>
                                            <span>Question {itemIndex + 1}</span>
                                            <h6>{question?.title || '-'}</h6>
                                            <p>{question?.description || '-'}</p>
                                        </div>
                                        {hasEvaluation ? (
                                            <div className='d-flex flex-wrap gap-2'>
                                                <span className='interview_candidate_badge test_progress_badge'>
                                                    Score: {itemEvaluation?.score ?? 0}/100
                                                </span>
                                                <span className={`interview_candidate_badge ${getGradeClass(itemEvaluation?.grade)}`}>
                                                    {getGradeLabel(itemEvaluation?.grade)}
                                                </span>
                                            </div>
                                        ) : null}
                                    </header>

                                    <div className='qa-admin-question__content'>
                                        <button
                                            type='button'
                                            className='qa-admin-reference'
                                            onClick={() => question?.image_url && setPreviewQuestion(question)}
                                            disabled={!question?.image_url}
                                            aria-label={`Preview ${question?.title || 'QA question'} reference image`}
                                        >
                                            {question?.image_url ? (
                                                <img
                                                    src={question.image_url}
                                                    alt={`${question?.title || 'QA question'} reference`}
                                                />
                                            ) : (
                                                <span>No reference image</span>
                                            )}
                                        </button>

                                        <div className='qa-admin-answer'>
                                            <div className='campaign-candidate-card__eyebrow mb-2'>Candidate Answer</div>
                                            <QaAnswerSheet rows={item?.final_rows} />
                                        </div>
                                    </div>

                                    {itemEvaluation?.feedback ? (
                                        <div className='qa-admin-feedback'>
                                            <div className='campaign-candidate-card__eyebrow mb-1'>Evaluation Feedback</div>
                                            <p>{itemEvaluation.feedback}</p>
                                            <div className='qa-admin-feedback__lists'>
                                                {itemEvaluation?.strengths?.length ? (
                                                    <div>
                                                        <strong>Strengths</strong>
                                                        <ul>
                                                            {itemEvaluation.strengths.map((strength, index) => (
                                                                <li key={`${item.item_id}-strength-${index}`}>{strength}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : null}
                                                {itemEvaluation?.missing_scenarios?.length ? (
                                                    <div>
                                                        <strong>Missing scenarios</strong>
                                                        <ul>
                                                            {itemEvaluation.missing_scenarios.map((scenario, index) => (
                                                                <li key={`${item.item_id}-missing-${index}`}>{scenario}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>
                </Fragment>
            ) : (
                <div className='qa-admin-unanswered'>The candidate has not started the QA assessment.</div>
            )}

            {status === 'Completed' ? (
                <div className='row g-3 mt-1'>
                    <div className='col-12 col-md-4'>
                        <div className='campaign-candidate-card__detail-box h-100'>
                            <div className='campaign-candidate-card__eyebrow mb-1'>AI Evaluation Status</div>
                            <div className={`fw-semibold ${evaluation?.status === 'Failed' ? 'text-danger' : 'text-dark'}`}>
                                {ACTIVE_EVALUATION_STATUSES.includes(evaluation?.status)
                                    ? 'AI Evaluation in Progress'
                                    : evaluation?.status || '-'}
                            </div>
                        </div>
                    </div>

                    {evaluation?.status === 'Completed' ? (
                        <Fragment>
                            <div className='col-12 col-md-4'>
                                <div className='campaign-candidate-card__detail-box h-100'>
                                    <div className='campaign-candidate-card__eyebrow mb-1'>Overall Grade</div>
                                    <div className='text-dark fw-semibold'>{getGradeLabel(evaluation?.grade)}</div>
                                </div>
                            </div>
                            <div className='col-12 col-md-4'>
                                <div className='campaign-candidate-card__detail-box h-100'>
                                    <div className='campaign-candidate-card__eyebrow mb-1'>Overall Score</div>
                                    <div className='text-dark fw-semibold'>
                                        {evaluation?.score !== null && evaluation?.score !== undefined
                                            ? `${evaluation.score}/100`
                                            : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className='campaign-candidate-card__detail-box h-100'>
                                    <div className='campaign-candidate-card__eyebrow mb-1'>Overall Feedback</div>
                                    <div className='text-dark text-break'>{evaluation?.feedback || '-'}</div>
                                </div>
                            </div>
                        </Fragment>
                    ) : null}

                    {evaluation?.status === 'Failed' && evaluation?.error ? (
                        <div className='col-12'>
                            <div className='campaign-candidate-card__detail-box h-100'>
                                <div className='campaign-candidate-card__eyebrow mb-1'>Evaluation Error</div>
                                <div className='text-danger text-break'>{evaluation.error}</div>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <Modal
                show={Boolean(previewQuestion?.image_url)}
                onHide={() => setPreviewQuestion(null)}
                centered
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title>{previewQuestion?.title || 'QA reference image'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='qa-image-preview-modal'>
                    {previewQuestion?.image_url ? (
                        <img
                            src={previewQuestion.image_url}
                            alt={`${previewQuestion?.title || 'QA question'} enlarged reference`}
                        />
                    ) : null}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default QaAssessmentDetails;
