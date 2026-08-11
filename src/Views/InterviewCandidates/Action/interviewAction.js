import axiosInstance from "Services/axiosInstance";
import { handleValidation } from "Views/Common/Action/Common_action";
import { closeTestMode, malpracticeTestClose, resetModalBox, updateMalpracticeData, updateToast } from "Views/Common/Slice/Common_slice";
import {
    updateCandidateData,
    registerCandidateRequest,
    registerCandidateResponse,
    registerCandidateFailure,
    getQuestionsRequest,
    getQuestionsResponse,
    getQuestionsFailure,
    updateAnswers,
    submitTestByManual,
    submitFirstAssessmentResponse,
    submitTestRequest,
    submitTestResponse,
    submitTestFailure,
    submitTestRequestSpinner,
    updateTimeOverCloseTest,
    getRegistrationRoles,
    candidateJourneyStatus,
    programmingTestStart,
    programmingTestSubmit,
    programmingTestEvaluate,
    qaTestStart,
    qaTestSubmit,
    qaTestEvaluate

} from "Views/InterviewCandidates/Slice/interviewSlice";
import { IndexedDbDeleteFun } from "Views/InterviewCandidates/IndexedDbDeleteFun";
import { initializeDB } from "ResuableFunctions/CustomHooks";
import { exitFullScreen, handleFullScreen } from "ResuableFunctions/fullscreenmode";
import { getCandidateStageRoute } from "Views/InterviewCandidates/candidateStageRoutes";

//                                                                 candidate registration on change 
export const handleInterviewRegistrationOnChange = ipVal => dispatch => {
    dispatch(updateCandidateData(ipVal))
}

//                                                                  candidate registration endpoint
export const handleGetRegistrationRoles = () => async (dispatch) => {
    try {
        dispatch(getRegistrationRoles({ type: 'request' }))
        const { data } = await axiosInstance.post("/get_registration_roles", { check_campaign: new Date() })

        if (data?.error_code === 0) dispatch(getRegistrationRoles({ type: 'response', data: data?.data }))
        else dispatch(getRegistrationRoles({ type: 'failure', message: data?.message }))
    } catch (Err) {
        dispatch(getRegistrationRoles({ type: 'failure', message: Err?.message }))
    }
}

export const handleRegisterCandidate = ({ candidateRegistration, input_data }, navigate) => async (dispatch) => {
    const fd = new FormData();
    let params = Object.assign({}, input_data);
    if ('image_show_ui' in params) delete params['image_show_ui'];


    const findNullEmptyValues = candidateRegistration
        .filter((items) => items?.isMandatory)
        .map((items) => items?.value)
        .some((value) => value === "" || (Array.isArray(value) && value.length === 0));

    if (findNullEmptyValues) {
        dispatch(handleValidation)
        return dispatch(updateToast({ message: "Please fill all the fields", type: "error" }));
    }

    Object.keys(params).forEach((key) => {
        if (key === 'image') fd.append(key, params[key][0]);
        else fd.append(key, params[key]);
    })

    try {
        dispatch(registerCandidateRequest())
        const { data } = await axiosInstance.post("/register_candidate", fd)

        if (data?.error_code === 0) {
            dispatch(registerCandidateResponse(data?.data))
            IndexedDbDeleteFun();
            navigate("/")
        }
        else dispatch(registerCandidateFailure(data?.message))

    } catch (Err) {
        dispatch(registerCandidateFailure(Err?.message))
    }
}

//                                                                   get generated questions                                                                       
export const handleGetQuestions = async (dispatch) => {
    handleFullScreen();
    try {
        dispatch(getQuestionsRequest())
        const { data } = await axiosInstance.get("/generate_random_question")

        if (data?.error_code === 0) dispatch(getQuestionsResponse(data?.data))
        else dispatch(getQuestionsFailure(data?.message))
    } catch (Err) {
        dispatch(getQuestionsFailure(Err?.message))
    }
}

//                                                                   update answers in index db                                                                     
export const handleUpdateAnswer = (data) => (dispatch) => {
    initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
        .then((db) => {
            const transaction = db.transaction(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME, "readwrite");
            const store = transaction.objectStore(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME);

            const targetIndex = data?.updationInd;
            const updatedAnswer = data?.ans;

            const getRequest = store.get(targetIndex);

            getRequest.onsuccess = function () {
                const targetObject = getRequest.result;
                if (targetObject) {
                    targetObject.candidate_answer = updatedAnswer;

                    const putRequest = store.put(targetObject);

                    putRequest.onsuccess = function () {
                        const getAllRequest = store.getAll();
                        getAllRequest.onsuccess = function () {
                            dispatch(updateAnswers(getAllRequest.result));
                        };
                    };

                    putRequest.onerror = function (event) {
                        console.error("Failed to update object:", event.target.error);
                    };
                } else {
                    console.error(`No object found with id: ${targetIndex}`);
                }
            };

            getRequest.onerror = function (event) {
                console.error("Failed to fetch object:", event.target.error);
            };

            transaction.oncomplete = function () {
                console.log("Transaction completed successfully.");
            };

            transaction.onerror = function (event) {
                console.error("Transaction failed:", event.target.error);
            };
        })
        .catch((error) => {
            console.error("Failed to open database:", error);
        })
};

