import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import InterviewCandidatesHeader from "Components/Panel_compnent/InterviewCandidatesHeader";
import useCommonState, { useDispatch } from "ResuableFunctions/CustomHooks";
import { handleGetCandidateCurrentStage } from "Views/InterviewCandidates/Action/interviewAction";
import { CANDIDATE_STAGES } from "Views/InterviewCandidates/candidateStageRoutes";

const AssessmentPreparation = ({ assessmentName }) => {
    const { interviewState } = useCommonState();
    const dispatch = useDispatch();
    const journey = interviewState?.candidate_journey || {};
    const [secondsLeft, setSecondsLeft] = useState(0);
    const transitionRequestedRef = useRef(false);
    const roundLabel = journey.assessment_flow === 'qa' && journey.current_stage === CANDIDATE_STAGES.QA_PREPARATION
        ? 'First Round'
        : 'Second Round';

    const serverOffset = useMemo(() => {
        const serverTime = new Date(journey.server_time).getTime();
        return Number.isFinite(serverTime) ? serverTime - Date.now() : 0;
    }, [journey.server_time]);

    useEffect(() => {
        transitionRequestedRef.current = false;

        const calculateRemainingSeconds = () => {
            const preparationEndsAt = new Date(journey.preparation_ends_at).getTime();
            if (!Number.isFinite(preparationEndsAt)) return 0;

            return Math.max(
                Math.ceil((preparationEndsAt - (Date.now() + serverOffset)) / 1000),
                0
            );
        };

        const syncTimer = () => {
            const remainingSeconds = calculateRemainingSeconds();
            setSecondsLeft(remainingSeconds);

            if (remainingSeconds === 0 && !transitionRequestedRef.current) {
                transitionRequestedRef.current = true;
                dispatch(handleGetCandidateCurrentStage());
            }
        };

        syncTimer();
        const timer = setInterval(syncTimer, 1000);

        return () => clearInterval(timer);
    }, [
        journey.preparation_ends_at,
        serverOffset
    ]);

    const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

    return (
        <div className='overflow-hidden applied_brand_color programming-assessment-page'>
            <InterviewCandidatesHeader />
            <section className='main text-dark'>
                <div className="h-100 d-flex align-items-center justify-content-center p-4">
                    <Card className='border-0 shadow-sm rounded-3 programming-prep-card'>
                        <Card.Body className='text-center p-5'>
                            <span className='programming-prep-status'>{roundLabel}</span>
                            <h3 className='programming-prep-title'>Preparing {assessmentName}</h3>
                            <div className='programming-prep-timer mx-auto'>
                                {formattedTime}
                            </div>
                            <p className='text-secondary mt-4 mb-0'>
                                Keep this page open. Your assessment will start automatically.
                            </p>
                        </Card.Body>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default AssessmentPreparation;
