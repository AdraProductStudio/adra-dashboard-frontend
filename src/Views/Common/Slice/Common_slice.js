import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { decryptData, encryptData } from "Security/Crypto/Crypto";
import { getCampaignAssignedQuestions, postOrEditCampign, create_individual_campaign_ques_pattern, getCampaign, delete_individual_campaign_ques_pattern, getCampaignCandidateDetails, getFellowshipCandidates, getSampleTest, delete_campaign_endpoint, delete_candidate_endpoint } from "Views/Admin/Slice/AdminSlice";
import {
    getQuestionsFailure,
    getQuestionsResponse,
    getRegistrationRoles,
    registerCandidateFailure,
    registerCandidateResponse,
    submitTestByManual,
    submitTestFailure,
    submitTestResponse,
    updateCandidateData,
    updateTimeOverCloseTest
} from "Views/InterviewCandidates/Slice/interviewSlice";

const initialState = {
    modalShow: false,
    modalSize: "md",
    modalData: {},
    modal_from: null,
    modal_type: null,
    modal_close_btn: true,
    enable_lg_autoScroll: false,

    canvasShow: false,
    isOnline: true,
    currentNavMenuIndex: 0,
    currentMenuName: '',
    innerWidth: 0,
    innerHeight: 0,
    buttonSpinner: false,

    usernamee: '',
    passwordd: '',
    eyeOpen: false,
    validated: false,

    token: Cookies.get('log') ? decryptData(Cookies.get('log'))?.token : '',
    user_id: Cookies.get('log') ? decryptData(Cookies.get('log'))?.user_id : '',
    user_role: Cookies.get('log') ? decryptData(Cookies.get('log'))?.user_role : '',
    involved_in_tab_switching: Cookies.get('log') ? decryptData(Cookies.get('log'))?.involved_in_tab_switching : false,
    test_over_logout: Cookies.get('log') ? decryptData(Cookies.get('log'))?.test_over_logout : false,

    showing_entries: [10, 20, 50],
    pageSize: 10,
    entries_selected: false,

    currentPage: 1,
    totalCount: 0,
    siblingCount: 1,

    search_value: '',
    search_clicked: false,

    apply_filter_clicked: false,
    apply_filter: false,
    fellowship_candidate_register: {}
};