export const handleCloseTestAndNavigate = dispatch => {
    dispatch(closeTestMode());
}

export const handleCloseTestAutomatic = (params) => async dispatch => {
    if (params?.close === 'malpractice') {
        exitFullScreen()
        dispatch(malpracticeTestClose())
    }
    else dispatch(updateTimeOverCloseTest())

    try {
        let sendCandidateAnswers = []
        for (let i = 0; i < params?.candidate_answers?.length; i++) {
            sendCandidateAnswers[sendCandidateAnswers?.length] = { _id: params.candidate_answers[i]?._id, candidate_answer: params.candidate_answers[i]?.candidate_answer }
        }

        let send_params = { close: params?.close || '', candidate_answers: sendCandidateAnswers }
        dispatch(submitTestRequest())
        const { data } = await axiosInstance.post("/validate_answers", send_params)
        if (data?.error_code === 0) {
            if (params?.close !== 'malpractice') dispatch(submitTestResponse())
            IndexedDbDeleteFun();
        } else dispatch(submitTestFailure(data?.message))
    }
    catch (Err) {
        dispatch(submitTestFailure(Err?.message))
    }
}

export const handleCloseTestManual = dispatch => {
    dispatch(submitTestByManual())
}

export const handleCloseTestEndpoint = (candidate_answers, navigate) => async dispatch => {
    try {
        let sendCandidateAnswers = []
        for (let i = 0; i < candidate_answers?.length; i++) {
            sendCandidateAnswers[sendCandidateAnswers?.length] = { _id: candidate_answers[i]?._id, candidate_answer: candidate_answers[i]?.candidate_answer }
        }

        dispatch(submitTestRequestSpinner())
        const { data } = await axiosInstance.post("/validate_answers", { close: 'automatic', candidate_answers: sendCandidateAnswers })
        if (data?.error_code === 0) {
            dispatch(submitFirstAssessmentResponse())
            dispatch(resetModalBox())
            IndexedDbDeleteFun();
            dispatch(candidateJourneyStatus({ type: "response", data: data?.data || {} }));

            const nextRoute = getCandidateStageRoute(data?.data?.next_stage);
            if (navigate && nextRoute) navigate(nextRoute, { replace: true });
        }
        else dispatch(submitTestFailure(data?.message))
    }
    catch (Err) {
        dispatch(submitTestFailure(Err?.message))
    }
}

export const handleGetCandidateCurrentStage = () => async (dispatch) => {
    try {
        dispatch(candidateJourneyStatus({ type: "request" }));
        const { data } = await axiosInstance.get("/candidate/current-stage");

        if (data?.error_code === 0) {
            dispatch(candidateJourneyStatus({ type: "response", data: data?.data || {} }));
            return data?.data || {};
        }

        const message = data?.message || "Unable to load candidate stage";
        dispatch(candidateJourneyStatus({ type: "failure", message }));
        return null;
    } catch (Err) {
        const message = Err?.message || "Unable to load candidate stage";
        dispatch(candidateJourneyStatus({ type: "failure", message }));
        return null;
    }
}

export const handleUpdateMalpractice = (params) => async (dispatch) => {
    try {
        const { data } = await axiosInstance.post("/update_involving_in_malpractice", { remaining_switching_count: params })
        if (data?.error_code === 0) {
            dispatch(updateMalpracticeData({ remaining_switching_count: data?.data?.involved_in_tab_switching }))
        }
    } catch (err) {
        console.error(err);
    }
}

export const handleStartProgrammingTest = () => async (dispatch) => {
    try {
        dispatch(programmingTestStart({ type: "request" }));
        const { data } = await axiosInstance.post("/programming-test/start");

        if (data?.error_code === 0) {
            dispatch(programmingTestStart({ type: "response", data: data?.data || {} }));
            return data?.data || {};
        }

        dispatch(programmingTestStart({ type: "failure", message: data?.message }));
        dispatch(updateToast({ message: data?.message || "Unable to start programming assessment", type: "error" }));
        return null;
    } catch (Err) {
        const message = Err?.message || "Unable to start programming assessment";
        dispatch(programmingTestStart({ type: "failure", message }));
        dispatch(updateToast({ message, type: "error" }));
        return null;
    }
}

export const handleSubmitProgrammingTest = (params) => async (dispatch) => {
    try {
        dispatch(programmingTestSubmit({ type: "request" }));
        const { data } = await axiosInstance.post("/programming-test/submit", params);

        if (data?.error_code === 0) {
            dispatch(programmingTestSubmit({ type: "response", data: data?.data || {} }));
            return data?.data || {};
        }

        dispatch(programmingTestSubmit({ type: "failure", message: data?.message }));
        dispatch(updateToast({ message: data?.message || "Unable to submit programming test", type: "error" }));
        return null;
    } catch (Err) {
        const message = Err?.message || "Unable to submit programming test";
        dispatch(programmingTestSubmit({ type: "failure", message }));
        dispatch(updateToast({ message, type: "error" }));
        return null;
    }
}

