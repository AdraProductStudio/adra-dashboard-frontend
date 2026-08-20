import ButtonComponent from 'Components/Button/Button';
import Img from 'Components/Img/Img';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { PiClockCountdown } from "react-icons/pi";
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import Icons from 'Utils/Icons';
import { updateOverallModalData } from 'Views/Common/Slice/Common_slice';

const CampaignCandidatesCard = ({
    data, clickFunction,
    detail_view, card_className

}) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [programmingTimeLeft, setProgrammingTimeLeft] = useState("");
    const dispatch = useDispatch();

    function apti_status(status) {
        if (status === "Test Completed") return "Test Completed";
        else if (status === "Not Started") return "Not Started";
        else if (status === "Test Started") return "Test Started";
        else if (status === "malpractice") return "Malpractice";

        return "Unknown Status";
    }

    function apti_status_colors(status) {
        if (status === "Test Completed") return 'test_completed_badge';
        else if (status === "Not Started") return 'test_not_started_badge';
        else if (status === "Test Started") return 'test_progress_badge';
        else if (status === "malpractice") return 'test_not_started_badge';

        return 'test_progress_badge';
    }

    function programming_status_colors(status) {
        if (status === "Completed") return 'test_completed_badge';
        else if (status === "In Progress") return 'test_progress_badge';
        else if (status === "Malpractice") return 'test_not_started_badge';

        return 'test_not_started_badge';
    }

    useEffect(() => {
        const calculateTimeLeft = () => {
            const testStartedOn = new Date(data?.test_EndedOn);
            const testEndsOn = new Date(testStartedOn.getTime());
            const now = new Date();
            const timeLeftMs = testEndsOn - now;

            if (timeLeftMs <= 0) {
                setTimeLeft("Test time is over");
            } else {
                const minutes = Math.floor(timeLeftMs / 60000);
                const seconds = ((timeLeftMs % 60000) / 1000).toFixed(0);
                setTimeLeft(`${minutes}m ${seconds}s left`);
            }
        };

        calculateTimeLeft();

        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [data?.test_EndedOn]);

    useEffect(() => {
        const calculateProgrammingTimeLeft = () => {
            if (data?.programming_assessment?.status !== "In Progress" || !data?.programming_assessment?.test_started_on) {
                setProgrammingTimeLeft("");
                return;
            }

            const startedOn = new Date(data.programming_assessment.test_started_on).getTime();
            const durationSeconds = Number(data?.programming_assessment?.duration) || 0;

            if (Number.isNaN(startedOn) || !durationSeconds) {
                setProgrammingTimeLeft("");
                return;
            }

            const endsOn = startedOn + durationSeconds * 1000;
            const timeLeftMs = endsOn - Date.now();

            if (timeLeftMs <= 0) {
                setProgrammingTimeLeft("Test time is over");
            } else {
                const minutes = Math.floor(timeLeftMs / 60000);
                const seconds = Math.floor((timeLeftMs % 60000) / 1000);
                setProgrammingTimeLeft(`${minutes}m ${seconds}s left`);
            }
        };

        calculateProgrammingTimeLeft();

        const timer = setInterval(calculateProgrammingTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [
        data?.programming_assessment?.duration,
        data?.programming_assessment?.status,
        data?.programming_assessment?.test_started_on
    ]);

    function test_score(score) {
        if (!score) return "0 / 0";

        const { scored } = Object.values(score).reduce(
            (acc, val) => {
                if (typeof val === "string") {
                    const match = val.match(/(\d+)\s*out of\s*(\d+)/i);
                    if (match) {
                        const s = Number(match[1]);
                        const t = Number(match[2]);
                        return {
                            scored: acc.scored + (s || 0),
                            total: acc.total + (t || 0),
                        };
                    }
                }
                else if (typeof val === "number") {
                    return {
                        scored: acc.scored + val,
                        total: acc.total,
                    };
                }
                return acc;
            },
            { scored: 0, total: 0 }
        );

        return scored;
    }

    function programming_grade_label(grade) {
        if (grade === "Worst") return "Progressing";
        if (grade === "Better") return "Good";
        if (grade === "Good") return "Excelent";

        return grade;
    }

    const activeEvaluationStatuses = ["Pending", "Queued", "Processing", "In Progress"];

    const isQaFlow = data?.assessment_flow === 'qa';
    const showTimer = !isQaFlow && data?.status !== "Test Completed" && timeLeft !== "Test time is over" && data?.status !== "malpractice";
    const scoreValue = test_score(data?.test_score);
    const programmingStatus = data?.programming_assessment?.status;
    const programmingEvaluation = data?.programming_assessment?.ai_evaluation || {};
    const programmingGrade = programmingEvaluation?.grade;
    const programmingScore = programmingEvaluation?.score;
    const showProgrammingStatus = programmingStatus && programmingStatus !== "Not Started";
    const showProgrammingTimer = programmingStatus === "In Progress" && programmingTimeLeft && programmingTimeLeft !== "Test time is over";
    const showProgrammingResult = programmingStatus === "Completed" || programmingEvaluation?.status === "Completed";
    const programmingGradeValue = programmingGrade ? programming_grade_label(programmingGrade) : (activeEvaluationStatuses.includes(programmingEvaluation?.status) ? "Pending" : "-");
    const programmingScoreValue = programmingScore !== null && programmingScore !== undefined ? `${programmingScore}/100` : null;
    const qaAssessment = data?.qa_assessment || {};
    const qaStatus = qaAssessment?.status;
    const qaEvaluation = qaAssessment?.ai_evaluation || {};
    const showQaStatus = isQaFlow && qaStatus && qaStatus !== "Not Started";
    const showQaResult = isQaFlow && (qaStatus === "Completed" || qaEvaluation?.status === "Completed");
    const qaGradeValue = qaEvaluation?.grade ? programming_grade_label(qaEvaluation.grade) : (
        activeEvaluationStatuses.includes(qaEvaluation?.status)
            ? "Pending"
            : "-"
    );
    const qaScoreValue = qaEvaluation?.score !== null && qaEvaluation?.score !== undefined
        ? `${qaEvaluation.score}/100`
        : null;
    const activeTimers = [
        showTimer ? {
            label: "MCQ Assessment",
            value: timeLeft,
            note: "Candidate can still complete the MCQ test"
        } : null,
        showProgrammingTimer ? {
            label: "Programming Assessment",
            value: programmingTimeLeft,
            note: "Candidate can still complete the programming test"
        } : null
    ].filter(Boolean);

    const cardStyles = {
        border: '1px solid #E7EDF3',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)'
    };

    const headerStyles = {
        background: 'linear-gradient(145deg, #F7FAFC 0%, #EEF5FF 55%, #F9FBFF 100%)'
    };

    const avatarWrapStyles = {
        width: detail_view ? '8.5rem' : '6.9rem',
        height: detail_view ? '8.5rem' : '6.9rem',
        borderRadius: '28px',
        padding: detail_view ? '0.4rem' : '0.3rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(15, 23, 42, 0.06))',
        boxShadow: '0 18px 38px rgba(15, 23, 42, 0.10)'
    };

    const quickMeta = [data?.gender, data?.age].filter(Boolean);
    const contactData = [
        { icon: Icons.mailIcon, value: data?.email || '-', label: 'Email' },
        { icon: Icons.locationIcon, value: data?.address || '-', label: 'Location' },
        { icon: Icons.phoneIcon, value: data?.phoneNumber || '-', label: 'Phone' },
        { icon: Icons.qualificationIcon, value: data?.candidateQualification || '-', label: 'Qualification' }
    ];
    const detailData = [
        { label: 'Current salary', value: data?.currentSalary || "-" },
        { label: 'Expected salary', value: data?.expectedSalary || "-" },
        { label: 'Marital status', value: data?.maritalStatus || "-" },
        { label: 'Total Experience', value: data?.canditateExpType || "-" },
        { label: 'Previous Company Name', value: data?.previousCompanyName || "-" },
        { label: 'Parent Occupation', value: data?.parentOccupation || "-" },
        { label: 'School (SSLC)', value: data?.sslcSchoolName || "-" },
        { label: 'SSLC Marks', value: data?.sslcMarks || "-" },
        { label: 'School (HSC)', value: data?.hscSchoolName || "-" },
        { label: 'HSC Marks', value: data?.hscMarks || "-" },
        { label: 'College Name', value: data?.collegeName || "-" },
        { label: 'College Marks', value: data?.collegeMarks || "-" }
    ];

    return (
        <Card
            className={`campaign-candidate-card border-0 shadow-sm rounded-4 h-100 position-relative ${detail_view ? 'campaign-candidate-card--detail' : 'overflow-hidden'} ${card_className || ''}`}
            style={cardStyles}
        >
            <div className="campaign-candidate-card__accent" />

            <Card.Header className='border-0 px-3 px-xl-4 pt-3 pb-3 position-relative' style={headerStyles}>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div className="d-flex flex-wrap gap-2">
                        {!isQaFlow && (
                            <div className={`interview_candidate_badge ${apti_status_colors(data?.status || '')}`}>
                                {apti_status(data?.status || '')}
                            </div>
                        )}

                        {isQaFlow && (
                            <div className='interview_candidate_badge test_progress_badge'>
                                QA Flow
                            </div>
                        )}

                        {showProgrammingStatus && (
                            <div className={`interview_candidate_badge ${programming_status_colors(programmingStatus)}`}>
                                Programming: {programmingStatus}
                            </div>
                        )}

                        {showQaStatus && (
                            <div className={`interview_candidate_badge ${programming_status_colors(qaStatus)}`}>
                                QA: {qaStatus}
                            </div>
                        )}
                    </div>

                    {!detail_view && (
                        <ButtonComponent
                            type="button"
                            buttonName={Icons.deleteIcon}
                            className="btn campaign-candidate-card__action-btn ms-auto"
                            clickFunction={() => dispatch(updateOverallModalData({ size: 'md', from: 'admin', type: 'delete_candidate', data: data }))}
                        />
                    )}
                </div>

                <div className={`campaign-candidate-card__hero ${detail_view ? 'campaign-candidate-card__hero--detail' : ''}`}>
                    <div className={`campaign-candidate-card__identity ${detail_view ? 'campaign-candidate-card__identity--detail' : ''}`}>
                        <div className="flex-shrink-0" style={avatarWrapStyles}>
                            <Img
                                src={data?.profile_photo_path ? `${process.env.REACT_APP_CDN_URL}${data?.profile_photo_path}` : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                                alt="Fellowship Candidate"
                                className="fellowship_candidate_image campaign-candidate-card__image"
                            />
                        </div>

                        <div className={`flex-grow-1 ${detail_view ? 'w-100' : ''}`}>
                            <div className={`d-flex ${detail_view ? 'flex-column align-items-center' : 'flex-wrap align-items-center'} gap-2 mb-2`}>
                                <h5 className='mb-0 fw-semibold text-dark campaign-candidate-card__title' style={{ overflowWrap: 'anywhere' }}>
                                    {data?.name || 'Unnamed Candidate'}
                                </h5>
                                {!detail_view && data?.experience && (
                                    <span className='campaign-candidate-card__meta-pill'>
                                        {data?.experience}
                                    </span>
                                )}
                            </div>

                            {quickMeta.length ? (
                                <div className={`d-flex ${detail_view ? 'justify-content-center' : ''} flex-wrap gap-2 mb-2`}>
                                    {quickMeta.map((item, index) => (
                                        <span className='campaign-candidate-card__meta-chip' key={index}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            {!detail_view && (
                                <div className='campaign-candidate-card__subtitle text-secondary'>
                                    Candidate profile overview
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`campaign-candidate-card__status-panel ${detail_view ? 'mx-auto campaign-candidate-card__status-panel--detail' : ''}`}>
                        {activeTimers.length ? (
                            <div className='d-grid gap-2'>
                                {activeTimers.map((timer) => (
                                    <div className='d-flex align-items-start gap-2 text-dark' key={timer.label}>
                                        <div className='campaign-candidate-card__status-icon'>
                                            <PiClockCountdown size={18} className='flex-shrink-0 text-primary' />
                                        </div>
                                        <div>
                                            <div className='campaign-candidate-card__eyebrow'>{timer.label}</div>
                                            <div className='campaign-candidate-card__status-value'>{timer.value}</div>
                                            <div className='campaign-candidate-card__status-note'>{timer.note}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='campaign-candidate-card__score-panel d-grid gap-2'>
                                {!isQaFlow && (
                                    <div>
                                        <div className='campaign-candidate-card__eyebrow'>MCQ Score</div>
                                        <div className='campaign-candidate-card__score-value'>{scoreValue}</div>
                                    </div>
                                )}

                                {isQaFlow && !showProgrammingResult && (
                                    <div>
                                        <div className='campaign-candidate-card__eyebrow'>Current Stage</div>
                                        <div className='campaign-candidate-card__status-value text-capitalize'>
                                            {(data?.current_stage || 'Programming preparation').replace(/_/g, ' ')}
                                        </div>
                                    </div>
                                )}

                                {showProgrammingResult && (
                                    <div className='pt-2 border-top'>
                                        <div className='campaign-candidate-card__eyebrow'>Programming Grade</div>
                                        <div className='campaign-candidate-card__status-value'>{programmingGradeValue}</div>
                                        {programmingScoreValue && (
                                            <div className='campaign-candidate-card__status-note'>
                                                Score: {programmingScoreValue}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showQaResult && (
                                    <div className='pt-2 border-top'>
                                        <div className='campaign-candidate-card__eyebrow'>QA Assessment Grade</div>
                                        <div className='campaign-candidate-card__status-value'>{qaGradeValue}</div>
                                        {qaEvaluation?.status === "Completed" && qaScoreValue && (
                                            <div className='campaign-candidate-card__status-note'>
                                                Score: {qaScoreValue}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className='campaign-candidate-card__status-note'>
                                    {data?.status === "malpractice"
                                        ? 'Candidate flagged during assessment'
                                        : isQaFlow && !showProgrammingResult
                                            ? 'Programming assessment is the first round'
                                            : 'Assessment closed'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card.Header>

            <Card.Body className='px-3 px-xl-4 pt-3 pb-0'>
                {detail_view && !isQaFlow && data?.test_score && (
                    <div className='campaign-candidate-card__section mb-3'>
                        <div className='d-flex justify-content-between align-items-center gap-2 mb-3'>
                            <h6 className='mb-0 fw-semibold text-dark'>Marks scored</h6>
                            <span className='campaign-candidate-card__score-total'>
                                Total: {scoreValue}
                            </span>
                        </div>

                        <ul className='list-unstyled m-0 d-grid gap-2'>
                            {Object.entries(data?.test_score || {}).map(([key, value], index) => (
                                <li className='campaign-candidate-card__marks-row' key={index}>
                                    <span className='fw-medium text-dark'>{key}</span>
                                    <span className='text-secondary'>{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div
                    className={`campaign-candidate-card__section ${!detail_view ? 'campaign-candidate-card__clickable-section' : ''} pt-0`}
                    onClick={!detail_view ? clickFunction : null}
                >
                    <div className='campaign-candidate-card__section-head'>
                        <h6 className='mb-0 fw-semibold text-dark'>{detail_view ? 'Contact details' : 'Quick details'}</h6>
                    </div>
                    <div className='d-grid gap-2'>
                        {contactData.map((item, index) => (
                            <div className='campaign-candidate-card__info-row' key={index}>
                                <div className='campaign-candidate-card__info-icon'>
                                    {item.icon}
                                </div>
                                <div className='flex-grow-1' style={{ minWidth: 0 }}>
                                    <div className='campaign-candidate-card__eyebrow mb-1'>{item.label}</div>
                                    <div className='text-break text-dark'>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card.Body>

            <Card.Footer className='border-0 bg-transparent px-3 px-xl-4 pt-3 pb-3 pb-xl-4'>
                {!detail_view && (
                    <div className='row g-2'>
                        <div className='col-6'>
                            <div className='campaign-candidate-card__salary-box h-100'>
                                <div className='campaign-candidate-card__eyebrow mb-1'>Current salary</div>
                                <div className='fw-semibold text-dark text-break campaign-candidate-card__salary-value'>{data?.currentSalary || '-'}</div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='campaign-candidate-card__salary-box h-100'>
                                <div className='campaign-candidate-card__eyebrow mb-1'>Expected salary</div>
                                <div className='fw-semibold text-dark text-break campaign-candidate-card__salary-value'>{data?.expectedSalary || '-'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {detail_view && (
                    <div className="campaign-candidate-card__section pt-3">
                        <h6 className='mb-3 fw-semibold text-dark'>Additional details</h6>
                        <div className="row g-2">
                            {detailData.map((item, index) => (
                                <div className="col-12 col-xl-6" key={index}>
                                    <div className='campaign-candidate-card__detail-box h-100'>
                                        <div className='campaign-candidate-card__eyebrow mb-1'>{item.label}</div>
                                        <div className='text-dark text-break'>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
};

export default CampaignCandidatesCard;