const commonSlice = createSlice({
    name: 'commonSlice',
    initialState,
    reducers: {
        updateModalShow(state) {
            state.modalShow = !state.modalShow;
        },
        updateCanvasShow(state) {
            state.canvasShow = !state.canvasShow;
        },
        updateIsonline(state, action) {
            state.isOnline = action.payload;
        },
        updateCurrentNavMenuIndex(state, action) {
            state.currentMenuName = action.payload;
        },
        updateScreenCurrentDimension(state, action) {
            state.innerWidth = action.payload?.innerWidth;
            state.innerHeight = action.payload?.innerHeight;
        },
        resetModalBox(state) {
            Object.assign(state, {
                modalShow: false,
                modalSize: "md",
                modal_from: null,
                modal_type: null,
                modal_close_btn: true,
                enable_lg_autoScroll: false,
                modalData: {}
            });
        },
        updateToast(state, action) {
            state.Err = action.payload.message;
            state.Toast_Type = action.payload.type;
            state.buttonSpinner = false;
        },
        clearError(state) {
            state.Err = null;
            state.Toast_Type = null;
        },
        updateValidation(state) {
            state.validated = true;
        },
        resetValidation(state) {
            state.validated = false;
        },
        updateLoginCredentials(state, action) {
            const { username, password } = action.payload;
            if (username !== undefined) state.usernamee = username;
            if (password !== undefined) state.passwordd = password;
        },
        updateEyeFunction(state) {
            state.eyeOpen = !state.eyeOpen;
        },
        loginRequest(state) {
            state.buttonSpinner = true;
            state.token = null;
        },
        loginResponse(state, action) {
            const { token, user_role, involved_in_tab_switching } = action.payload;
            let log = { token: token || '', user_role: user_role || '' }
            if (user_role === "interview_candidate") {
                log.involved_in_tab_switching = involved_in_tab_switching
            }

            Cookies.set('log', encryptData(log));
            state.token = token || '';
            state.user_role = user_role || '';
            state.buttonSpinner = false;
            state.involved_in_tab_switching = involved_in_tab_switching || 0
            state.eyeOpen = !state.eyeOpen;
        },
        updateToken(state, action) {
            const token = action.payload;

            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            decrypt_cookie.token = token || '';
            Cookies.set('log', encryptData(decrypt_cookie));
            state.token = token || '';
        },
        updateRemoveToken(state) {
            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            delete decrypt_cookie.token;
            Cookies.set('log', encryptData(decrypt_cookie));

            state.token = '';
        },
        logout(state) {
            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            delete decrypt_cookie.token;
            delete decrypt_cookie.user_id;
            Cookies.set('log', encryptData(decrypt_cookie));

            Object.assign(state, {
                token: '',
                usernamee: '',
                passwordd: '',
            });
        },
        updateResetAllMenus(state) {
            Object.assign(state, {
                edited: false,
                validated: false,
                modalShow: false,
                pageSize: 10,
                currentPage: 1,
                entries_selected: false,
                search_value: '',
                search_clicked: false,
                apply_filter: false,
                apply_filter_clicked: false
            });
        },
        updatePaginationSize(state, action) {
            state.pageSize = action.payload;
        },
        updateCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        updateSearchValue(state, action) {
            state.search_value = action.payload;
            state.search_clicked = false;
        },
        clearSearch(state) {
            state.search_value = '';
            state.search_clicked = false;
        },
        updateSearchClickedTrue(state) {
            Object.assign(state, {
                search_clicked: true,
                apply_filter: false,
                apply_filter_clicked: false,
                totalCount: 0,
                pageSize: 10,
                currentPage: 1
            });
        },
        updateSearchClickedFalse(state) {
            state.search_clicked = true;
        },
        updateEntriesCount(state, action) {
            state.pageSize = action.payload;
            state.entries_selected = true;
            state.currentPage = 1;
        },
        updateApplyFilterClickedTrue(state) {
            Object.assign(state, {
                apply_filter_clicked: true,
                apply_filter: true,
                search_clicked: false,
                totalCount: 0,
                pageSize: 10,
                currentPage: 1
            });
        },
        updateApplyFilterClickedFalse(state) {
            state.apply_filter_clicked = false;
            state.apply_filter = false;
        },
        closeTestMode(state) {
            Cookies.remove('log');
            Object.assign(state, {
                modalShow: false,
                modalSize: "md",
                modal_from: null,
                modal_type: null,
                modal_close_btn: true,
                token: null,
                user_role: null,
                user_id: null,
                involved_in_tab_switching: 0,
                enable_lg_autoScroll: false,
                test_over_logout: false
            });
        },
        updateOverallModalData(state, action) {
            const { size, from, type, enable_lg_autoScroll, data } = action.payload;
            Object.assign(state, {
                modalShow: true,
                modalSize: size,
                modal_from: from,
                modal_type: type,
                enable_lg_autoScroll: enable_lg_autoScroll || false,
                modalData: data || {}
            });
        },
        updateFellowshipCandidatesData(state, action) {
            Object.entries(action.payload)?.map(([keys, value]) => (
                state.fellowship_candidate_register = {
                    ...state.fellowship_candidate_register,
                    [keys]: value
                }
            ))
            state.validated = false;
        },
        fellowship_candidate_register_endpoint(state, action) {
            const { type, message } = action.payload;

            switch (type) {
                case "request":
                    state.buttonSpinner = true;
                    break;
                case "response":
                    state.buttonSpinner = false;
                    state.fellowship_candidate_register = {};
                    state.Err = message || "Candidate Registration successful";
                    state.Toast_Type = "success";
                    break;
                case "failure":
                    state.buttonSpinner = false;
                    state.Err = message || "Something went wrong";
                    state.Toast_Type = "error";
                    break;
                default:
                    break;
            }
        },
        updateMalpracticeData(state, action) {
            const { remaining_switching_count } = action.payload;

            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            decrypt_cookie.involved_in_tab_switching = remaining_switching_count;
            Cookies.set('log', encryptData(decrypt_cookie));
            state.involved_in_tab_switching = remaining_switching_count;

            Object.assign(state, {
                modalShow: true,
                modalSize: 'md',
                modal_from: "interview_candidate",
                modal_type: 'malpractice_detected',
            });
        },
        malpracticeTestClose(state) {
            let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
            decrypt_cookie.test_over_logout = 'malpracticed_again';
            Cookies.set('log', encryptData(decrypt_cookie));

            Object.assign(state, {
                modalShow: true,
                modalSize: 'md',
                modal_from: "interview_candidate",
                modal_type: 'malpracticed_again',
                test_over_logout: 'malpracticed_again'
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerCandidateResponse, (state, action) => {
                state.usernamee = action.payload?.username;
                state.passwordd = action.payload?.password;
            })
            .addCase(submitTestByManual, (state) => {
                Object.assign(state, {
                    modalSize: "md",
                    modal_from: "interview_candidate",
                    modal_type: "submit_confirmation",
                    modalShow: true,
                    modal_close_btn: false,
                    enable_lg_autoScroll: false
                });
            })
            .addCase(submitTestResponse, (state) => {
                let decrypt_cookie = Cookies.get('log') ? decryptData(Cookies.get('log')) : {};
                decrypt_cookie.test_over_logout = 'test_completed';
                Cookies.set('log', encryptData(decrypt_cookie));

                Object.assign(state, {
                    modalSize: "xl",
                    modal_from: "interview_candidate",
                    modal_type: "test_completed",
                    modalShow: true,
                    modal_close_btn: false,
                    enable_lg_autoScroll: false,
                    test_over_logout: 'test_completed'
                });
            })

            .addCase(getQuestionsResponse, (state) => {
                Object.assign(state, {
                    modalSize: "",
                    modal_from: "",
                    modal_type: "",
                    modalShow: false,
                    modal_close_btn: false,
                    enable_lg_autoScroll: false
                })
            })

            .addCase(updateTimeOverCloseTest, (state, action) => {
                state.usernamee = action.payload?.username;
                state.passwordd = action.payload?.password;
                Object.assign(state, {
                    modalSize: "xl",
                    modal_from: "interview_candidate",
                    modal_type: "time_finished",
                    modalShow: true,
                    modal_close_btn: false,
                    enable_lg_autoScroll: true
                });
            })


            // matcher
            .addMatcher(
                function (action) {
                    return [
                        updateCandidateData.toString(),
                        create_individual_campaign_ques_pattern.toString(),
                    ].includes(action.type)
                },
                (state, action) => {
                    state.validated = false;
                }
            )

            .addMatcher(
                function (action) {
                    return [
                        registerCandidateFailure.toString(),
                        submitTestFailure.toString(),
                        getCampaign.toString(),
                        postOrEditCampign.toString(),
                        getCampaignAssignedQuestions.toString(),
                        create_individual_campaign_ques_pattern.toString(),
                        delete_individual_campaign_ques_pattern.toString(),
                        getCampaignCandidateDetails.toString(),
                        getRegistrationRoles.toString(),
                        getQuestionsFailure.toString(),
                        getSampleTest.toString(),
                        delete_campaign_endpoint.toString(),
                        delete_candidate_endpoint.toString(),
                    ].includes(action.type)
                },
                setErrorState
            )

            .addMatcher(
                function (action) {
                    return [
                        getFellowshipCandidates.toString(),
                    ].includes(action.type)
                },
                (state, action) => {
                    if (action?.payload?.type === "failure") setErrorState(state, action);
                }
            )


            .addMatcher(
                function (action) {
                    return [
                        postOrEditCampign.toString(),
                        submitTestFailure.toString(),
                        delete_campaign_endpoint.toString(),
                        delete_candidate_endpoint.toString()
                    ].includes(action.type)
                },
                (state, action) => {
                    if (action?.payload?.type === "response") {
                        resetModal(state)
                    }
                }
            )

            .addMatcher(
                function (action) {
                    return [
                        getCampaignAssignedQuestions.toString(),
                    ].includes(action.type)
                },
                (state, action) => {
                    if (action?.payload?.type === "request") {
                        Object.assign(state, {
                            modalShow: true,
                            modalSize: "xl",
                            modal_from: "admin",
                            modal_type: "assign_question",
                            modal_close_btn: true,
                            validated: false,
                        })
                    }
                }
            )
    }
});

function setErrorState(state, action) {
    let error_message = typeof action.payload === 'object' ? action.payload?.message : action.payload;
    state.Err = error_message;
    state.Toast_Type = "error";
}

function resetModal(state, action) {
    state.modalShow = false
    state.modalSize = "md"
    state.modal_from = null
    state.modal_type = null
    state.modal_close_btn = false
    state.enable_lg_autoScroll = false
    state.modalData = {}
}

export const {
    updateModalShow, updateCanvasShow, updateIsonline, updateCurrentNavMenuIndex,
    updateScreenCurrentDimension, resetModalBox, updateToast, clearError,
    updateValidation, resetValidation, updateLoginCredentials, updateEyeFunction,
    loginRequest, loginResponse, updateToken, updateRemoveToken, logout,
    updateResetAllMenus, updatePaginationSize, updateCurrentPage,
    updateSearchValue, clearSearch, updateSearchClickedTrue,
    updateSearchClickedFalse, updateEntriesCount, updateApplyFilterClickedTrue,
    updateApplyFilterClickedFalse, closeTestMode, updateOverallModalData,
    updateFellowshipCandidatesData, fellowship_candidate_register_endpoint,
    updateMalpracticeData, malpracticeTestClose

} = commonSlice.actions;

export default commonSlice.reducer;
