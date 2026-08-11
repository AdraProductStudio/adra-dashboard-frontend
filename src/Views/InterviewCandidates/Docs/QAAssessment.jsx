import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader';
import SpinnerComponent from 'Components/Spinner/Spinner';
import Icons from 'Utils/Icons';
import useCommonState, { useDispatch } from 'ResuableFunctions/CustomHooks';
import {
    handleCloseQaTestMalpractice,
    handleEvaluateQaTest,
    handleGetCandidateCurrentStage,
    handleStartQaTest,
    handleSubmitQaTest,
    handleUpdateMalpractice
} from 'Views/InterviewCandidates/Action/interviewAction';
import { updateQaTestRemainingSeconds } from 'Views/InterviewCandidates/Slice/interviewSlice';
import { updateOverallModalData } from 'Views/Common/Slice/Common_slice';
import { CANDIDATE_STAGES } from 'Views/InterviewCandidates/candidateStageRoutes';
import {
    deleteQaAssessmentDraft,
    getQaAssessmentDraft,
    saveQaAssessmentDraft
} from 'Views/InterviewCandidates/qaAssessmentDraftDb';

const createEmptyGrid = (maximumRows, maximumColumns) => (
    Array.from(
        { length: maximumRows },
        () => Array.from({ length: maximumColumns }, () => '')
    )
);

const normalizeGrid = (grid, maximumRows, maximumColumns) => (
    Array.from({ length: maximumRows }, (_, rowIndex) => (
        Array.from({ length: maximumColumns }, (_, columnIndex) => {
            const value = grid?.[rowIndex]?.[columnIndex];
            return typeof value === 'string' ? value : '';
        })
    ))
);

const buildInitialGrids = ({ questions, answers, maximumRows, maximumColumns }) => {
    const answersByItemId = new Map(
        (answers || []).map((answer) => [answer?.item_id, answer?.rows || []])
    );

    return questions.reduce((grids, question) => {
        const grid = createEmptyGrid(maximumRows, maximumColumns);

        (answersByItemId.get(question.item_id) || []).forEach((row) => {
            const rowIndex = Number(row?.row_number) - 1;
            if (rowIndex < 0 || rowIndex >= maximumRows) return;

            (row?.cells || []).slice(0, maximumColumns).forEach((cell, columnIndex) => {
                grid[rowIndex][columnIndex] = typeof cell === 'string' ? cell : '';
            });
        });

        grids[question.item_id] = grid;
        return grids;
    }, {});
};

const getWrittenRows = (grid) => (
    (grid || []).reduce((rows, cells, rowIndex) => {
        const normalizedCells = (cells || []).map((cell) => (
            typeof cell === 'string' ? cell.trim() : ''
        ));

        if (normalizedCells.some(Boolean)) {
            rows.push({ row_number: rowIndex + 1, cells: normalizedCells });
        }

        return rows;
    }, [])
);

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

