import axiosInstance from 'services/axiosInstance'
import {
    updateEditAndDeletePopupId,
    clearEditAndDeletePopupId,
    updateCreateJobInput,
    clearApiErrors,

    campaignApiRequest,
    campaignApiResponse,
    campaignApiFailure,

    createCampignApiRequest,
    createCampignApiResponse,
    createCampignApiFailure,
} from 'Redux/Slices/Human_Resource_slices/Campaign_slice'
import { updateModalShow } from 'Redux/Slices/Common_Slice/Common_slice'

//create job input function
export const handleCreateJobInput = (ipData) => dispatch => {
    dispatch(updateCreateJobInput(ipData))
}

//clear api errors
export const handleClearApiErrors = dispatch => {
    dispatch(clearApiErrors())
}

export const handlePopUpId = (id) => (dispatch) => {
    dispatch(updateEditAndDeletePopupId(id))
}

export const handleClearPopUpId = dispatch => {
    dispatch(clearEditAndDeletePopupId())
}

export const handleGetCampaign = () => async (dispatch) => {
    try {
        dispatch(campaignApiRequest())
        const { data } = await axiosInstance.get("display_campaign")
        dispatch(campaignApiResponse(data))
    } catch (Err) {
        dispatch(campaignApiFailure(Err.response))
    }
}

//create campaign
export const handleCreateCampaign = (job_title) => async (dispatch) => {
    const params = {job_title:job_title}
    try {
        dispatch(createCampignApiRequest())
        const {data} = await axiosInstance.post("/create_campaign",params)
        dispatch(createCampignApiResponse(data))
        dispatch(updateModalShow())
    } catch (Err) {
        dispatch(createCampignApiFailure(Err.response))
    }
}