export const handleCloseProgrammingTestMalpractice = (params) => async (dispatch) => {
    try {
        exitFullScreen();
        dispatch(malpracticeTestClose());
        dispatch(programmingTestSubmit({ type: "request" }));

        const { data } = await axiosInstance.post("/programming-test/submit", { ...params, close: "malpractice" });

        if (data?.error_code === 0) {
            dispatch(programmingTestSubmit({ type: "response", data: data?.data || {} }));
            return data?.data || {};
        }

        dispatch(programmingTestSubmit({ type: "failure", message: data?.message }));
        dispatch(updateToast({ message: data?.message || "Unable to submit programming test", type: "error" }));
        return null;
    } catch (Err) {
        const message = Err?.message || "Unable to submit programming test";
        dispatch(programmingTestSubmit({ type: "failure", message }));
        dispatch(updateToast({ message, type: "error" }));
        return null;
    }
}

export const handleEvaluateProgrammingTest = ({ silent = false } = {}) => async (dispatch) => {
    try {
        dispatch(programmingTestEvaluate({ type: "request" }));
        const { data } = await axiosInstance.post("/programming-test/evaluate");

        if (data?.error_code === 0) {
            dispatch(programmingTestEvaluate({ type: "response", data: data?.data || {} }));
            if (!silent) {
                dispatch(updateToast({ message: data?.message || "Programming test evaluated successfully", type: "success" }));
            }
            return data?.data || {};
        }

        dispatch(programmingTestEvaluate({ type: "failure", data: data?.data || {}, message: data?.message }));
        if (!silent) {
            dispatch(updateToast({
                message: "Your solution has been submitted successfully. The evaluation is currently unavailable and will be processed shortly.",
                type: "error"
            }));
        }
        return data?.data || null;
    } catch (Err) {
        const message = Err?.message || "Evaluation unavailable";
        dispatch(programmingTestEvaluate({ type: "failure", message }));
        if (!silent) {
            dispatch(updateToast({
                message: "Your solution has been submitted successfully. The evaluation is currently unavailable and will be processed shortly.",
                type: "error"
            }));
        }
        return null;
    }
}

export const handleStartQaTest = () => async (dispatch) => {
    try {
        dispatch(qaTestStart({ type: "request" }));
        const { data } = await axiosInstance.post("/qa-test/start");

        if (data?.error_code === 0) {
            dispatch(qaTestStart({ type: "response", data: data?.data || {} }));
            return data?.data || {};
        }

        dispatch(qaTestStart({ type: "failure", message: data?.message }));
        dispatch(updateToast({ message: data?.message || "Unable to start QA assessment", type: "error" }));
        return null;
    } catch (Err) {
        const message = Err?.message || "Unable to start QA assessment";
        dispatch(qaTestStart({ type: "failure", message }));
        dispatch(updateToast({ message, type: "error" }));
        return null;
    }
}

export const handleSubmitQaTest = (params) => async (dispatch) => {
    try {
        dispatch(qaTestSubmit({ type: "request" }));
        const { data } = await axiosInstance.post("/qa-test/submit", params);

        if (data?.error_code === 0) {
            dispatch(qaTestSubmit({ type: "response", data: data?.data || {} }));
            return data?.data || {};
        }

        dispatch(qaTestSubmit({ type: "failure", message: data?.message }));
        dispatch(updateToast({ message: data?.message || "Unable to submit QA assessment", type: "error" }));
        return null;
    } catch (Err) {
        const message = Err?.message || "Unable to submit QA assessment";
        dispatch(qaTestSubmit({ type: "failure", message }));
        dispatch(updateToast({ message, type: "error" }));
        return null;
    }
}

export const handleCloseQaTestMalpractice = (params) => async (dispatch) => {
    exitFullScreen();
    dispatch(malpracticeTestClose());
    return dispatch(handleSubmitQaTest({ ...params, submit_reason: "malpractice" }));
}

export const handleEvaluateQaTest = ({ silent = false } = {}) => async (dispatch) => {
    try {
        dispatch(qaTestEvaluate({ type: "request" }));
        const { data } = await axiosInstance.post("/qa-test/evaluate");

        if (data?.error_code === 0) {
            dispatch(qaTestEvaluate({ type: "response", data: data?.data || {} }));
            if (!silent) {
                dispatch(updateToast({ message: data?.message || "QA assessment evaluated successfully", type: "success" }));
            }
            return data?.data || {};
        }

        dispatch(qaTestEvaluate({ type: "failure", data: data?.data || {}, message: data?.message }));
        if (!silent) {
            dispatch(updateToast({
                message: "Your QA assessment is saved. Evaluation will be processed shortly.",
                type: "error"
            }));
        }
        return data?.data || null;
    } catch (Err) {
        const message = Err?.message || "Evaluation unavailable";
        dispatch(qaTestEvaluate({ type: "failure", message }));
        if (!silent) {
            dispatch(updateToast({
                message: "Your QA assessment is saved. Evaluation will be processed shortly.",
                type: "error"
            }));
        }
        return null;
    }
}
