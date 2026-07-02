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
        programming_test: {
            start_spinner: false,
            submit_spinner: false,
            evaluate_spinner: false,
            test_started_on: null,
            duration: 300,
            remaining_seconds: null,
            status: null,
            submit_status: null,
            evaluation_status: null,
            evaluation: null,
            evaluation_error_message: '',
            submissions: [],
            questions: []
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
        programmingTestStart(state, action) {
            const { type, data, message } = action.payload;

            switch (type) {
                case "request":
                    state.programming_test.start_spinner = true;
                    state.programming_test.evaluation_error_message = '';
                    break;

                case "response":
                    state.programming_test.start_spinner = false;
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
                    state.programming_test.evaluation_status = data?.ai_evaluation?.status || "Completed";
                    state.programming_test.evaluation = data?.ai_evaluation || null;
                    break;

                case "failure":
                    state.programming_test.evaluate_spinner = false;
                    state.programming_test.evaluation_status = "Failed";
                    state.programming_test.evaluation = data?.ai_evaluation || null;
                    state.programming_test.evaluation_error_message = message || "Evaluation unavailable";
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
    programmingTestStart,
    updateProgrammingTestRemainingSeconds,
    programmingTestSubmit,
    programmingTestEvaluate

} = actions;

export default reducer
