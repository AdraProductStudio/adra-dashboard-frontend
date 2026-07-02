import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader'
import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import ButtonComponent from "Components/Button/Button";
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks';
import JsonData from 'Utils/JsonData';
import { Inputfunctions } from 'ResuableFunctions/Inputfunctions';
import { handleGetRegistrationRoles, handleRegisterCandidate } from '../Action/interviewAction';
import SpinnerComponent from 'Components/Spinner/Spinner';
import Img from 'Components/Img/Img';
import Image from 'Utils/Image';

const InterviewCandidatesRegistration = () => {
    const { interviewState } = useCommonState();
    const { candidateRegistration } = JsonData()?.jsxJson;
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();

    useEffect(() => {
        dispatch(handleGetRegistrationRoles())
    }, [])

    return (
        <div className='overflow-hidden applied_brand_color candidate-registration-page'>
            <InterviewCandidatesHeader />

            <section className='main px-3 px-md-4'>
                <div className="h-100 d-flex flex-wrap align-items-center justify-content-center py-3">
                    {
                        interviewState?.registration_placeholder ?
                            <div className="campaign_detail_body d-flex flex-column justify-content-center align-items-center">
                                <Card className="candidate-registration-card border-0 shadow-sm rounded-3 text-center px-4 py-5">
                                    <SpinnerComponent />
                                    <h6 className='mt-3 mb-1 fw-bold candidate-registration-title'>Checking interview process</h6>
                                    <p className='mb-0 text-secondary fs-14'>Please wait while we prepare your registration.</p>
                                </Card>
                            </div>
                            :
                            interviewState?.registration_roles?.length ?
                                <div className="col-12 col-md-10 col-lg-8">
                                    <Card className='candidate-registration-card w-100 border-0 shadow-sm rounded-3 overflow-hidden'>
                                        <Card.Header className='candidate-registration-header px-3 px-md-4 py-3 border-0'>
                                            <h5 className='mb-0 fw-bold candidate-registration-title'>Candidate Registration</h5>
                                        </Card.Header>
                                        <Card.Body className='candidate-registration-body p-3 p-md-4 registration-form-height d-flex flex-wrap align-content-start'>
                                            {Inputfunctions(candidateRegistration)}
                                        </Card.Body>
                                    </Card>

                                    <div className='d-flex justify-content-end bg-transparent border-0 mt-3 mt-md-4'>
                                        <ButtonComponent
                                            type="button"
                                            className="btn-brand px-4 py-2 fw-semibold shadow-sm"
                                            buttonName={interviewState?.buttonSpinner ?
                                                <SpinnerComponent />
                                                :
                                                "Continue"
                                            }
                                            clickFunction={() => dispatch(handleRegisterCandidate({ candidateRegistration, input_data: interviewState?.candidateData || {} }, navigate))}
                                            btnDisable={interviewState?.buttonSpinner}
                                        />
                                    </div>
                                </div>
                                :
                                <Card className="candidate-registration-card col-12 col-md-10 col-lg-8 border-0 shadow-sm rounded-3 text-center px-4 py-5">
                                    <Img src={Image?.Task_empty} alt="no_campaigns" width="170em" />
                                    <h5 className='mt-3 mb-2 fw-bold candidate-registration-title'>No openings available</h5>
                                    <p className='text-secondary mb-4'>Sorry, no openings are available for registration.</p>
                                    <div>
                                        <ButtonComponent type="button" buttonName="Back to home" className="btn-dark px-4" clickFunction={() => navigate("/")} />
                                    </div>
                                </Card>
                    }
                </div>
            </section>
        </div >
    )
}

export default InterviewCandidatesRegistration
