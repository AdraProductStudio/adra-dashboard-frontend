import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    placeholderGlow: false,
    spinnerGlow: false,
    create_campaign: {},
    campaigns_data: {},
    create_assigning_questions: {},
    campaign_placeholder: false,
    create_update_campaign_spinner: false,
    fellowship_candidates: [],
    sample_test: {},
    sample_test_glow: false,
    delete_campaign_spinner: false
};

const AdminSlice = createSlice({
    name: "Admin_slice",
    initialState,
    reducers: {
        // Update create campaign data (onChange)
        update_create_campaign_data(state, action) {
            Object.assign(state.create_campaign, action.payload);
        },

        // Get all campaign data
        getCampaign(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.campaigns_data = {};
                    state.campaign_placeholder = true;
                    break;

                case "response":
                    state.campaigns_data = data || {};
                    state.campaign_placeholder = false;
                    break;

                case "failure":
                    state.campaigns_data = {};
                    state.campaign_placeholder = false;
                    break;

                default:
                    break;
            }
        },

        create_individual_campaign_ques_pattern(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.add_pattern_spinner = true;
                    break;

                case "response":
                    state.campaigns_data.question_pattern = data || state.campaigns_data.question_pattern;
                    state.create_assigning_questions = {};
                    state.add_pattern_spinner = false;
                    state.available_questions_data.total_count = null
                    state.available_questions_data.difficulty_level = null
                    break;

                case "failure":
                    state.add_pattern_spinner = false;
                    break;

                default:
                    break;
            }
        },
        edit_individual_campaign_ques_pattern(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.add_pattern_spinner = true;
                    break;

                case "response":
                    state.campaigns_data.question_pattern = data || state.campaigns_data.question_pattern;
                    state.create_assigning_questions = {};
                    state.add_pattern_spinner = false;
                    state.available_questions_data.total_count = null
                    state.available_questions_data.difficulty_level = null
                    break;

                case "failure":
                    state.add_pattern_spinner = false;
                    break;

                default:
                    break;
            }
        },

        // Create or update campaign
        postOrEditCampign(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.create_update_campaign_spinner = true;
                    break;

                case "response":
                    const { type } = data;
                    if (type === "edit") {
                        state.campaigns_data.campaign = state.campaigns_data.campaign.map(item =>
                            item._id === data._id ? data : item
                        );
                    } else {
                        state.campaigns_data.campaignCount = state.campaigns_data.campaignCount || 0 + 1;
                        state.campaigns_data.campaign.unshift(data);
                    }

                    state.create_update_campaign_spinner = false;
                    state.create_campaign = {}
                    break;

                case "failure":
                    state.create_update_campaign_spinner = false;
                    break;

                default:
                    break;
            }
        },

        delete_campaign_endpoint(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.delete_campaign_spinner = true;
                    break;

                case "response":
                    state.campaigns_data.campaign = state.campaigns_data.campaign.filter(item => item._id !== data._id)
                    state.delete_campaign_spinner = false;
                    state.create_campaign = {}
                    break;

                case "failure":
                    state.delete_campaign_spinner = false;
                    break;

                default:
                    break;
            }
        },

        edit_campaign_data(state, action) {
            let get_levels = state?.available_questions_data?.data
                ?.filter(item => item.question_types === action.payload?.question_type) // filter by question_types
                ?.map(item => item.difficulty_levels) // extract the difficulty_levels
                .flat()

            let get_count = get_levels
                ?.find(item => item.level === action.payload?.difficulty_level)

            state.create_assigning_questions = action.payload;
            state.available_questions_data.difficulty_level = get_levels || [];
            state.available_questions_data.total_count = get_count?.total_questions || 0;
        },

        delete_individual_campaign_ques_pattern(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "response":
                    state.campaigns_data.question_pattern = data;
                    break;
                default:
                    break;
            }

        },
        // Get individual campaign assigned questions
        getCampaignAssignedQuestions(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.available_questions_data = {};
                    state.create_assigning_questions = {};
                    state.get_question_types_placeholder = true;
                    break;

                case "response":
                    state.available_questions_data = data || {};
                    state.get_question_types_placeholder = false;
                    break;

                case "failure":
                    state.available_questions_data = {};
                    state.get_question_types_placeholder = false;
                    break;

                default:
                    break;
            }
        },

        //Assign or update question types and levels for campaign test
        assignQuestionTypes(state, action) {
            const [key, value] = Object.entries(action.payload)[0];
            state.create_assigning_questions[key] = value;

            if (key === "question_type") {
                let get_levels = state?.available_questions_data?.data
                    ?.filter(item => item.question_types === value) // filter by question_types
                    ?.map(item => item.difficulty_levels) // extract the difficulty_levels
                    .flat()

                state.available_questions_data.difficulty_level = get_levels || [];
                state.available_questions_data.total_count = 0;

                state.create_assigning_questions['difficulty_level'] = '';
                state.create_assigning_questions['questions_count'] = '';
            }


            if (key === "difficulty_level") {
                let get_count = state?.available_questions_data?.difficulty_level
                    ?.find(item => item.level === value)

                state.available_questions_data.total_count = get_count?.total_questions || 0;
                state.create_assigning_questions['questions_count'] = '';
            }
        },

        // Get individual campaign assigned questions
        getCampaignCandidateDetails(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.campaign_candidate_details = {};
                    state.campaign_candidate_glow = true;
                    break;

                case "response":
                    state.campaign_candidate_details = data || {};
                    state.campaign_candidate_glow = false;
                    break;

                case "failure":
                    state.campaign_candidate_details = null;
                    state.campaign_candidate_glow = false;
                    break;

                default:
                    break;
            }
        },

        // Get Fellowship candidate details
        getFellowshipCandidates(state, action) {
            const { type, data, page_number } = action.payload;

            switch (type) {
                case "request":
                    state.placeholderGlow = true;
                    state.page_number = page_number || 1;
                    state.fellowship_candidates = {};
                    break;

                case "response":
                    state.placeholderGlow = false;
                    state.fellowship_candidates = data || {};
                    break;

                case "failure":
                    state.placeholderGlow = false;
                    state.fellowship_candidates = null;
                    break;

                default:
                    break;
            }
        },
        getSampleTest(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.sample_test = {};
                    state.sample_test_glow = true;
                    break;

                case "response":
                    state.sample_test = data || {};
                    state.sample_test_glow = false;
                    break;

                case "failure":
                    state.sample_test = null;
                    state.sample_test_glow = false;
                    break;

                default:
                    break;
            }
        },

        delete_candidate_endpoint(state, action) {
            const { type, data } = action.payload;

            switch (type) {
                case "request":
                    state.delete_candidate_spinner = true;
                    break;

                case "response":
                    state.campaigns_data.candidates = state.campaigns_data.candidates.filter(item => item._id !== data._id)
                    state.delete_candidate_spinner = false;
                    break;

                case "failure":
                    state.delete_candidate_spinner = false;
                    break;

                default:
                    break;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase("commonSlice/updateOverallModalData", (state, action) => {
                const { type, data } = action.payload;

                if (type === 'create_campaign' && data) {
                    const formattedData = { ...data };

                    if (data?.interview_date) {
                        const date = new Date(data?.interview_date);
                        formattedData.interview_date = date.toISOString().split("T")[0];
                    }

                    state.create_campaign = formattedData || {};
                }
            })

            .addCase("commonSlice/resetModalBox", (state) => {
                state.create_campaign = {}
            })
    }
});

export const {
    update_create_campaign_data, getCampaign, postOrEditCampign,
    getCampaignAssignedQuestions, assignQuestionTypes, create_individual_campaign_ques_pattern,
    edit_campaign_data, edit_individual_campaign_ques_pattern, delete_individual_campaign_ques_pattern,
    getCampaignCandidateDetails, getFellowshipCandidates, getSampleTest,
    delete_campaign_endpoint, delete_candidate_endpoint


} = AdminSlice.actions;

export default AdminSlice.reducer;
