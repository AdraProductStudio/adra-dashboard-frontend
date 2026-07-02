import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import Editor from '@monaco-editor/react';
import ButtonComponent from 'Components/Button/Button';
import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader';
import SpinnerComponent from 'Components/Spinner/Spinner';
import Icons from 'Utils/Icons';
import useCommonState, { useDispatch } from 'ResuableFunctions/CustomHooks';
import { handleCloseProgrammingTestMalpractice, handleEvaluateProgrammingTest, handleStartProgrammingTest, handleSubmitProgrammingTest, handleUpdateMalpractice } from 'Views/InterviewCandidates/Action/interviewAction';
import { updateProgrammingTestRemainingSeconds } from 'Views/InterviewCandidates/Slice/interviewSlice';
import { updateOverallModalData } from 'Views/Common/Slice/Common_slice';

const programmingLanguages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Node.js', value: 'javascript' },
    { label: 'Java', value: 'java' },
    { label: 'Python', value: 'python' }
];

const ProgrammingAssessment = () => {
    const { interviewState, commonState } = useCommonState();
    const dispatch = useDispatch();
    const programmingTest = interviewState?.programming_test || {};
    const programmingQuestions = useMemo(() => programmingTest?.questions || [], [programmingTest?.questions]);
    const isRequestInProgress = programmingTest?.start_spinner || programmingTest?.submit_spinner;
    const isMalpracticeStatus = programmingTest?.status === "Malpractice";
    const hasSubmitted = programmingTest?.submit_status === "Completed" || programmingTest?.status === "Completed" || isMalpracticeStatus;
    const autoSubmittedRef = useRef(false);
    const completionModalShownRef = useRef(false);
    const backgroundEvaluationStartedRef = useRef(false);
    const malpracticeTriggeredRef = useRef(false);

    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedLanguage, setSelectedLanguage] = useState(programmingLanguages[0]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const selectedQuestion = useMemo(
        () => programmingQuestions[selectedQuestionIndex] || programmingQuestions[0] || {},
        [programmingQuestions, selectedQuestionIndex]
    );
    const selectedAnswer = answers[selectedQuestion?.id] || '';
    const secondsLeft = programmingTest?.remaining_seconds ?? programmingTest?.duration ?? 300;

    const getSubmissionPayload = useCallback((submitReason = "manual") => {
        let questionToSubmit = selectedQuestion;
        let answerToSubmit = selectedAnswer;

        if (["timeout", "malpractice"].includes(submitReason) && !answerToSubmit) {
            const firstAnsweredQuestion = programmingQuestions.find((question) => answers[question.id]);

            if (firstAnsweredQuestion) {
                questionToSubmit = firstAnsweredQuestion;
                answerToSubmit = answers[firstAnsweredQuestion.id] || '';
            }
        }

        return {
            selected_question: {
                title: questionToSubmit?.title || '',
                description: questionToSubmit?.description || ''
            },
            selected_language: selectedLanguage?.value || '',
            candidate_answer: ["timeout", "malpractice"].includes(submitReason) ? answerToSubmit : answerToSubmit.trim()
        };
    }, [
        answers,
        programmingQuestions,
        selectedAnswer,
        selectedLanguage?.value,
        selectedQuestion
    ]);

    const formattedTime = useMemo(() => {
        const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
        const seconds = String(secondsLeft % 60).padStart(2, '0');

        return `${minutes} : ${seconds}`;
    }, [secondsLeft]);

    const submitProgrammingAnswer = useCallback((submitReason = "manual") => {
        if (programmingTest?.submit_spinner || hasSubmitted) return;

        setShowConfirmation(false);

        dispatch(handleSubmitProgrammingTest(getSubmissionPayload(submitReason)));
    }, [
        dispatch,
        getSubmissionPayload,
        hasSubmitted,
        programmingTest?.submit_spinner
    ]);

    useEffect(() => {
        const resetMalpracticeTrigger = () => {
            malpracticeTriggeredRef.current = false;
        };

        const triggerMalpractice = () => {
            if (
                malpracticeTriggeredRef.current ||
                hasSubmitted ||
                programmingTest?.submit_spinner ||
                commonState?.test_over_logout === 'malpracticed_again'
            ) return;

            malpracticeTriggeredRef.current = true;

            if (commonState?.involved_in_tab_switching > 0) {
                dispatch(handleUpdateMalpractice(commonState.involved_in_tab_switching));
            } else {
                autoSubmittedRef.current = true;
                setShowConfirmation(false);
                dispatch(handleCloseProgrammingTestMalpractice(getSubmissionPayload("malpractice")));
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
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

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, [
        commonState?.involved_in_tab_switching,
        commonState?.test_over_logout,
        getSubmissionPayload,
        hasSubmitted,
        programmingTest?.submit_spinner
    ]);

    useEffect(() => {
        dispatch(handleStartProgrammingTest());
    }, []);

    useEffect(() => {
        if (!programmingTest?.test_started_on || hasSubmitted) return;

        const calculateRemainingSeconds = () => {
            const startedOn = new Date(programmingTest.test_started_on).getTime();
            const elapsedSeconds = Math.floor((Date.now() - startedOn) / 1000);
            return Math.max((programmingTest?.duration || 300) - elapsedSeconds, 0);
        };

        const syncRemainingSeconds = () => {
            const remainingSeconds = calculateRemainingSeconds();
            dispatch(updateProgrammingTestRemainingSeconds(remainingSeconds));

            if (remainingSeconds <= 0 && !autoSubmittedRef.current) {
                autoSubmittedRef.current = true;
                submitProgrammingAnswer("timeout");
            }
        };

        syncRemainingSeconds();
        const timer = setInterval(syncRemainingSeconds, 1000);

        return () => clearInterval(timer);
    }, [
        hasSubmitted,
        programmingTest?.duration,
        programmingTest?.test_started_on,
        submitProgrammingAnswer
    ]);

    useEffect(() => {
        if (hasSubmitted) {
            dispatch(updateProgrammingTestRemainingSeconds(0));
            autoSubmittedRef.current = true;
        }
    }, [hasSubmitted]);

    useEffect(() => {
        if (!hasSubmitted) return;
        if (isMalpracticeStatus || commonState?.test_over_logout === 'malpracticed_again') return;

        if (!completionModalShownRef.current) {
            completionModalShownRef.current = true;
            dispatch(updateOverallModalData({
                size: 'xl',
                from: 'interview_candidate',
                type: 'test_completed',
                enable_lg_autoScroll: false
            }));
        }

        if (
            programmingTest?.evaluation_status === "Pending" &&
            !programmingTest?.evaluate_spinner &&
            !backgroundEvaluationStartedRef.current
        ) {
            backgroundEvaluationStartedRef.current = true;
            dispatch(handleEvaluateProgrammingTest({ silent: true }));
        }
    }, [
        commonState?.test_over_logout,
        hasSubmitted,
        isMalpracticeStatus,
        programmingTest?.evaluate_spinner,
        programmingTest?.evaluation_status
    ]);

    const handleAnswerChange = (value) => {
        if (hasSubmitted) return;

        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [selectedQuestion.id]: value || ''
        }));
    };

    const handleManualSubmit = () => {
        submitProgrammingAnswer("manual");
    };

    return (
        <div className='overflow-hidden applied_brand_color programming-assessment-page'>
            <InterviewCandidatesHeader />
            <section className='main text-dark'>
                <div className="h-100 d-flex flex-wrap p-5 programming-assessment-shell">
                    <div className="col-12 col-lg-3 d-flex flex-column">
                        <Card className='h-100 border-0 shadow-sm rounded-3 programming-question-card'>
                            <Card.Header className='bg-white text-dark'>
                                <h5 className='mb-0 py-2'>Programming Questions</h5>
                            </Card.Header>
                            <Card.Body className='programming-question-list'>
                                {programmingQuestions.map((question, questionInd) => (
                                    <button
                                        type='button'
                                        className={`programming-question-list__item ${questionInd === selectedQuestionIndex ? 'active' : ''} ${answers[question.id] ? 'answered' : ''}`}
                                        onClick={() => setSelectedQuestionIndex(questionInd)}
                                        disabled={isRequestInProgress || hasSubmitted}
                                        key={question.id}
                                    >
                                        <span>{questionInd + 1}</span>
                                        <strong>{question.title}</strong>
                                    </button>
                                ))}
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-12 col-lg-9 ps-lg-3 mt-3 mt-lg-0">
                        <Card className='h-100 border-0 shadow-sm rounded-3 programming-editor-card'>
                            <Card.Header className='bg-white text-dark'>
                                <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
                                    <h5 className='mb-0 py-2'>Programming Assessment</h5>
                                    <div className='programming-timer'>
                                        <span className='pe-2'>{Icons?.timerIcon}</span>
                                        <span>{formattedTime}</span>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className='d-flex flex-column'>
                                <div className='programming-question-detail'>
                                    <span className='programming-question-detail__number'>Question {selectedQuestionIndex + 1}</span>
                                    <h4>{selectedQuestion?.title || 'Loading question...'}</h4>
                                    <p>{selectedQuestion?.description || 'Please wait while the programming questions are loaded.'}</p>
                                    {selectedQuestion?.sample ? <pre>{selectedQuestion.sample}</pre> : null}
                                </div>

                                <div className='programming-editor-workspace'>
                                    <div className='programming-editor-toolbar'>
                                        <div className='programming-editor-window-controls' aria-hidden='true'>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div className='programming-editor-tab'>
                                            {selectedQuestion?.title || 'Programming Question'}
                                        </div>
                                        <select
                                            className='programming-language-selector'
                                            value={selectedLanguage.label}
                                            onChange={(event) => {
                                                const language = programmingLanguages.find((item) => item.label === event.target.value);
                                                setSelectedLanguage(language || programmingLanguages[0]);
                                            }}
                                            disabled={isRequestInProgress || hasSubmitted}
                                        >
                                            {programmingLanguages.map((language) => (
                                                <option value={language.label} key={language.label}>
                                                    {language.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='programming-monaco-editor'>
                                        <Editor
                                            theme='vs-dark'
                                            language={selectedLanguage.value}
                                            value={selectedAnswer}
                                            onChange={handleAnswerChange}
                                            height='100%'
                                            path={`question-${selectedQuestion?.id || selectedQuestionIndex}-${selectedLanguage.label}`}
                                            options={{
                                                automaticLayout: true,
                                                autoClosingBrackets: 'always',
                                                autoClosingQuotes: 'always',
                                                autoIndent: 'full',
                                                bracketPairColorization: { enabled: true },
                                                cursorBlinking: 'smooth',
                                                cursorSmoothCaretAnimation: 'on',
                                                folding: true,
                                                foldingHighlight: true,
                                                formatOnPaste: true,
                                                formatOnType: true,
                                                lineNumbers: 'on',
                                                matchBrackets: 'always',
                                                minimap: { enabled: false },
                                                multiCursorModifier: 'alt',
                                                padding: { top: 14, bottom: 14 },
                                                readOnly: isRequestInProgress || hasSubmitted,
                                                scrollBeyondLastLine: false,
                                                smoothScrolling: true,
                                                tabSize: 4,
                                                wordWrap: 'on'
                                            }}
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className='py-4 bg-transparent border-0 d-flex justify-content-end'>
                                <ButtonComponent
                                    className='btn-brand px-5'
                                    buttonName={programmingTest?.submit_spinner ? <SpinnerComponent /> : 'Submit Answer'}
                                    clickFunction={() => setShowConfirmation(true)}
                                    btnDisable={!selectedQuestion?.id || !selectedAnswer.trim() || isRequestInProgress || hasSubmitted}
                                />
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
            </section>

            <Modal
                show={showConfirmation}
                centered
                backdrop='static'
                onHide={() => !isRequestInProgress && setShowConfirmation(false)}
                contentClassName='rounded-3'
            >
                <Modal.Header closeButton={!isRequestInProgress} className='border-0'>
                    <Modal.Title>
                        <h6 className='mb-0'>Submit Answer</h6>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-4'>
                    <div className='text-center py-4'>
                        {Icons?.closeTestIcon}
                        <h5 className='my-3'>Are you sure you want to submit this answer?</h5>
                        <p className='text-secondary mb-0'>Your answer will be saved before evaluation begins.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className='border-0'>
                    <div className='col-12 d-flex flex-wrap px-2'>
                        <div className='col-6 p-1 pb-0'>
                            <ButtonComponent
                                className='btn-secondary w-100 py-2'
                                buttonName='Close'
                                clickFunction={() => setShowConfirmation(false)}
                                btnDisable={isRequestInProgress}
                            />
                        </div>
                        <div className='col-6 p-1 pb-0'>
                            <ButtonComponent
                                className='btn-brand w-100 py-2'
                                buttonName={programmingTest?.submit_spinner ? <SpinnerComponent /> : 'Submit Answer'}
                                clickFunction={handleManualSubmit}
                                btnDisable={isRequestInProgress || hasSubmitted}
                            />
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ProgrammingAssessment;
