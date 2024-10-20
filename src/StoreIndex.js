import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import campaignReducer from 'Redux/Slices/Human_Resource_slices/Campaign_slice';


const reducers = combineReducers({
    campaignStates: campaignReducer 
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(thunk)
})

export default store;