import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import ButtonComponent from "Components/Button/Button";
import SpinnerComponent from "Components/Spinner/Spinner";
import InterviewCandidatesHeader from "Components/Panel_compnent/InterviewCandidatesHeader";
import useCommonState, { useDispatch } from "ResuableFunctions/CustomHooks";
import { handleGetCandidateCurrentStage } from "Views/InterviewCandidates/Action/interviewAction";
import { getCandidateStageRoute } from "Views/InterviewCandidates/candidateStageRoutes";

const CandidateStageRoute = ({ allowedStages, children }) => {
    const { interviewState } = useCommonState();
    const dispatch = useDispatch();
    const journey = interviewState?.candidate_journey || {};

    useEffect(() => {
        dispatch(handleGetCandidateCurrentStage());
    }, []);

    if (!journey.loaded || journey.spinner) {
        return (
            <div className='overflow-hidden applied_brand_color programming-assessment-page'>
                <InterviewCandidatesHeader />
                <section className='main text-dark'>
                    <div className='h-100 d-flex align-items-center justify-content-center'>
                        <SpinnerComponent />
                    </div>
                </section>
            </div>
        );
    }

    if (journey.error) {
        return (
            <div className='overflow-hidden applied_brand_color programming-assessment-page'>
                <InterviewCandidatesHeader />
                <section className='main text-dark'>
                    <div className='h-100 d-flex align-items-center justify-content-center p-4'>
                        <Card className='border-0 shadow-sm rounded-3 programming-prep-card'>
                            <Card.Body className='text-center p-5'>
                                <h4 className='mb-3'>Unable to load your assessment</h4>
                                <p className='text-secondary'>{journey.error}</p>
                                <ButtonComponent
                                    type='button'
                                    className='btn-brand px-4'
                                    buttonName='Retry'
                                    clickFunction={() => dispatch(handleGetCandidateCurrentStage())}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                </section>
            </div>
        );
    }

    if (allowedStages.includes(journey.current_stage)) {
        return children;
    }

    const correctRoute = getCandidateStageRoute(journey.current_stage);
    return correctRoute ? <Navigate to={correctRoute} replace /> : <Navigate to="/" replace />;
};

export default CandidateStageRoute;
