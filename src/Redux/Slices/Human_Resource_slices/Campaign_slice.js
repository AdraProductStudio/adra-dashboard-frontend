import { createSlice } from "@reduxjs/toolkit";

const campaignSlice = createSlice({
    name: "campaign slice",
    initialState: {
        apiErr: null,
        loading: false,
        createCampaignBtn: false,

        //campaign job creating view
        cardEditAndDeletePopup: false,
        cardEditAndDeletePopUpId: null,
        createJobInput: '',
        campaign_cards_data: [],

        //campaign detail view
        campaign_data: [],
        create_candidate: {} //candidate details like [fullname,mail id,mobile number,education,location,current role],
    },
    reducers: {
        //campaign job creating view page
        updateEditAndDeletePopupId(state, action) {
            console.log(action.payload)
            return {
                ...state,
                cardEditAndDeletePopUpId: action.payload
            }
        },
        clearEditAndDeletePopupId(state, action) {
            console.log(action.payload)
            return {
                ...state,
                cardEditAndDeletePopUpId: null
            }
        },
        updateCreateJobInput(state, action) {
            return {
                ...state,
                createJobInput: action.payload
            }
        },

        //get campaign api
        campaignApiRequest(state, action) {
            return {
                ...state,
                createCampaignBtn: true
            }
        },
        campaignApiResponse(state, action) {
            return {
                ...state,
                createCampaignBtn: false,
                campaign_cards_data: action.payload?.campaign
            }
        },
        campaignApiFailure(state, action) {
            return {
                ...state,
                createCampaignBtn: false,
                apiErr: action.payload?.data?.message
            }
        },

        //create campaign api
        createCampignApiRequest(state, action) {
            return {
                ...state,
                createCampaignBtn: true
            }
        },
        createCampignApiResponse(state, action) {
            let originalArray = [...state.campaign_cards_data]
            originalArray[originalArray.length] = action.payload?.campaign;
            return {
                ...state,
                createCampaignBtn: false,
                createJobInput:'',
                campaign_cards_data: originalArray
            }
        },
        createCampignApiFailure(state, action) {
            return {
                ...state,
                createCampaignBtn: false,
                apiErr: action.payload?.data?.message
            }
        },


        //Clear apiErrors 
        clearApiErrors(state, action) {
            console.log(action)
            return {
                ...state,
                loading: false,
                apiErr: null
            }
        }



        //campaign detail view page
    }
})

const { actions, reducer } = campaignSlice;

export const {
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
} = actions;

export default reducer;