import { createSlice } from "@reduxjs/toolkit";

const campaignSlice = createSlice({
    name: "campaign slice",
    initialState: {
        //campaign job creating view



        //campaign detail view
        campaign_data: [],
        create_candidate: {} //candidate details like [fullname,mail id,mobile number,education,location,current role],
    },
    reducers: {
        //campaign job creating view


        updateData(state,actions){
            return{
                ...state
            }
        }
        //campaign detail view
    }
})

const { actions, reducer } = campaignSlice;

export const {
    updateData
} = actions;

export default reducer;