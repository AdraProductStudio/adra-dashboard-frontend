import React from "react";
import { Card } from "react-bootstrap";
import InterviewCandidatesHeader from "Components/Panel_compnent/InterviewCandidatesHeader";
import Icons from "Utils/Icons";

const CandidateJourneyCompleted = () => {
    return (
        <div className='overflow-hidden applied_brand_color programming-assessment-page'>
            <InterviewCandidatesHeader />
            <section className='main text-dark'>
                <div className='h-100 d-flex align-items-center justify-content-center p-4'>
                    <Card className='border-0 shadow-sm rounded-4 programming-prep-card'>
                        <Card.Body className='text-center p-5'>
                            <div className='test-completed-icon mx-auto mb-4'>
                                {Icons.testSucccess}
                            </div>
                            <span className='programming-prep-status'>Completed</span>
                            <h3 className='programming-prep-title mb-3'>Assessment completed</h3>
                            <p className='text-secondary mb-0'>
                                Thank you. Your responses have been submitted successfully.
                            </p>
                        </Card.Body>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default CandidateJourneyCompleted;
