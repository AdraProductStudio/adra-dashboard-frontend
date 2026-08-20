import axiosInstance from 'Services/axiosInstance';
import {
    update_create_campaign_data, getCampaign, postOrEditCampign, getCampaignAssignedQuestions,
    create_individual_campaign_ques_pattern, edit_individual_campaign_ques_pattern,
    delete_individual_campaign_ques_pattern, getCampaignCandidateDetails,
    getFellowshipCandidates,
    getSampleTest,
    delete_campaign_endpoint,
    delete_candidate_endpoint


} from 'Views/Admin/Slice/AdminSlice';
import { handleValidation } from 'Views/Common/Action/Common_action';
import { updateToast } from 'Views/Common/Slice/Common_slice';

export const handleCreateCampaignOnChnage = (ipData) => dispatch => {
    dispatch(update_create_campaign_data(ipData))
}

// Get Campaign
export const handleGetCampaign = () => async (dispatch) => {
    try {
        dispatch(getCampaign({ type: "request" }))
        const { data } = await axiosInstance.get("/campaign")

        if (data?.error_code === 0) dispatch(getCampaign({ type: "response", data: data?.data }))
        else dispatch(getCampaign({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(getCampaign({ type: "failure", message: Err?.message }))
    }
}


// Create Campaign
export const handleCreateCampaign = (params) => async (dispatch) => {
    try {
        dispatch(postOrEditCampign({ type: "request" }))
        const { data } = await axiosInstance.post("/campaign", params)

        if (data?.error_code === 0) dispatch(postOrEditCampign({ type: "response", data: { ...data?.data, type: "create" } }))
        else dispatch(postOrEditCampign({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(postOrEditCampign({ type: "failure", message: Err?.message }))
    }
}

// Edit Campaign
export const handleEditCampaign = (params) => async (dispatch) => {
    try {
        dispatch(postOrEditCampign({ type: "request" }))
        const { data } = await axiosInstance.put("/campaign", params)

        if (data?.error_code === 0) dispatch(postOrEditCampign({ type: "response", data: { ...data?.data, type: "edit" } }))
        else dispatch(postOrEditCampign({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(postOrEditCampign({ type: "failure", message: Err?.message }))
    }
}

// Delete campaign
export const handleDeleteCampaign = (params) => async (dispatch) => {
    try {
        dispatch(delete_campaign_endpoint({ type: "request" }))
        const { data } = await axiosInstance.delete(`/delete_campaign/${params?._id}`)

        if (data?.error_code === 0) dispatch(delete_campaign_endpoint({ type: "response", data: { _id: params?._id } }))
        else dispatch(delete_campaign_endpoint({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(delete_campaign_endpoint({ type: "failure", message: Err?.message }))
    }
}

// Get individual Campaign
export const handleGetIndividualCampaign = (params) => async (dispatch) => {
    try {
        dispatch(getCampaign({ type: "request" }))
        const { data } = await axiosInstance.get(`/campaign/${params?.campaign_id}`)

        if (data?.error_code === 0) dispatch(getCampaign({ type: "response", data: data?.data }))
        else dispatch(getCampaign({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(getCampaign({ type: "failure", message: Err?.message }))
    }
}


// Get sample test
export const handleGetSampleTest = (params) => async (dispatch) => {
    try {
        dispatch(getSampleTest({ type: "request" }))
        const { data } = await axiosInstance.get(`/campaign/${params?.campaign_id}/generate_sample_test`)

        if (data?.error_code === 0) dispatch(getSampleTest({ type: "response", data: data?.data }))
        else dispatch(getSampleTest({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(getSampleTest({ type: "failure", message: Err?.message }))
    }
}

// Get question types
export const handleGetQuestionTypes = () => async (dispatch) => {
    try {
        dispatch(getCampaignAssignedQuestions({ type: "request" }))

        const { data } = await axiosInstance.get('/get_question_types')
        if (data?.error_code === 0) dispatch(getCampaignAssignedQuestions({ type: "response", data: data?.data }))
        else dispatch(getCampaignAssignedQuestions({ type: "failure", message: data?.message }))
    }
    catch (Err) {
        dispatch(getCampaignAssignedQuestions({ type: "failure", message: Err?.message }))
    }
}

// Upload MCQ questions from a CSV file
export const handleUploadMcqQuestions = (file) => async (dispatch) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const { data } = await axiosInstance.post('/upload_csv_questions', formData);

        if (data?.error_code === 0) {
            dispatch(updateToast({
                message: data?.message || 'MCQ questions uploaded successfully',
                type: 'success'
            }));
            return true;
        }

        dispatch(updateToast({
            message: data?.message || 'Unable to upload MCQ questions',
            type: 'error'
        }));
        return false;
    } catch (err) {
        dispatch(updateToast({
            message: err?.message || 'Unable to upload MCQ questions',
            type: 'error'
        }));
        return false;
    }
}

export const handleAddOrUpdateQuestionPattern = (params) => async (dispatch) => {
    if (!params?.difficulty_level || !params?.question_type || !params?.questions_count) return dispatch(handleValidation)

    try {
        dispatch(create_individual_campaign_ques_pattern({ type: "request" }))

        const { data } = await axiosInstance.post('/campaign_question_pattern', params)
        if (data?.error_code === 0) dispatch(create_individual_campaign_ques_pattern({ type: "response", data: data?.data?.question_pattern }))
        else dispatch(create_individual_campaign_ques_pattern({ type: "failure", message: data?.message }))
    }
    catch (Err) {
        dispatch(create_individual_campaign_ques_pattern({ type: "failure", message: Err?.message }))
    }
}

export const handleEditQuestionPattern = (params) => async (dispatch) => {
    if (!params?.difficulty_level || !params?.question_type || !params?.questions_count) return dispatch(handleValidation)
    params.question_id = params?._id
    delete params?._id

    try {
        dispatch(edit_individual_campaign_ques_pattern({ type: "request" }))

        const { data } = await axiosInstance.put('/campaign_question_pattern', params)
        if (data?.error_code === 0) dispatch(edit_individual_campaign_ques_pattern({ type: "response", data: data?.data?.question_pattern }))
        else dispatch(edit_individual_campaign_ques_pattern({ type: "failure", message: data?.message }))
    }
    catch (Err) {
        dispatch(edit_individual_campaign_ques_pattern({ type: "failure", message: Err?.message }))
    }
}

export const handleDeleteQuestionPattern = (params) => async (dispatch) => {
    if (!params?.question_id || !params?.campaign_id) return

    try {
        dispatch(delete_individual_campaign_ques_pattern({ type: "request" }))

        const { data } = await axiosInstance.delete(`/campaign_question_pattern?question_id=${params?.question_id}&campaign_id=${params?.campaign_id}`)
        if (data?.error_code === 0) dispatch(delete_individual_campaign_ques_pattern({ type: "response", data: data?.data?.question_pattern }))
        else dispatch(delete_individual_campaign_ques_pattern({ type: "failure", message: data?.message }))
    }
    catch (Err) {
        dispatch(delete_individual_campaign_ques_pattern({ type: "failure", message: Err?.message }))
    }
}

export const handleGetIndividualCampaignCandidate = (params) => async (dispatch) => {
    try {
        dispatch(getCampaignCandidateDetails({ type: "request" }))
        const { data } = await axiosInstance.get(`/display_campaign_candidate_details/${params?.candidate_id}`)

        if (data?.error_code === 0) dispatch(getCampaignCandidateDetails({ type: "response", data: data?.data }))
        else dispatch(getCampaignCandidateDetails({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(getCampaignCandidateDetails({ type: "failure", message: Err?.message }))
    }
}

export const handleGetFellowshipCandidates = (params) => async (dispatch) => {
    try {
        dispatch(getFellowshipCandidates({ type: "request", page_number: params?.page }))
        const { data } = await axiosInstance.get(`/fellowship_candidates?page_number=${params?.page}&limit=${params?.limit}`)

        if (data?.error_code === 0) dispatch(getFellowshipCandidates({ type: "response", data: data?.data }))
        else dispatch(getFellowshipCandidates({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(getFellowshipCandidates({ type: "failure", message: Err?.message }))
    }

}

export const handleGetFellowshipCandidatesDetails = (params) => async (dispatch) => {
    if (!params?.candidate_id) return dispatch(getFellowshipCandidates({ type: "failure", message: 'Candidate ID required' }))

    try {
        dispatch(getFellowshipCandidates({ type: "request", page_number: params?.page }))
        const { data } = await axiosInstance.get(`/fellowship_candidates/${params?.candidate_id}`)

        if (data?.error_code === 0) dispatch(getFellowshipCandidates({ type: "response", data: data?.data }))
        else dispatch(getFellowshipCandidates({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(getFellowshipCandidates({ type: "failure", message: Err?.message }))
    }
}

// Delete candidate
export const handleDeleteCandidate = (params) => async (dispatch) => {
    try {
        dispatch(delete_candidate_endpoint({ type: "request" }))
        const { data } = await axiosInstance.delete(`/delete_candidate/${params?._id}`)

        if (data?.error_code === 0) dispatch(delete_candidate_endpoint({ type: "response", data: { _id: params?._id } }))
        else dispatch(delete_candidate_endpoint({ type: "failure", message: data?.message }))
    } catch (Err) {
        dispatch(delete_candidate_endpoint({ type: "failure", message: Err?.message }))
    }
}
