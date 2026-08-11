import ButtonComponent from 'Components/Button/Button'
import CampaignCandidatesCard from 'Components/Card/CampaignCandidatesCard';
import Checkbox from 'Components/Input/Checkbox';
import SpinnerComponent from 'Components/Spinner/Spinner';
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks'
import { handleGetIndividualCampaignCandidate } from 'Views/Admin/Action/AdminAction';
import QaAssessmentDetails from 'Views/Admin/Docs/Campaign/QaAssessmentDetails';

const getProgrammingStatusClass = (status) => {
    if (status === "Completed") return "test_completed_badge";
    if (status === "In Progress") return "test_progress_badge";
    if (status === "Malpractice") return "test_not_started_badge";
    return "test_not_started_badge";
};

const getProgrammingRemainingSeconds = (programmingAssessment) => {
    if (programmingAssessment?.status !== "In Progress" || !programmingAssessment?.test_started_on) return null;

    const startedOn = new Date(programmingAssessment.test_started_on).getTime();
    if (Number.isNaN(startedOn)) return null;

    const duration = Number(programmingAssessment?.duration) || 0;
    const elapsedSeconds = Math.floor((Date.now() - startedOn) / 1000);

    return Math.max(duration - elapsedSeconds, 0);
};

const formatProgrammingRemainingTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "-";

    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");

    return `${minutes} : ${remainingSeconds}`;
};

const getProgrammingGradeLabel = (grade) => {
    if (grade === "Worst") return "Progressing";
    if (grade === "Better") return "Good";
    if (grade === "Good") return "Excelent";
    return grade || "Progressing";
};

const getProgrammingGradeClass = (grade) => {
    if (grade === "Excelent") return "test_completed_badge";
    if (grade === "Good") return "test_progress_badge";
    return "test_not_started_badge";
};

