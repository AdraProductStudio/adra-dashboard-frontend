import React, { Fragment, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import { CalculateTestTime } from 'ResuableFunctions/CalculateTestTime';
import useCommonState, { initializeDB, useDispatch } from 'ResuableFunctions/CustomHooks';
import { handleCloseTestAutomatic, handleCloseTestManual, handleUpdateAnswer, handleUpdateMalpractice } from 'Views/InterviewCandidates/Action/interviewAction';
import { getQuestionFromDb, updateRemainingTestTiming, updateSelectedQuestionIndex } from 'Views/InterviewCandidates/Slice/interviewSlice';
import ProgressBarComp from 'Components/Progress/ProgressBar';
import ButtonComponent from 'Components/Button/Button';
import Checkbox from 'Components/Input/Checkbox';
import InterviewCandidatesHeader from 'Components/Panel_compnent/InterviewCandidatesHeader'
import Icons from 'Utils/Icons';
import { updateOverallModalData } from 'Views/Common/Slice/Common_slice';

const InterviewCandidatesHome = () => {
    const { interviewState, commonState } = useCommonState();
    const dispatch = useDispatch()

    useEffect(() => {
        const triggerMalpractice = () => {
            if (commonState?.involved_in_tab_switching > 0) {
                dispatch(handleUpdateMalpractice(commonState?.involved_in_tab_switching));
            } else {
                initializeDB(
                    process.env.REACT_APP_INDEXEDDB_DATABASE_NAME,
                    process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION,
                    process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME
                )
                    .then((db) => {
                        const transaction = db.transaction(
                            process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME,
                            "readonly"
                        );
                        const store = transaction.objectStore(
                            process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME
                        );
                        const getAllRequest = store.getAll();

                        getAllRequest.onsuccess = function () {
                            dispatch(
                                handleCloseTestAutomatic({
                                    close: "malpractice",
                                    candidate_answers: getAllRequest.result,
                                })
                            );
                        };

                        getAllRequest.onerror = function (event) {
                            console.error("Error fetching data from object store:", event.target.error);
                        };
                    })
                    .catch((error) => {
                        console.error("Database initialization failed:", error);
                    });
            }
        };

        // Tab switching / browser minimize
        const handleVisibilityChange = () => {
            if (interviewState?.isDataPresentInIndexedDb && document.visibilityState === "hidden" && commonState?.test_over_logout !== 'malpracticed_again') {
                triggerMalpractice();
            }
        };

        // Window switching (Alt+Tab or focus loss)
        const handleBlur = () => {
            if (interviewState?.isDataPresentInIndexedDb && commonState?.test_over_logout !== 'malpracticed_again') {
                triggerMalpractice();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [commonState?.involved_in_tab_switching, commonState?.test_over_logout, interviewState?.isDataPresentInIndexedDb, dispatch]);

    useEffect(() => {
        initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
            .then((db) => {
                const transaction = db.transaction(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME, "readonly");
                const store = transaction.objectStore(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME);

                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = function () {
                    if (commonState?.involved_in_tab_switching > 0) {
                        if (!getAllRequest.result?.length) {
                            dispatch(updateOverallModalData({ size: 'xl', from: 'interview_candidate', type: 'generate_question_modal', enable_lg_autoScroll: false }))
                        } else {
                            dispatch(getQuestionFromDb(getAllRequest.result))
                        }
                    } else {
                        dispatch(updateOverallModalData({ size: 'xl', from: 'interview_candidate', type: 'test_completed', enable_lg_autoScroll: false }))
                    }
                };
                getAllRequest.onerror = function (event) {
                    console.error("Error fetching data from object store:", event.target.error);
                };
            })
            .catch((error) => {
                console.error("Database initialization failed:", error);
            });
    }, []);

    useEffect(() => {
        if (commonState?.test_over_logout === 'malpracticed_again') {
            dispatch(updateOverallModalData({ size: 'md', from: 'interview_candidate', type: 'malpracticed_again', enable_lg_autoScroll: false }))
        }

        if (commonState?.test_over_logout === 'test_completed') {
            dispatch(updateOverallModalData({ size: 'xl', from: 'interview_candidate', type: 'test_completed', enable_lg_autoScroll: false }))
        }
    }, [])

    useEffect(() => {
        if (interviewState?.test_end_timeStamp && commonState?.involved_in_tab_switching > 0 && !commonState?.test_over_logout) {
            const timer = setInterval(() => {
                const updatedTimeLeft = CalculateTestTime(interviewState?.test_end_timeStamp);
                dispatch(updateRemainingTestTiming(updatedTimeLeft))

                if (!updatedTimeLeft) {
                    initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
                        .then((db) => {
                            const transaction = db.transaction(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME, "readonly");
                            const store = transaction.objectStore(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME);
                            const getAllRequest = store.getAll();
                            getAllRequest.onsuccess = function () {
                                dispatch(handleCloseTestAutomatic({ close: 'automatic', candidate_answers: getAllRequest.result }));
                            };
                            getAllRequest.onerror = function (event) {
                                console.error("Error fetching data from object store:", event.target.error);
                            };
                        })
                        .catch((error) => {
                            console.error("Database initialization failed:", error);
                        });
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [interviewState?.test_end_timeStamp, commonState?.involved_in_tab_switching, commonState?.test_over_logout])

    return (
        <div className='overflow-hidden applied_brand_color '>
            <InterviewCandidatesHeader />
            {
                interviewState?.isDataPresentInIndexedDb ?
                    <section className='main text-dark'>
                        <div className="h-100 d-flex flex-wrap p-5">
                            <div className="col-3 d-flex flex-column">
                                <Card className='h-100 border-0 shadow-sm rounded-3'>
                                    <Card.Header className='bg-white text-dark'>
                                        <h5 className='mb-0 py-2'>Number of Questions</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="col-12 d-flex flex-wrap">
                                            {interviewState?.generatedQuestions?.map((question, questionInd) => (
                                                <div className="col-2 my-2" key={questionInd}>
                                                    <ButtonComponent
                                                        className={`question_number_btn p-1 ${question?.candidate_answer ? "questions_answerd" : ""} ${questionInd === interviewState?.selectedQuestionIndex ? "active" : ""}`}
                                                        buttonName={questionInd + 1}
                                                        clickFunction={() => dispatch(updateSelectedQuestionIndex(questionInd))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>

                            <div className="col-9 px-2">
                                <Card className='h-100 border-0 shadow-sm rounded-3'>
                                    <Card.Header className='bg-white text-dark'>
                                        <h5 className='mb-0 py-2'>Questions</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className='mb-4'>
                                            <ProgressBarComp progressNow={interviewState?.answeredQuestionPercentage} animated={false} className="question-progress-bar" />
                                        </div>
                                        <div className="w-100 d-flex flex-wrap mb-3">
                                            <div className="col">
                                                <h5>
                                                    <strong>Question No:</strong>
                                                    <span>{interviewState?.selectedQuestionIndex + 1}</span>
                                                </h5>
                                            </div>
                                            <div className="col text-end me-3">
                                                {
                                                    interviewState?.calculate_remaining_time ?
                                                        <Fragment>
                                                            <span className='pe-2'>
                                                                {Icons?.timerIcon}
                                                            </span>

                                                            <span className='text-secondary pt-2'>
                                                                {interviewState?.calculate_remaining_time?.minutes} : {interviewState?.calculate_remaining_time?.seconds}
                                                            </span>
                                                        </Fragment>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>

                                        <p>{interviewState?.generatedQuestions[interviewState?.selectedQuestionIndex]?.question}</p>
                                        <div className='w-100'>
                                            {interviewState?.generatedQuestions[interviewState?.selectedQuestionIndex]?.options?.map((val, ind) => (
                                                <div className='border p-3 my-2 rounded-2 cursor-pointer' onClick={() => document.getElementById(val + ind)?.click()} key={ind}>
                                                    <Checkbox
                                                        formType="radio"
                                                        formLabel={val}
                                                        name={val}
                                                        formClassName="ps-4 test_radio_btn"
                                                        formId={val + ind}
                                                        formName={"options"}
                                                        change={() => dispatch(handleUpdateAnswer({ questionsArray: interviewState?.generatedQuestions, updationInd: interviewState?.selectedQuestionIndex, ans: val }))}
                                                        formChecked={interviewState?.generatedQuestions[interviewState?.selectedQuestionIndex]?.candidate_answer === val}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className='py-4 bg-transparent border-0 d-flex flex-wrap'>
                                        <div className="col">
                                            <ButtonComponent
                                                className="btn-brand px-5"
                                                buttonName="Previous"
                                                clickFunction={() => dispatch(updateSelectedQuestionIndex(interviewState?.selectedQuestionIndex - 1))}
                                                btnDisable={interviewState?.selectedQuestionIndex === 0}
                                            />
                                        </div>
                                        <div className="col text-end">
                                            <ButtonComponent
                                                className="btn-brand px-5"
                                                buttonName={interviewState?.generatedQuestions?.length - 1 <= interviewState?.selectedQuestionIndex ? "Submit" : "Next"}
                                                clickFunction={interviewState?.generatedQuestions?.length - 1 <= interviewState?.selectedQuestionIndex ?
                                                    () => dispatch(handleCloseTestManual)
                                                    :
                                                    () => dispatch(updateSelectedQuestionIndex(interviewState?.selectedQuestionIndex + 1))
                                                }
                                            />
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </div>

                            {/* <div className="col-2 d-flex flex-column">
                        <Card className='h-100 border-0 shadow-sm rounded-3'>
                            <Card.Header>
                                <h5 className='mb-0 py-2'>Rounds</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="col-12">
                                    {interviewRound?.map((round, roundInd) => (
                                        <div className="d-flex align-items-center px-2 w-100 mb-5 rounds_icon_line_relative" key={roundInd}>
                                            <div className="me-5">
                                                {Icons?.interviewRoundNonActiveIcon}
                                            </div>
                                            <div className={`col ${interviewRound?.length - 1 <= roundInd ? "rounds_icon_line_last" : "rounds_icon_line"}`}>{round}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div> */}
                        </div>
                    </section>
                    :
                    null
            }
        </div>
    )
}

export default InterviewCandidatesHome
