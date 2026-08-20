import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { initializeDB } from "ResuableFunctions/CustomHooks";
import { decryptData, encryptData } from "Security/Crypto/Crypto";

const interviewSlice = createSlice({
    name: "Interview_slice",
    initialState: {
        candidateData: {},
        buttonSpinner: false,
        initialGlow: false,
        generatedQuestions: [],
        isDataPresentInIndexedDb: false,
        selectedQuestionIndex: 0,
        answeredQuestionPercentage: 0,
        test_end_timeStamp: Cookies.get('log') ? decryptData(Cookies.get('log'))?.testEndOn : '',
        calculate_remaining_time: null,
        submit_test: false,
        candidate_journey: {
            spinner: false,
            loaded: false,
            assessment_flow: null,
            next_assessment_type: null,
            active_assessment_type: null,
            current_stage: null,
            preparation_ends_at: null,
            can_start_assessment: false,
            server_time: null,
            error: null
        },
        programming_test: {
            start_spinner: false,
            submit_spinner: false,
            evaluate_spinner: false,
            assessment_id: null,
            test_started_on: null,
            duration: 300,
            remaining_seconds: null,
            status: null,
            submit_status: null,
            evaluation_status: null,
            evaluation: null,
            evaluation_error_message: '',
            assessment_flow: null,
            next_stage: null,
            preparation_ends_at: null,
            submissions: [],
            questions: []
        },
        qa_test: {
            start_spinner: false,
            submit_spinner: false,
            evaluate_spinner: false,
            assessment_id: null,
            status: null,
            submit_status: null,
            evaluation_status: null,
            evaluation_error_message: '',
            assessment_flow: null,
            next_stage: null,
            preparation_ends_at: null,
            questions: [],
            answers: [],
            grid: {
                maximum_rows: 30,
                maximum_columns: 10,
                maximum_cell_characters: 2000
            },
            test_started_on: null,
            test_ends_on: null,
            server_time: null,
            duration_seconds: 1800,
            remaining_seconds: null
        }
    },
    reducers: {
        updateCandidateData(state, action) {
            const [key, value] = Object.entries(action.payload)[0];
            state.candidateData[key] = value;

            Object.entries(action.payload)?.map(([keys, value]) => {
                switch (key) {
                    case "maritalStatus":
                        state.candidateData.childrens = "";
                        break;

                    case "experience":
                        state.candidateData.previousCompanyName = "";
                        state.candidateData.designation = "";
                        state.candidateData.canditateExpType = "";
                        break;

                    case "canditateRole":
                        const campaign_data = state?.registration_roles?.find(item => item?.job_title === value);
                        state.candidateData.campaign_id = campaign_data?._id || "";
                        break;
                }

                state.candidateData[keys] = value;
            })
        },
        getQuestionFromDb(state, action) {
            const answeredQues = action.payload?.filter((v) => v?.candidate_answer !== '')
            return {
                ...state,
                generatedQuestions: action.payload,
                isDataPresentInIndexedDb: action.payload?.length ? true : false,
                answeredQuestionPercentage: answeredQues?.length / action.payload?.length * 100
            }
        },

        //Register candidates
        registerCandidateRequest(state, action) {
            return {
                ...state,
                buttonSpinner: true
            }
        },
        registerCandidateResponse(state, action) {
            return {
                ...state,
                buttonSpinner: false,
                candidateData: {}
            }
        },
        registerCandidateFailure(state, action) {
            return {
                ...state,
                buttonSpinner: false
            }
        },


        //Get Generated Questions
        getQuestionsRequest(state, action) {
            return {
                ...state,
                start_test_spinner: true
            }
        },
        getQuestionsResponse(state, action) {
            initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
                .then((db) => {
                    const transaction = db.transaction(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME, "readwrite");
                    const store = transaction.objectStore(process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME);
                    const objects = action?.payload?.assigned_questions;

                    objects?.forEach((obj, ind) => store.put({ ...obj, id: ind })); // Add or update objects
                    transaction.oncomplete = () => console.log("Objects added successfully!");
                })
                .catch((error) => {
                    console.error("Database initialization failed:", error);
                })

            if (action?.payload?.test_EndedOn) {
                let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
                decrypt_cookie.testEndOn = action?.payload?.test_EndedOn || '';
                Cookies.set('log', encryptData(decrypt_cookie));
            }

            return {
                ...state,
                generatedQuestions: action?.payload?.assigned_questions || [],
                test_end_timeStamp: action?.payload?.test_EndedOn || null,
                isDataPresentInIndexedDb: action?.payload?.assigned_questions ? true : false,
                start_test_spinner: false
            }
        },
        getQuestionsFailure(state, action) {
            return {
                ...state,
                start_test_spinner: false
            }
        },


        updateSelectedQuestionIndex(state, action) {
            return {
                ...state,
                selectedQuestionIndex: action.payload
            }
        },

        //Update answer and 
        updateAnswers(state, action) {
            const answeredQues = action.payload?.filter((v) => v?.candidate_answer !== '')

            return {
                ...state,
                generatedQuestions: action.payload,
                answeredQuestionPercentage: answeredQues?.length / action.payload?.length * 100
            }
        },


        updateRemainingTestTiming(state, action) {
            return {
                ...state,
                calculate_remaining_time: action.payload
            }
        },
        updateTimeOverCloseTest(state, action) {
            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            delete decrypt_cookie.testEndOn;
            Cookies.set('log', encryptData(decrypt_cookie));

            return {
                ...state,
                calculate_remaining_time: null,
                test_end_timeStamp: null,
                calculate_remaining_time: null,
                answeredQuestionPercentage: 0,
                selectedQuestionIndex: 0,
                generatedQuestions: [],
                isDataPresentInIndexedDb: false
            }
        },
        submitTestRequest(state, action) {
            return {
                ...state,
                buttonSpinner: true
            }
        },
        submitTestByManual(state, action) {
            return { ...state }
        },
        submitTestResponse(state, action) {
            return {
                ...state,
                buttonSpinner: false,
                submit_test: false
            }
        },
        submitFirstAssessmentResponse(state, action) {
            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            delete decrypt_cookie.testEndOn;
            Cookies.set('log', encryptData(decrypt_cookie));

            return {
                ...state,
                buttonSpinner: false,
                submit_test: false,
                calculate_remaining_time: null,
                test_end_timeStamp: null,
                answeredQuestionPercentage: 0,
                selectedQuestionIndex: 0,
                generatedQuestions: [],
                isDataPresentInIndexedDb: false
            }
        },
        submitTestFailure(state, action) {
            return {
                ...state,
                buttonSpinner: false,
                submit_test: false
            }
        },
        submitTestRequestSpinner(state, action) {
            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            delete decrypt_cookie.testEndOn;
            Cookies.set('log', encryptData(decrypt_cookie));

            return {
                ...state,
                submit_test: true,
                calculate_remaining_time: null,
                test_end_timeStamp: null,
                calculate_remaining_time: null,
                answeredQuestionPercentage: 0,
                selectedQuestionIndex: 0,
                generatedQuestions: [],
                isDataPresentInIndexedDb: false
            }
        },
        getRegistrationRoles(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case 'request':
                    state.registration_placeholder = true;
                    state.registration_roles = [];
                    break;

                case 'response':
                    state.registration_placeholder = false;
                    state.registration_roles = data || [];
                    break;

                case 'failure':
                    state.registration_placeholder = false;
                    state.registration_roles = [];
                    break;
            }
        },
        candidateJourneyStatus(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.candidate_journey.spinner = true;
                    state.candidate_journey.error = null;
                    break;

                case "response":
                    state.candidate_journey = {
                        spinner: false,
                        loaded: true,
                        assessment_flow: data?.assessment_flow || data?.next_assessment_type || null,
                        next_assessment_type: data?.next_assessment_type || null,
                        active_assessment_type: data?.active_assessment_type || null,
                        current_stage: data?.current_stage || data?.next_stage || null,
                        preparation_ends_at: data?.preparation_ends_at || null,
                        can_start_assessment: Boolean(data?.can_start_assessment),
                        server_time: data?.server_time || new Date().toISOString(),
                        error: null
                    };
                    break;

                case "failure":
                    state.candidate_journey.spinner = false;
                    state.candidate_journey.loaded = true;
                    state.candidate_journey.error = message || "Unable to load candidate stage";
                    break;

                default:
                    break;
            }
        },
        programmingTestStart(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.programming_test.start_spinner = true;
                    state.programming_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.programming_test.start_spinner = false;
                    state.programming_test.assessment_id = data?._id || null;
                    state.programming_test.test_started_on = data?.test_started_on || null;
                    state.programming_test.duration = data?.duration || 300;
                    state.programming_test.status = data?.status || null;
                    state.programming_test.submit_status = ["Completed", "Malpractice"].includes(data?.status) ? "Completed" : null;
                    state.programming_test.evaluation_status = data?.ai_evaluation?.status || null;
                    state.programming_test.evaluation = data?.ai_evaluation || null;
                    state.programming_test.submissions = data?.submissions || [];
                    state.programming_test.questions = data?.questions || [];
                    break;

                case "failure":
                    state.programming_test.start_spinner = false;
                    state.programming_test.evaluation_error_message = message || '';
                    break;

                default:
                    break;
            }
        },
        updateProgrammingTestRemainingSeconds(state, action) {
            state.programming_test.remaining_seconds = action.payload;
        },
        programmingTestSubmit(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.programming_test.submit_spinner = true;
                    state.programming_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.programming_test.submit_spinner = false;
                    state.programming_test.status = data?.status || "Completed";
                    state.programming_test.submit_status = "Completed";
                    state.programming_test.evaluation_status = data?.ai_evaluation?.status || state.programming_test.evaluation_status;
                    state.programming_test.submissions = data?.submissions || state.programming_test.submissions;
                    state.programming_test.assessment_flow = data?.assessment_flow || null;
                    state.programming_test.next_stage = data?.next_stage || null;
                    state.programming_test.preparation_ends_at = data?.preparation_ends_at || null;
                    break;

                case "failure":
                    state.programming_test.submit_spinner = false;
                    state.programming_test.evaluation_error_message = message || '';
                    break;

                default:
                    break;
            }
        },
        programmingTestEvaluate(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.programming_test.evaluate_spinner = true;
                    state.programming_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.programming_test.evaluate_spinner = false;
                    state.programming_test.evaluation_status = data?.evaluation_status || data?.ai_evaluation?.status || "Completed";
                    state.programming_test.evaluation = data?.ai_evaluation || state.programming_test.evaluation;
                    break;

                case "failure":
                    state.programming_test.evaluate_spinner = false;
                    state.programming_test.evaluation_status = data?.evaluation_status || "Failed";
                    state.programming_test.evaluation = data?.ai_evaluation || state.programming_test.evaluation;
                    state.programming_test.evaluation_error_message = message || "Evaluation unavailable";
                    break;

                default:
                    break;
            }
        },
        qaTestStart(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.qa_test.start_spinner = true;
                    state.qa_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.qa_test.start_spinner = false;
                    state.qa_test.assessment_id = data?.assessment_id || null;
                    state.qa_test.status = data?.status || null;
                    state.qa_test.submit_status = ["Completed", "Malpractice"].includes(data?.status)
                        ? "Completed"
                        : null;
                    state.qa_test.evaluation_status = data?.evaluation_status || "Pending";
                    state.qa_test.questions = data?.questions || [];
                    state.qa_test.answers = data?.answers || [];
                    state.qa_test.grid = data?.grid || state.qa_test.grid;
                    state.qa_test.test_started_on = data?.test_started_on || null;
                    state.qa_test.test_ends_on = data?.test_ends_on || null;
                    state.qa_test.server_time = data?.server_time || null;
                    state.qa_test.duration_seconds = data?.duration_seconds || 1800;
                    break;

                case "failure":
                    state.qa_test.start_spinner = false;
                    state.qa_test.evaluation_error_message = message || '';
                    break;

                default:
                    break;
            }
        },
        updateQaTestRemainingSeconds(state, action) {
            state.qa_test.remaining_seconds = action.payload;
        },
        qaTestSubmit(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.qa_test.submit_spinner = true;
                    state.qa_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.qa_test.submit_spinner = false;
                    state.qa_test.status = data?.status || "Completed";
                    state.qa_test.submit_status = "Completed";
                    state.qa_test.evaluation_status = data?.evaluation_status || state.qa_test.evaluation_status;
                    state.qa_test.assessment_flow = data?.assessment_flow || null;
                    state.qa_test.next_stage = data?.next_stage || null;
                    state.qa_test.preparation_ends_at = data?.preparation_ends_at || null;
                    break;

                case "failure":
                    state.qa_test.submit_spinner = false;
                    state.qa_test.evaluation_error_message = message || '';
                    break;

                default:
                    break;
            }
        },
        qaTestEvaluate(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.qa_test.evaluate_spinner = true;
                    state.qa_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.qa_test.evaluate_spinner = false;
                    state.qa_test.evaluation_status = data?.evaluation_status || "Completed";
                    break;

                case "failure":
                    state.qa_test.evaluate_spinner = false;
                    state.qa_test.evaluation_status = data?.evaluation_status || "Failed";
                    state.qa_test.evaluation_error_message = message || "Evaluation unavailable";
                    break;

                default:
                    break;
            }
        }

    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(loginResponse, (state, action) => {
    //             state.isDataPresentInIndexedDb = false
    //             state.generatedQuestions = []
    //             state.test_end_timeStamp = null
    //             state.calculate_remaining_time = null
    //         })
    // }
})


export const { actions, reducer } = interviewSlice;

export const {
    updateCandidateData,
    getQuestionFromDb,
    registerCandidateRequest,
    registerCandidateResponse,
    registerCandidateFailure,
    getQuestionsRequest,
    getQuestionsResponse,
    getQuestionsFailure,
    updateSelectedQuestionIndex,
    updateAnswers,
    updateRemainingTestTiming,
    updateTimeOverCloseTest,
    submitTestByManual,
    submitTestRequest,
    submitTestResponse,
    submitFirstAssessmentResponse,
    submitTestFailure,
    submitTestRequestSpinner,
    getRegistrationRoles,
    candidateJourneyStatus,
    programmingTestStart,
    updateProgrammingTestRemainingSeconds,
    programmingTestSubmit,
    programmingTestEvaluate,
    qaTestStart,
    updateQaTestRemainingSeconds,
    qaTestSubmit,
    qaTestEvaluate

} = actions;

export default reducer