const createIdempotencyKey = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `qa-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const QAAssessment = () => {
    const { interviewState, commonState } = useCommonState();
    const dispatch = useDispatch();
    const qaTest = interviewState?.qa_test || {};
    const questions = useMemo(
        () => [...(qaTest?.questions || [])].sort(
            (firstQuestion, secondQuestion) => firstQuestion.position - secondQuestion.position
        ),
        [qaTest?.questions]
    );
    const maximumRows = Number(qaTest?.grid?.maximum_rows) || 30;
    const maximumColumns = Number(qaTest?.grid?.maximum_columns) || 10;
    const maximumCellCharacters = Number(qaTest?.grid?.maximum_cell_characters) || 2000;
    const hasSubmitted = qaTest?.submit_status === 'Completed' ||
        ['Completed', 'Malpractice'].includes(qaTest?.status);
    const continuesToProgrammingAssessment = (
        qaTest?.assessment_flow === 'qa' &&
        qaTest?.next_stage === CANDIDATE_STAGES.PROGRAMMING_PREPARATION
    );
    const isRequestInProgress = qaTest?.start_spinner || qaTest?.submit_spinner;

    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [grids, setGrids] = useState({});
    const [draftReady, setDraftReady] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [failedImages, setFailedImages] = useState({});

    const gridsRef = useRef({});
    const idempotencyKeyRef = useRef(null);
    const autoSubmittedRef = useRef(false);
    const completionModalShownRef = useRef(false);
    const backgroundEvaluationStartedRef = useRef(false);
    const malpracticeTriggeredRef = useRef(false);

    const selectedQuestion = questions[selectedQuestionIndex] || questions[0] || {};
    const selectedGrid = grids[selectedQuestion?.item_id] ||
        createEmptyGrid(maximumRows, maximumColumns);
    const secondsLeft = qaTest?.remaining_seconds ?? qaTest?.duration_seconds ?? 1800;
    const isTimeExpired = secondsLeft <= 0;
    const isLastQuestion = questions.length > 0 && selectedQuestionIndex === questions.length - 1;

    useEffect(() => {
        gridsRef.current = grids;
    }, [grids]);

    useEffect(() => {
        dispatch(handleStartQaTest());
    }, [dispatch]);

    useEffect(() => {
        if (!qaTest?.assessment_id || !questions.length) return;

        let isCancelled = false;
        setDraftReady(false);

        const hydrateGrids = async () => {
            const serverGrids = buildInitialGrids({
                questions,
                answers: qaTest?.answers,
                maximumRows,
                maximumColumns
            });

            try {
                const draft = await getQaAssessmentDraft(qaTest.assessment_id);
                if (isCancelled) return;

                const restoredGrids = { ...serverGrids };
                questions.forEach((question) => {
                    if (draft?.grids?.[question.item_id]) {
                        restoredGrids[question.item_id] = normalizeGrid(
                            draft.grids[question.item_id],
                            maximumRows,
                            maximumColumns
                        );
                    }
                });
                setGrids(restoredGrids);
            } catch (error) {
                if (!isCancelled) setGrids(serverGrids);
                console.error('Unable to restore QA assessment draft:', error);
            } finally {
                if (!isCancelled) setDraftReady(true);
            }
        };

        hydrateGrids();
        return () => {
            isCancelled = true;
        };
    }, [
        maximumColumns,
        maximumRows,
        qaTest?.answers,
        qaTest?.assessment_id,
        questions
    ]);

    useEffect(() => {
        if (!draftReady || !qaTest?.assessment_id || hasSubmitted) return;

        const saveTimer = setTimeout(() => {
            saveQaAssessmentDraft({
                assessmentId: qaTest.assessment_id,
                grids
            }).catch((error) => {
                console.error('Unable to save QA assessment draft:', error);
            });
        }, 500);

        return () => clearTimeout(saveTimer);
    }, [draftReady, grids, hasSubmitted, qaTest?.assessment_id]);

    useEffect(() => {
        questions.forEach((question) => {
            if (!question?.image_url) return;
            const image = new Image();
            image.src = question.image_url;
        });
    }, [questions]);

    const buildSubmissionAnswers = useCallback(() => (
        questions.map((question) => ({
            item_id: question.item_id,
            rows: getWrittenRows(gridsRef.current[question.item_id])
        }))
    ), [questions]);

    const submitAssessment = useCallback(async (submitReason = 'manual') => {
        if (qaTest?.submit_spinner || hasSubmitted || !questions.length) return null;

        if (!idempotencyKeyRef.current) {
            const storageKey = `qa-assessment-idempotency:${qaTest?.assessment_id || 'current'}`;
            idempotencyKeyRef.current = window.sessionStorage.getItem(storageKey) || createIdempotencyKey();
            window.sessionStorage.setItem(storageKey, idempotencyKeyRef.current);
        }

        setShowConfirmation(false);
        const submissionPayload = {
            answers: buildSubmissionAnswers(),
            submit_reason: submitReason,
            idempotency_key: idempotencyKeyRef.current
        };
        const response = await dispatch(
            submitReason === 'malpractice'
                ? handleCloseQaTestMalpractice(submissionPayload)
                : handleSubmitQaTest(submissionPayload)
        );

        if (response && qaTest?.assessment_id) {
            deleteQaAssessmentDraft(qaTest.assessment_id).catch((error) => {
                console.error('Unable to remove submitted QA assessment draft:', error);
            });
        }

        if (
            response?.assessment_flow === 'qa' &&
            response?.next_stage === CANDIDATE_STAGES.PROGRAMMING_PREPARATION
        ) {
            if (response?.evaluation_status === 'Pending') {
                backgroundEvaluationStartedRef.current = true;
                dispatch(handleEvaluateQaTest({ silent: true }));
            }
            await dispatch(handleGetCandidateCurrentStage());
        }

        return response;
    }, [
        buildSubmissionAnswers,
        dispatch,
        hasSubmitted,
        qaTest?.assessment_id,
        qaTest?.submit_spinner,
        questions.length
    ]);

    useEffect(() => {
        const resetMalpracticeTrigger = () => {
            malpracticeTriggeredRef.current = false;
        };

        const triggerMalpractice = () => {
            if (
                malpracticeTriggeredRef.current ||
                hasSubmitted ||
                qaTest?.submit_spinner ||
                commonState?.test_over_logout === 'malpracticed_again'
            ) return;

            malpracticeTriggeredRef.current = true;

            if (commonState?.involved_in_tab_switching > 0) {
                dispatch(handleUpdateMalpractice(commonState.involved_in_tab_switching));
            } else {
                autoSubmittedRef.current = true;
                setShowConfirmation(false);
                setShowImagePreview(false);
                submitAssessment('malpractice');
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                triggerMalpractice();
            } else {
                resetMalpracticeTrigger();
            }
        };

        const handleBlur = () => {
            triggerMalpractice();
        };

        const handleFocus = () => {
            resetMalpracticeTrigger();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [
        commonState?.involved_in_tab_switching,
        commonState?.test_over_logout,
        dispatch,
        hasSubmitted,
        qaTest?.submit_spinner,
        submitAssessment
    ]);

    useEffect(() => {
        if (!qaTest?.test_ends_on || hasSubmitted) return;

        const serverTime = new Date(qaTest?.server_time || Date.now()).getTime();
        const serverOffset = Number.isFinite(serverTime) ? serverTime - Date.now() : 0;
        const testEndsOn = new Date(qaTest.test_ends_on).getTime();

        const updateTimer = () => {
            const remainingSeconds = Math.max(
                Math.ceil((testEndsOn - (Date.now() + serverOffset)) / 1000),
                0
            );
            dispatch(updateQaTestRemainingSeconds(remainingSeconds));

            if (remainingSeconds === 0 && !autoSubmittedRef.current) {
                autoSubmittedRef.current = true;
                submitAssessment('timeout');
            }
        };

        updateTimer();
        const timer = window.setInterval(updateTimer, 1000);
        return () => window.clearInterval(timer);
    }, [
        dispatch,
        hasSubmitted,
        qaTest?.server_time,
        qaTest?.test_ends_on,
        submitAssessment
    ]);

    useEffect(() => {
        if (!hasSubmitted) return;

        dispatch(updateQaTestRemainingSeconds(0));
        autoSubmittedRef.current = true;

        if (qaTest?.assessment_id) {
            deleteQaAssessmentDraft(qaTest.assessment_id).catch((error) => {
                console.error('Unable to remove submitted QA assessment draft:', error);
            });
        }

        if (qaTest?.status === 'Malpractice') return;

        if (
            qaTest?.evaluation_status === 'Pending' &&
            !qaTest?.evaluate_spinner &&
            !backgroundEvaluationStartedRef.current
        ) {
            backgroundEvaluationStartedRef.current = true;
            dispatch(handleEvaluateQaTest({ silent: true }));
        }

        if (continuesToProgrammingAssessment) return;

        if (!completionModalShownRef.current) {
            completionModalShownRef.current = true;
            dispatch(updateOverallModalData({
                size: 'xl',
                from: 'interview_candidate',
                type: 'test_completed',
                enable_lg_autoScroll: false
            }));
        }
    }, [
        continuesToProgrammingAssessment,
        dispatch,
        hasSubmitted,
        qaTest?.assessment_id,
        qaTest?.evaluate_spinner,
        qaTest?.evaluation_status,
        qaTest?.status
    ]);

    const formattedTime = useMemo(() => {
        const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
        const seconds = String(secondsLeft % 60).padStart(2, '0');
        return `${minutes} : ${seconds}`;
    }, [secondsLeft]);

    const questionRowCounts = useMemo(() => (
        questions.reduce((counts, question) => {
            counts[question.item_id] = getWrittenRows(grids[question.item_id]).length;
            return counts;
        }, {})
    ), [grids, questions]);

    const updateCell = (rowIndex, columnIndex, value) => {
        if (hasSubmitted || isTimeExpired || isRequestInProgress || !selectedQuestion?.item_id) return;

        setGrids((currentGrids) => {
            const nextGrid = normalizeGrid(
                currentGrids[selectedQuestion.item_id],
                maximumRows,
                maximumColumns
            );
            nextGrid[rowIndex][columnIndex] = value.slice(0, maximumCellCharacters);

            return {
                ...currentGrids,
                [selectedQuestion.item_id]: nextGrid
            };
        });
    };

    const handleGridPaste = (event, startRowIndex, startColumnIndex) => {
        const clipboardText = event.clipboardData.getData('text/plain');
        if (!clipboardText.includes('\t') && !clipboardText.includes('\n')) return;

        event.preventDefault();
        const pastedRows = clipboardText.replace(/\r/g, '').split('\n');
        if (pastedRows[pastedRows.length - 1] === '') pastedRows.pop();

        setGrids((currentGrids) => {
            const nextGrid = normalizeGrid(
                currentGrids[selectedQuestion.item_id],
                maximumRows,
                maximumColumns
            );

            pastedRows.forEach((pastedRow, pastedRowIndex) => {
                const targetRowIndex = startRowIndex + pastedRowIndex;
                if (targetRowIndex >= maximumRows) return;

                pastedRow.split('\t').forEach((cell, pastedColumnIndex) => {
                    const targetColumnIndex = startColumnIndex + pastedColumnIndex;
                    if (targetColumnIndex >= maximumColumns) return;
                    nextGrid[targetRowIndex][targetColumnIndex] = cell.slice(0, maximumCellCharacters);
                });
            });

            return {
                ...currentGrids,
                [selectedQuestion.item_id]: nextGrid
            };
        });
    };

    const navigateToQuestion = (questionIndex) => {
        if (isRequestInProgress || hasSubmitted || isTimeExpired || !questions.length) return;
        setSelectedQuestionIndex(Math.max(0, Math.min(questionIndex, questions.length - 1)));
    };

    const handleManualSubmit = () => {
        setShowConfirmation(true);
    };

    if (qaTest?.start_spinner && !questions.length) {
        return (
            <div className='overflow-hidden applied_brand_color programming-assessment-page'>
                <InterviewCandidatesHeader />
                <section className='main text-dark d-flex align-items-center justify-content-center'>
                    <SpinnerComponent />
                </section>
            </div>
        );
    }

    return (
        <div className='overflow-hidden applied_brand_color qa-workspace-page'>
            <InterviewCandidatesHeader />
            <section className='main text-dark'>
                <div className='qa-workspace-shell'>
                    <header className='qa-workspace-header'>
                        <div>
                            <span className='qa-workspace-eyebrow'>QA assessment</span>
                            <h1>Write test cases from the interface</h1>
                        </div>
                        <div className={`qa-workspace-timer ${secondsLeft <= 300 ? 'is-ending' : ''}`}>
                            <span>{Icons?.timerIcon}</span>
                            <div>
                                <small>Time remaining</small>
                                <strong>{formattedTime}</strong>
                            </div>
                        </div>
                    </header>

                    {!questions.length ? (
                        <div className='qa-empty-state'>
                            <h3>Assessment questions are unavailable</h3>
                            <p>{qaTest?.evaluation_error_message || 'Please try loading the assessment again.'}</p>
                            <button
                                type='button'
                                className='btn btn-primary px-4'
                                onClick={() => dispatch(handleStartQaTest())}
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <div className='qa-workspace-layout'>
                            <Card className='qa-reference-panel border-0 shadow-sm'>
                                <Card.Body>
                                    <div className='qa-question-thumbnails' aria-label='QA questions'>
                                        {questions.map((question, questionIndex) => (
                                            <button
                                                type='button'
                                                className={`qa-question-thumbnail ${questionIndex === selectedQuestionIndex ? 'active' : ''} ${questionRowCounts[question.item_id] ? 'answered' : ''}`}
                                                onClick={() => navigateToQuestion(questionIndex)}
                                                disabled={isRequestInProgress || hasSubmitted || isTimeExpired}
                                                aria-label={`Open question ${questionIndex + 1}: ${question.title}`}
                                                key={question.item_id}
                                            >
                                                <img src={question.image_url} alt='' />
                                                <span>{questionIndex + 1}</span>
                                                {questionRowCounts[question.item_id] ? <i aria-hidden='true'>✓</i> : null}
                                            </button>
                                        ))}
                                    </div>

                                    <div className='qa-question-copy'>
                                        <span>Question {selectedQuestionIndex + 1} of {questions.length}</span>
                                        <h2>{selectedQuestion.title}</h2>
                                        <p>{selectedQuestion.description}</p>
                                    </div>

                                    <button
                                        type='button'
                                        className='qa-reference-image'
                                        onClick={() => setShowImagePreview(true)}
                                        disabled={failedImages[selectedQuestion.item_id]}
                                        aria-label='Open reference image preview'
                                    >
                                        {failedImages[selectedQuestion.item_id] ? (
                                            <span>Reference image could not be loaded.</span>
                                        ) : (
                                            <img
                                                src={selectedQuestion.image_url}
                                                alt={`${selectedQuestion.title} reference`}
                                                onError={() => setFailedImages((current) => ({
                                                    ...current,
                                                    [selectedQuestion.item_id]: true
                                                }))}
                                            />
                                        )}
                                    </button>

                                    {selectedQuestion?.requirements?.length ? (
                                        <div className='qa-requirements'>
                                            <strong>Requirements</strong>
                                            <ul>
                                                {selectedQuestion.requirements.map((requirement, index) => (
                                                    <li key={`${selectedQuestion.item_id}-requirement-${index}`}>
                                                        {requirement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </Card.Body>
                            </Card>

                            <Card className='qa-sheet-panel border-0 shadow-sm'>
                                <Card.Header>
                                    <div>
                                        <h2>Blank test-case sheet</h2>
                                        <p>Use one row for each test case. Organize the cells using your own QA knowledge.</p>
                                    </div>
                                    <span>{questionRowCounts[selectedQuestion.item_id] || 0} written rows</span>
                                </Card.Header>
                                <Card.Body>
                                    <div className='qa-spreadsheet' role='region' aria-label='Blank test-case spreadsheet'>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className='qa-spreadsheet-corner' aria-label='Row numbers'></th>
                                                    {Array.from({ length: maximumColumns }, (_, columnIndex) => (
                                                        <th scope='col' key={`column-${columnIndex}`}>
                                                            {getColumnName(columnIndex)}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedGrid.map((row, rowIndex) => (
                                                    <tr key={`${selectedQuestion.item_id}-row-${rowIndex}`}>
                                                        <th scope='row'>{rowIndex + 1}</th>
                                                        {row.map((cell, columnIndex) => (
                                                            <td key={`${rowIndex}-${columnIndex}`}>
                                                                <textarea
                                                                    value={cell}
                                                                    onChange={(event) => updateCell(
                                                                        rowIndex,
                                                                        columnIndex,
                                                                        event.target.value
                                                                    )}
                                                                    onPaste={(event) => handleGridPaste(
                                                                        event,
                                                                        rowIndex,
                                                                        columnIndex
                                                                    )}
                                                                    maxLength={maximumCellCharacters}
                                                                    disabled={isRequestInProgress || hasSubmitted || isTimeExpired}
                                                                    aria-label={`Cell ${getColumnName(columnIndex)}${rowIndex + 1}`}
                                                                    spellCheck='true'
                                                                    rows='1'
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary px-4 w-25'
                                        onClick={() => navigateToQuestion(selectedQuestionIndex - 1)}
                                        disabled={selectedQuestionIndex === 0 || isRequestInProgress || hasSubmitted || isTimeExpired}
                                    >
                                        Previous
                                    </button>
                                    <div className='qa-sheet-progress' aria-label={`${selectedQuestionIndex + 1} of ${questions.length} questions`}>
                                        {questions.map((question, questionIndex) => (
                                            <span
                                                className={`${questionIndex === selectedQuestionIndex ? 'active' : ''} ${questionRowCounts[question.item_id] ? 'answered' : ''}`}
                                                key={`progress-${question.item_id}`}
                                            ></span>
                                        ))}
                                    </div>
                                    <button
                                        type='button'
                                        className='btn btn-primary px-4'
                                        onClick={isTimeExpired
                                            ? () => submitAssessment('timeout')
                                            : isLastQuestion
                                                ? handleManualSubmit
                                                : () => navigateToQuestion(selectedQuestionIndex + 1)}
                                        disabled={isRequestInProgress || hasSubmitted}
                                    >
                                        {qaTest?.submit_spinner
                                            ? <SpinnerComponent />
                                            : isTimeExpired
                                                ? 'Submit timed-out answers'
                                                : isLastQuestion ? 'Review & Submit' : 'Next'}
                                    </button>
                                </Card.Footer>
                            </Card>
                        </div>
                    )}
                </div>
            </section>

            <Modal
                show={showConfirmation}
                onHide={() => !qaTest?.submit_spinner && setShowConfirmation(false)}
                centered
                size='lg'
            >
                <Modal.Header closeButton={!qaTest?.submit_spinner}>
                    <Modal.Title>Review your QA assessment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-secondary'>Your answers cannot be edited after submission.</p>
                    <div className='qa-submit-review'>
                        {questions.map((question, questionIndex) => (
                            <button
                                type='button'
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setSelectedQuestionIndex(questionIndex);
                                }}
                                disabled={qaTest?.submit_spinner}
                                key={`review-${question.item_id}`}
                            >
                                <span>{questionIndex + 1}</span>
                                <strong>{question.title}</strong>
                                <small>{questionRowCounts[question.item_id] || 0} rows</small>
                            </button>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type='button'
                        className='btn btn-outline-secondary'
                        onClick={() => setShowConfirmation(false)}
                        disabled={qaTest?.submit_spinner}
                    >
                        Continue editing
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary px-4'
                        onClick={() => submitAssessment('manual')}
                        disabled={qaTest?.submit_spinner}
                    >
                        {qaTest?.submit_spinner ? <SpinnerComponent /> : 'Submit assessment'}
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showImagePreview}
                onHide={() => setShowImagePreview(false)}
                centered
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title>{selectedQuestion.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='qa-image-preview-modal'>
                    <img src={selectedQuestion.image_url} alt={`${selectedQuestion.title} enlarged reference`} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default QAAssessment;
