import { LoginSuccessNavigateTo } from 'ResuableFunctions/LoginSuccessNavigateTo';
import axiosInstance from 'Services/axiosInstance';
import {
    updateModalShow, updateCanvasShow,
    updateLoginCredentials, updateEyeFunction,
    clearError, resetValidation, updateValidation,
    loginRequest, loginResponse, updateToast,
    updateToken, updateRemoveToken, logout,
    updateResetAllMenus, fellowship_candidate_register_endpoint

} from 'Views/Common/Slice/Common_slice';


export const handleUpdateModalShow = (dispatch) => {
    dispatch(updateModalShow())
}

export const handleUpdateCanvasShow = (dispatch) => {
    dispatch(updateCanvasShow())
}

export const handleLoginCredentials = (data) => (dispatch) => {
    dispatch(updateLoginCredentials(data))
}

export const handleEyeFunction = () => dispatch => {
    dispatch(updateEyeFunction())
}

export const handleClearErrors = dispatch => {
    dispatch(clearError())
}

export const handleValidation = dispatch => {
    dispatch(updateValidation())
}

export const handleResetValidation = dispatch => {
    dispatch(resetValidation())
}

// login api 
export const handleLogin = (basicAuth, navigate) => async (dispatch) => {
    try {
        dispatch(loginRequest())
        const { data } = await axiosInstance.post('/login', {},
            {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                }
            }
        );

        if (data.error_code === 0) {
            dispatch(loginResponse(data?.data))
            LoginSuccessNavigateTo(data?.data?.user_role, navigate)
        } else {
            dispatch(updateToast({ message: data?.message, type: "error" }))
        }
    } catch (err) {
        dispatch(updateToast({ message: err?.message, type: "error" }))
    }
}

export const handleBearerToken = (token) => dispatch => {
    dispatch(updateToken(token))
}

export const handleLogout = () => async (dispatch) => {
    try {
        window.sessionStorage.setItem("manualLogout", "true");
        await axiosInstance.post("/logout", {}, { _skipAuthRefresh: true })
    } catch (err) {
        console.error("Logout request failed:", err);
    } finally {
        dispatch(logout())
    }
}

//refresh token
export const handlerefreshToken = () => async (dispatch) => {
    try {
        const { data } = await axiosInstance.post("/refresh_token", {}, { _skipAuthRefresh: true })
        const token = data?.data?.token;

        if (data?.error_code === 0 && token) {
            dispatch(updateToken(token))
            return token;
        } else {
            dispatch(updateRemoveToken())
            throw new Error(data?.message || "Session expired. Please login again.")
        }
    } catch (err) {
        dispatch(updateToast({ message: err?.message, type: "error" }))
        dispatch(updateRemoveToken())
        if (window.location.pathname !== "/") window.location.replace("/");
        throw err;
    }
}

//reset all 
export const handleResetAlMenus = dispatch => {
    dispatch(updateResetAllMenus())
}

export const handleFellowshipRegisterCandidate = ({ fellowshipCandidatesRegistration, input_data }) => async (dispatch) => {
    const fd = new FormData();
    let params = Object.assign({}, input_data);
    if ('image_show_ui' in params) delete params['image_show_ui'];


    const findNullEmptyValues = fellowshipCandidatesRegistration
        .filter((items) => items?.isMandatory)
        .map((items) => items?.value)
        .some((value) => value === "" || (Array.isArray(value) && value.length === 0));

    if (findNullEmptyValues) {
        dispatch(handleValidation)
        return dispatch(updateToast({ message: "Please fill all the fields", type: "error" }));
    }

    Object.keys(params).forEach((key) => {
        if (key === 'image') fd.append(key, params[key][0]);
        else fd.append(key, params[key]);
    })

    try {
        dispatch(fellowship_candidate_register_endpoint({ type: "request" }))
        const { data } = await axiosInstance.post("/fellowship_candidate_form", fd)

        if (data?.error_code === 0) dispatch(fellowship_candidate_register_endpoint({ data: data?.data || {}, type: "response", message: data?.message || '' }))
        else dispatch(fellowship_candidate_register_endpoint({ message: data?.message, type: "failure" }))

    } catch (err) {
        dispatch(fellowship_candidate_register_endpoint({ message: err?.message, type: "failure" }))
    }
}
