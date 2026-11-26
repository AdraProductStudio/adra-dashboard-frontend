import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import commonReducer from 'Views/Common/Slice/Common_slice';
import interviewReducer from "Views/InterviewCandidates/Slice/interviewSlice";
import adminReducer from 'Views/Admin/Slice/AdminSlice';
import employeeReducer from 'Views/Admin/Slice/EmployeeSlice';

const reducers = combineReducers({
    commonState: commonReducer,
    interviewState: interviewReducer,
    adminState: adminReducer,
    employeeState: employeeReducer
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(thunk),
    devTools: /localhost/.test(window.location.hostname)
})

export default store;