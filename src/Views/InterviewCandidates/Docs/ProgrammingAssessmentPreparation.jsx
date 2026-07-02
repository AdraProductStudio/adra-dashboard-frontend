import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader';
import { useCustomNavigate } from 'ResuableFunctions/CustomHooks';

const preparationSeconds = Number(process.env.REACT_APP_PROGRAMMING_ASSESSMENT_PREPARATION_SECONDS) || 300;

const ProgrammingAssessmentPreparation = () => {
    const [secondsLeft, setSecondsLeft] = useState(preparationSeconds);
    const navigate = useCustomNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((currentTime) => {
                if (currentTime <= 1) {
                    clearInterval(timer);
                    navigate('/candidates_home/programming-assessment', { replace: true });
                    return 0;
                }

                return currentTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className='overflow-hidden applied_brand_color programming-assessment-page'>
            <InterviewCandidatesHeader />
            <section className='main text-dark'>
                <div className="h-100 d-flex align-items-center justify-content-center p-4">
                    <Card className='border-0 shadow-sm rounded-3 programming-prep-card'>
                        <Card.Body className='text-center p-5'>
                            <span className='programming-prep-status'>Next Round</span>
                            <h3 className='programming-prep-title'>Preparing Programming Assessment</h3>
                            <div className='programming-prep-timer mx-auto'>
                                {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default ProgrammingAssessmentPreparation;