const Campaign_candidate_details = () => {
    const { campaign_id, candidate_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();
    const { adminState } = useCommonState();
    const candidateDetails = adminState?.campaign_candidate_details || {};
    const programmingAssessment = adminState?.campaign_candidate_details?.programming_assessment || {};
    const qaAssessment = candidateDetails?.qa_assessment || {};
    const isQaFlow = candidateDetails?.assessment_flow === 'qa';
    const shouldShowQaAssessment = isQaFlow || Boolean(qaAssessment?._id) || candidateDetails?.assessment_type === 'qa';
    const programmingStatus = programmingAssessment?.status || "Not Started";
    const programmingEvaluation = programmingAssessment?.ai_evaluation || {};
    const programmingDuration = programmingAssessment?.duration;
    const programmingStartedOn = programmingAssessment?.test_started_on;
    const programmingEvaluationStatus = programmingEvaluation?.status;
    const programmingQuestion = programmingAssessment?.selected_question || {};
    const programmingAnswer = programmingAssessment?.candidate_answer;
    const programmingSubmissions = Array.isArray(programmingAssessment?.submissions) ? programmingAssessment.submissions : [];
    const programmingQuestionEvaluations = Array.isArray(programmingEvaluation?.question_evaluations) ? programmingEvaluation.question_evaluations : [];
    const displayedProgrammingSubmissions = programmingSubmissions.length
        ? programmingSubmissions
        : (programmingQuestion?.title || programmingQuestion?.description || programmingAnswer)
            ? [{
                question_id: 1,
                title: programmingQuestion?.title,
                description: programmingQuestion?.description,
                candidate_answer: programmingAnswer
            }]
            : [];
    const isProgrammingInProgress = programmingStatus === "In Progress";
    const isProgrammingCompleted = programmingStatus === "Completed";
    const isProgrammingEvaluationPending = isProgrammingCompleted && programmingEvaluationStatus === "Pending";
    const isProgrammingEvaluationFailed = isProgrammingCompleted && programmingEvaluationStatus === "Failed";
    const isProgrammingEvaluationCompleted = isProgrammingCompleted && programmingEvaluationStatus === "Completed";
    const hasProgrammingSubmission = displayedProgrammingSubmissions.length > 0;
    const [programmingRemainingSeconds, setProgrammingRemainingSeconds] = useState(null);

    const getProgrammingQuestionEvaluation = (questionId) => (
        programmingQuestionEvaluations.find((evaluation) => Number(evaluation?.question_id) === Number(questionId)) || {}
    );

    useEffect(() => {
        dispatch(handleGetIndividualCampaignCandidate({ candidate_id }))
    }, [candidate_id])

    useEffect(() => {
        const syncRemainingTime = () => {
            setProgrammingRemainingSeconds(getProgrammingRemainingSeconds({
                duration: programmingDuration,
                status: programmingStatus,
                test_started_on: programmingStartedOn
            }));
        };

        syncRemainingTime();

        if (!isProgrammingInProgress) return undefined;

        const timer = setInterval(syncRemainingTime, 1000);

        return () => clearInterval(timer);
    }, [
        isProgrammingInProgress,
        programmingDuration,
        programmingStartedOn,
        programmingStatus
    ])

    return (
        adminState?.campaign_candidate_glow ?
            <div className="campaign_detail_body d-flex flex-column justify-content-center align-items-center">
                <div className="col-5 text-center">
                    <SpinnerComponent />
                    <p className='mt-2'>Collecting user details</p>
                </div>
            </div>
            :
            <Fragment>
                <div className="campaign_header border-bottom">
                    <div className="w-70">
                        <ButtonComponent type="button" buttonName="Back" className="btn btn-outline-secondary mb-2" clickFunction={() => navigate(`/dashboard/interview/${campaign_id}`)} />
                        <h6 className='mb-0 mt-2'>{adminState?.campaign_candidate_details?.name || ''} full details</h6>
                    </div>
                </div>
                <div className="campaign_detail_body">
                    {adminState?.campaign_candidate_details ?
                        <div className="row py-3 h-100">
                            <div className="col-4 h-100">
                                <CampaignCandidatesCard data={adminState?.campaign_candidate_details} detail_view={true} card_className="h-100 campaign_candidate_overflow" />
                            </div>
                            <div className="col-8 h-100 campaign_candidate_overflow p-4">
                                {isQaFlow ? (
                                    <div className="col-12 pb-3 border-bottom">
                                        <div className='campaign-candidate-card__detail-box'>
                                            <div className='campaign-candidate-card__eyebrow mb-1'>Assessment Flow</div>
                                            <div className='text-dark fw-semibold'>QA Assessment → Programming Assessment</div>
                                            <div className='text-secondary mt-1'>This flow does not include an MCQ round.</div>
                                        </div>
                                    </div>
                                ) : (
                                    <Fragment>
                                        <h6>Assigned Questions</h6>
                                        {adminState?.campaign_candidate_details?.assigned_questions?.map((item, index) => (
                                            <div className="col-12 py-2 border-bottom" key={item?._id || index}>
                                                <p>{index + 1} .{item?.question}</p>
                                                <div className='w-100'>
                                                    {item?.options?.map((val, ind) => (
                                                        <div className='border p-3 my-2 rounded-2 cursor-pointer' key={`${index}-${ind}`}>
                                                            <Checkbox
                                                                formType="radio"
                                                                formLabel={val}
                                                                formValue={item?.answer}
                                                                name={val}
                                                                formClassName={`ps-4 test_radio_btn pe-none ${item?.candidate_answer === val ? item?.candidate_answer === item?.answer ? 'text-success' : 'text-danger' : ''}`}
                                                                formId={index + ind}
                                                                formName={`question_${index}`}
                                                                formChecked={item?.candidate_answer === val}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className='text-success'>Correct answer: {item?.answer}</p>
                                            </div>
                                        ))}
                                    </Fragment>
                                )}

                                <div className="col-12 py-3 border-bottom">
                                    <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3'>
                                        <h6 className='mb-0'>Programming Assessment</h6>
                                        <div className={`interview_candidate_badge ${getProgrammingStatusClass(programmingStatus)}`}>
                                            {programmingStatus}
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12 col-md-4">
                                            <div className='campaign-candidate-card__detail-box h-100'>
                                                <div className='campaign-candidate-card__eyebrow mb-1'>Assessment Status</div>
                                                <div className='text-dark fw-semibold'>{programmingStatus}</div>
                                            </div>
                                        </div>

                                        {isProgrammingInProgress && (
                                            <div className="col-12 col-md-4">
                                                <div className='campaign-candidate-card__detail-box h-100'>
                                                    <div className='campaign-candidate-card__eyebrow mb-1'>Remaining Time</div>
                                                    <div className='text-dark fw-semibold'>
                                                        {formatProgrammingRemainingTime(programmingRemainingSeconds)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {hasProgrammingSubmission && (
                                            <Fragment>
                                                <div className="col-12 col-md-4">
                                                    <div className='campaign-candidate-card__detail-box h-100'>
                                                        <div className='campaign-candidate-card__eyebrow mb-1'>Selected Language</div>
                                                        <div className='text-dark fw-semibold text-break'>{programmingAssessment?.selected_language || "-"}</div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <h6 className='mb-2'>Programming Questions & Answers</h6>
                                                </div>
                                                {displayedProgrammingSubmissions.map((submission, index) => {
                                                    const questionEvaluation = getProgrammingQuestionEvaluation(submission?.question_id);
                                                    const hasQuestionEvaluation = questionEvaluation?.score !== undefined || questionEvaluation?.grade;
                                                    const questionGrade = getProgrammingGradeLabel(questionEvaluation?.grade);

                                                    return (
                                                        <div className="col-12" key={submission?.question_id || index}>
                                                            <div className='campaign-candidate-card__detail-box h-100'>
                                                                <div className='d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2'>
                                                                    <div>
                                                                        <div className='campaign-candidate-card__eyebrow mb-1'>Question {index + 1}</div>
                                                                        <div className='text-dark fw-semibold text-break'>{submission?.title || "-"}</div>
                                                                    </div>
                                                                    {hasQuestionEvaluation && (
                                                                        <div className='d-flex flex-wrap gap-2'>
                                                                            <span className='interview_candidate_badge test_progress_badge'>
                                                                                Score: {questionEvaluation?.score ?? 0}/100
                                                                            </span>
                                                                            <span className={`interview_candidate_badge ${getProgrammingGradeClass(questionGrade)}`}>
                                                                                {questionGrade}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className='text-secondary text-break mb-3'>{submission?.description || "-"}</div>
                                                                {submission?.sample && (
                                                                    <pre className='mb-3 text-secondary' style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{submission.sample}</pre>
                                                                )}
                                                                <div className='campaign-candidate-card__eyebrow mb-1'>Candidate Answer</div>
                                                                <pre className='mb-0 text-dark' style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{submission?.candidate_answer || "Unanswered"}</pre>
                                                                {questionEvaluation?.feedback && (
                                                                    <Fragment>
                                                                        <div className='campaign-candidate-card__eyebrow mt-3 mb-1'>Evaluation Feedback</div>
                                                                        <div className='text-dark text-break'>{questionEvaluation.feedback}</div>
                                                                    </Fragment>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </Fragment>
                                        )}

                                        {isProgrammingEvaluationCompleted && (
                                            <Fragment>
                                                <div className="col-12 col-md-4">
                                                    <div className='campaign-candidate-card__detail-box h-100'>
                                                        <div className='campaign-candidate-card__eyebrow mb-1'>AI Evaluation Status</div>
                                                        <div className='text-dark fw-semibold'>{programmingEvaluation?.status || "-"}</div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <div className='campaign-candidate-card__detail-box h-100'>
                                                        <div className='campaign-candidate-card__eyebrow mb-1'>Grade</div>
                                                        <div className='text-dark fw-semibold'>{getProgrammingGradeLabel(programmingEvaluation?.grade)}</div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <div className='campaign-candidate-card__detail-box h-100'>
                                                        <div className='campaign-candidate-card__eyebrow mb-1'>Score</div>
                                                        <div className='text-dark fw-semibold'>
                                                            {programmingEvaluation?.score !== null && programmingEvaluation?.score !== undefined ? `${programmingEvaluation.score}/100` : "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className='campaign-candidate-card__detail-box h-100'>
                                                        <div className='campaign-candidate-card__eyebrow mb-1'>Feedback</div>
                                                        <div className='text-dark text-break'>{programmingEvaluation?.feedback || "-"}</div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )}

                                        {isProgrammingEvaluationPending && (
                                            <div className="col-12 col-md-4">
                                                <div className='campaign-candidate-card__detail-box h-100'>
                                                    <div className='campaign-candidate-card__eyebrow mb-1'>AI Evaluation Status</div>
                                                    <div className='text-dark fw-semibold'>AI Evaluation in Progress</div>
                                                </div>
                                            </div>
                                        )}

                                        {isProgrammingEvaluationFailed && (
                                            <Fragment>
                                                <div className="col-12 col-md-4">
                                                    <div className='campaign-candidate-card__detail-box h-100'>
                                                        <div className='campaign-candidate-card__eyebrow mb-1'>AI Evaluation Status</div>
                                                        <div className='text-danger fw-semibold'>AI Evaluation Failed</div>
                                                    </div>
                                                </div>
                                                {programmingEvaluation?.error && (
                                                    <div className="col-12">
                                                        <div className='campaign-candidate-card__detail-box h-100'>
                                                            <div className='campaign-candidate-card__eyebrow mb-1'>Error Message</div>
                                                            <div className='text-danger text-break'>{programmingEvaluation.error}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Fragment>
                                        )}
                                    </div>
                                </div>

                                {shouldShowQaAssessment ? (
                                    <QaAssessmentDetails qaAssessment={qaAssessment} />
                                ) : null}

                            </div>
                        </div>
                        :
                        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                            <div className="col-5 text-center">
                                <h6 className='text-secondary'>No Candidates Found</h6>
                            </div>
                        </div>
                    }
                </div>
            </Fragment>
    )
}

export default Campaign_candidate_details
