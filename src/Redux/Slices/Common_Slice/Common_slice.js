import {createSlice} from "@reduxjs/toolkit";

const commonSlice = createSlice({
    name: 'common slice',
    initialState: {
        modalShow: false,
        isOnline:true
    },
    reducers: {
        updateModalShow(state, actions) {
            return {
                ...state,
                modalShow: !state.modalShow
            }
        },
        updateIsonline(state, actions) {
            return {
                ...state,
                isOnline: actions.payload
            }
        }
    }
})

const { actions, reducer } = commonSlice;

export const {
    updateModalShow,
    updateIsonline
} = actions;

export default reducer