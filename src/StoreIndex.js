import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import campaignReducer from 'Redux/Slices/Human_Resource_slices/Campaign_slice';
import commonReducer from 'Redux/Slices/Common_Slice/Common_slice';

const reducers = combineReducers({
    commonState: commonReducer,
    campaignStates: campaignReducer
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(thunk)
})

export default store;