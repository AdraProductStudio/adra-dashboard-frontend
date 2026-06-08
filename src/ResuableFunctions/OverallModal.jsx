import ButtonComponent from "Components/Button/Button";
import useCommonState, { useCustomNavigate, useDispatch } from "ResuableFunctions/CustomHooks";
import ModalComponent from "Components/Modal/Modal";
import SpinnerComponent from "Components/Spinner/Spinner";
import JsonData from "Utils/JsonData";
import Icons from "Utils/Icons";
import { resetModalBox, updateModalShow } from "Views/Common/Slice/Common_slice";
import { handleCloseTestAndNavigate, handleCloseTestEndpoint, handleGetQuestions } from "Views/InterviewCandidates/Action/interviewAction";
import { Inputfunctions } from "./Inputfunctions";
import { handleAddOrUpdateQuestionPattern, handleCreateCampaign, handleDeleteCampaign, handleDeleteCandidate, handleDeleteQuestionPattern, handleEditCampaign, handleEditQuestionPattern } from "Views/Admin/Action/AdminAction";
import { edit_campaign_data } from "Views/Admin/Slice/AdminSlice";
import { useState } from "react";
import Image from "Utils/Image";
import ButtonSpinner from "Components/Spinner/ButtonSpinner";

export function OverallModel() {
    const { commonState, interviewState, adminState } = useCommonState();
    const [agreed, setAgreed] = useState(false);
    const dispatch = useDispatch();
    const JsonJsx = JsonData()?.jsxJson;
    const navigate = useCustomNavigate();

    function modalHeaderFun() {
        switch (commonState?.modal_from) {
            case "admin":
                switch (commonState?.modal_type) {
                    case "create_campaign":
                        return <h6 className='mb-0'>Create campaign</h6>;

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    function modalBodyFun() {
        switch (commonState?.modal_from) {
            case "interview_candidate":
                switch (commonState?.modal_type) {
                    case "generate_question_modal":
                        return <div className="w-100 instructions_height overflowY">
                            <div className="h-100 row align-items-center justify-content-center w-100">
                                <div className="col-12 col-lg-10 col-xl-9">
                                    <div className="">
                                        <div className="">
                                            <h2 className="interview-instructions__title text-center brand_color">Welcome to Applied</h2>
                                            <p className="interview-instructions__subtitle mb-0 text-center">
                                                Review the instructions before starting your test.
                                            </p>
                                        </div>

                                        <div className="interview-instructions__body">
                                            <h3 className="interview-instructions__section-title">Test Instructions</h3>
                                            <ul className="interview-instructions__list">
                                                <li>Do not switch tabs or minimize the test window during the exam.</li>
                                                <li>Ensure you have a stable internet connection throughout the test.</li>
                                                <li>Do not use mobile phones, calculators, or external devices unless permitted.</li>
                                                <li>You must complete the test within the given time limit.</li>
                                                <li>Once the test begins, do not refresh or close the browser.</li>
                                                <li>Any suspicious activity may result in disqualification.</li>
                                            </ul>

                                            <div className="interview-instructions__agreement">
                                                <label className="interview-instructions__checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreed}
                                                        onChange={(e) => setAgreed(e.target.checked)}
                                                    />
                                                    <span>I have read and agree to the instructions</span>
                                                </label>

                                                <button
                                                    className="interview-instructions__button"
                                                    onClick={() => dispatch(handleGetQuestions)}
                                                    disabled={!agreed || interviewState?.start_test_spinner}
                                                >
                                                    {interviewState?.start_test_spinner ? "Getting Questions..." : "Start Test"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    case "malpractice_detected":
                        return <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" >
                            <div className="card shadow-lg border-0 text-center p-5" style={{ maxWidth: "500px", borderRadius: "20px" }} >
                                <div className="card-body">
                                    <div className="mb-4">
                                        {Icons?.warningIcon}
                                    </div>
                                    <h3 className="text-danger fw-bold">Malpractice Detected</h3>
                                    <p className="text-muted mt-3">
                                        Switching tabs or minimizing the window is not allowed.
                                        <br />
                                        If you do this again, the test will be automatically closed.
                                    </p>
                                    <button className="btn btn-warning px-4 mt-4 fw-bold" onClick={() => dispatch(resetModalBox())} >
                                        Resume Test
                                    </button>
                                </div>
                            </div>
                        </div >

                    case "malpracticed_again":
                        return <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" >
                            <div className="card shadow-lg border-0 text-center p-5" style={{ maxWidth: "500px", borderRadius: "20px" }} >
                                <div className="card-body">
                                    <div className="mb-4">
                                        {Icons?.warningIcon}
                                    </div>
                                    <h3 className="text-danger fw-bold">Malpractice Detected Again</h3>
                                    <h3 className="text-danger fw-bold">Test Closed</h3>
                                    <p className="text-muted mt-3">
                                        You violated the rules multiple times. The test has been terminated.
                                    </p>
                                    <button className="btn btn-danger px-4 mt-4 fw-bold"
                                        onClick={() => dispatch(handleCloseTestAndNavigate)}>
                                        Exit
                                    </button>
                                </div>
                            </div>
                        </div >

                    case "test_completed":
                        return <div className="w-100 test-completed-modal">
                            <div className="row align-items-center justify-content-center h-100 w-100 m-0">
                                <div className="col-12 col-md-10 col-lg-8 col-xl-7">
                                    <div className="text-center">
                                        <div className="test-completed-icon mx-auto">
                                            {Icons?.testSucccess}
                                        </div>
                                        <span className="test-completed-status">Submitted successfully</span>
                                        <h4 className="test-completed-title">Test completed</h4>
                                        <p className="test-completed-message">
                                            Thank you for completing your assessment. Your responses have been submitted successfully.
                                        </p>
                                        <div className="test-completed-note">
                                            You can now close this window and wait for the next update from the recruitment team.
                                        </div>
                                    </div>
                                    <ButtonComponent
                                        buttonName="Close"
                                        className="btn-brand test-completed-button"
                                        clickFunction={() => dispatch(handleCloseTestAndNavigate)}
                                    />
                                </div>
                            </div>
                        </div>

                    case "time_finished":
                        return <div className="w-100 interview_candidate_height">
                            <div className="row py-5 align-items-center justify-content-center h-100 w-100">
                                <div className="col-6 text-center">
                                    <h5 className="text-center my-3">Time up</h5>
                                    <p className="text-secondary">Submitting your response....</p>
                                    <SpinnerComponent />
                                </div>
                            </div>
                        </div>

                    case "submit_confirmation":
                        return <div className="w-100 submit_confirmation_height">
                            <div className="row py-5 align-items-center justify-content-center h-100 w-100">
                                <div className="col-6 text-center">
                                    {Icons?.closeTestIcon}
                                    <h5 className="text-center my-3">Are you sure do you want to submit the test</h5>
                                </div>
                            </div>
                        </div>

                    default:
                        break;
                }
                break;

            case "admin":
                switch (commonState?.modal_type) {
                    case "create_campaign":
                        return <div className="col-11 mx-auto py-2">
                            {Inputfunctions(JsonJsx?.create_campaign_inputs)}
                            <ButtonSpinner
                                className="btn btn-primary text-center w-100 mt-3"
                                title={adminState?.create_campaign?._id ? "Update" : "Create"}
                                is_spinner={adminState?.create_update_campaign_spinner || false}
                                clickFunction={adminState?.create_campaign?._id ?
                                    () => dispatch(handleEditCampaign(adminState?.create_campaign))
                                    :
                                    () => dispatch(handleCreateCampaign({ job_title: adminState?.create_campaign?.job_title, interview_date: adminState?.create_campaign?.interview_date, test_time_duration: adminState?.create_campaign?.test_time_duration, company_flag: adminState?.create_campaign?.company_flag }))}
                            />
                        </div>

                    case "delete_campaign":
                        return <div className="col-11 mx-auto py-2">
                            <div className="col text-center">
                                <img src={Image?.CandidatesNotFound} alt="delete campaign" width='100em' />
                                <h5 className="mt-3">Delete Campaign</h5>
                                <p>Are you sure you want to delete this
                                    <span className="fw-bold px-2">{commonState?.modalData?.job_title}</span>
                                    campaign?
                                </p>
                            </div>
                            <ButtonSpinner
                                className="btn btn-outline-danger text-center w-100 mt-3"
                                title={adminState?.delete_campaign_spinner ? "Deleting..." : "Delete"}
                                is_spinner={adminState?.delete_campaign_spinner || false}
                                clickFunction={() => dispatch(handleDeleteCampaign(commonState?.modalData))}
                            />
                        </div>

                    case "delete_candidate":
                        return <div className="col-11 mx-auto py-2">
                            <div className="col text-center">
                                <img src={Image?.CandidatesNotFound} alt="delete candidate" width='100em' />
                                <h5 className="mt-3">Delete Candidate</h5>
                                <p>Are you sure you want to delete candidate
                                    <br />
                                    <span className="fw-bold px-2 ">{commonState?.modalData?.name}</span>
                                    ?
                                </p>
                            </div>
                            <ButtonSpinner
                                className="btn btn-outline-danger text-center w-100 mt-3"
                                title="Delete"
                                is_spinner={adminState?.delete_candidate_spinner || false}
                                clickFunction={() => dispatch(handleDeleteCandidate(commonState?.modalData))}
                            />
                        </div>

                    case "assign_question":
                        return <div className="col-12 mx-auto py-2 row h-100 ">
                            <div className="col-lg-5 row align-items-center border-end pe-4">
                                {Inputfunctions(JsonJsx?.admin_create_assigning_questions)}

                                <ButtonSpinner
                                    className="btn btn-primary text-center w-100 mt-3"
                                    title={adminState?.create_assigning_questions?._id ? "Update" : "Add"}
                                    clickFunction={
                                        adminState?.create_assigning_questions?._id ?
                                            () => dispatch(handleEditQuestionPattern({ ...adminState?.create_assigning_questions, campaign_id: adminState?.campaigns_data?._id }))
                                            :
                                            () => dispatch(handleAddOrUpdateQuestionPattern({ ...adminState?.create_assigning_questions, campaign_id: adminState?.campaigns_data?._id }))
                                    }
                                />
                            </div>

                            <div className="col-lg-7 row ps-2 align-items-start">
                                {
                                    adminState?.campaigns_data?.question_pattern?.length ?
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <table className="col-12 table table-hover mt-2">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Type</th>
                                                        <th scope="col">Level</th>
                                                        <th scope="col">Count</th>
                                                        <th scope="col">Edit</th>
                                                        <th scope="col">Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminState?.campaigns_data?.question_pattern?.map((item, index) => (
                                                        <tr className="py-2">
                                                            <td className="col text-secondary">{item?.question_type}</td>
                                                            <td className="col text-secondary">{item?.difficulty_level}</td>
                                                            <td className="col text-secondary">{item?.questions_count}</td>
                                                            <td className="col text-secondary">
                                                                <ButtonComponent
                                                                    type="button"
                                                                    className="btn-transparent"
                                                                    buttonName={Icons?.editIcon}
                                                                    clickFunction={() => dispatch(edit_campaign_data(item))}
                                                                />
                                                            </td>
                                                            <td className="col text-secondary">
                                                                <ButtonComponent
                                                                    type="button"
                                                                    className="btn-transparent"
                                                                    buttonName={Icons?.deleteIcon}
                                                                    clickFunction={() => dispatch(handleDeleteQuestionPattern({ question_id: item?._id, campaign_id: adminState?.campaigns_data?._id }))}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <span>Total number of Questions: {
                                                                adminState?.campaigns_data?.question_pattern?.reduce(
                                                                    (acc, curr) => acc + Number(curr.questions_count || 0),
                                                                    0
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            <p className="d-flex justify-content-end mb-0">
                                                <ButtonComponent buttonName="Save" className="btn-primary w-25 " clickFunction={() => dispatch(updateModalShow(false))} />
                                            </p>
                                        </div>
                                        :
                                        <div className="col-12 text-center">
                                            <p className="text-secondary">Question pattern not added. its looks like empty!!!</p>
                                        </div>
                                }
                            </div>
                        </div>
                    default:
                        break;
                }
        }
    }

    function modalFooterFun() {
        switch (commonState?.modal_from) {
            case "interview_candidate":
                switch (commonState?.modal_type) {
                    case "submit_confirmation":
                        return <div className='col-12 d-flex flex-wrap px-2'>
                            <div className="col-6 p-1 pb-0">
                                <ButtonComponent
                                    className="btn-secondary w-100 py-2"
                                    buttonName="Close"
                                    clickFunction={() => dispatch(updateModalShow())}
                                    btnDisable={interviewState?.submit_test}
                                />
                            </div>
                            <div className="col-6 p-1 pb-0">
                                <ButtonComponent
                                    buttonName={
                                        interviewState?.submit_test ?
                                            <SpinnerComponent />
                                            :
                                            "Submit test"
                                    }
                                    className="btn-brand w-100"
                                    clickFunction={() => dispatch(handleCloseTestEndpoint(interviewState?.generatedQuestions))}
                                />
                            </div>
                        </div>

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    return (
        <ModalComponent
            show={commonState?.modalShow}
            modalSize={commonState?.modalSize}
            modalCentered={true}
            modalCloseButton={commonState?.modal_close_btn}
            showModalHeader={commonState?.modal_type === "assign_question" && adminState?.campaigns_data?.question_pattern?.length > 0 ? false : true}
            modalHeaderClassname="border-0"
            modalHeader={modalHeaderFun()}
            modalBodyClassname={`${/lg|xl/.test(commonState?.modalSize) && commonState?.enable_lg_autoScroll ? "model_height_lg rounded-4" : ''} py-2`}
            modalBody={<div className='d-flex flex-wrap p-3 py-0 h-100'>{modalBodyFun()}</div>}
            showModalFooter={true}
            modalFooterClassname="border-0"
            modalFooter={modalFooterFun()}
            modalClassname={'rounded-3'}
        />
    )
}
