import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks';
import { updateToast } from 'Views/Common/Slice/Common_slice';

const AdminAuth = () => {
    const { commonState } = useCommonState();
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();

    useEffect(() => {
        const isManualLogout = window.sessionStorage.getItem("manualLogout") === "true";

        if ((commonState?.user_role !== "admin" || !commonState?.token) && !isManualLogout) {
            dispatch(updateToast({ message: "Access Denied", type: "error" }))
        }

        if (isManualLogout) window.sessionStorage.removeItem("manualLogout");

        if (["dashboard"]?.includes(commonState?.currentMenuName)) {
            navigate("/dashboard/interview")
        }
    }, [commonState?.currentMenuName, commonState?.user_role, commonState?.token, navigate])

    return commonState?.user_role === "admin" && commonState?.token ? <Outlet /> : <Navigate to="/" />
}

export default AdminAuth
