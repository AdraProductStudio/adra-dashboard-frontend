import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import InterviewComp from "views/Human_Resource/Pages/InterviewComp";
import Layout from "views/Human_Resource/Main_layout/Layout";
import CampaignDetails from "views/Human_Resource/Pages/campaignDetails";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { handleOnlineOffilne } from "Redux/Actions/Common_actions/Common_action";

const App = () => {
  const { isOnline } = useSelector((state) => state.commonState);
  const dispatch = useDispatch();
  // On initization set the isOnline state.
  useEffect(() => {
    dispatch(handleOnlineOffilne(navigator.onLine))
  }, [])

  // event listeners to update the state 
  window.addEventListener('online', () => {
    dispatch(handleOnlineOffilne(true))

  });

  window.addEventListener('offline', () => {
    dispatch(handleOnlineOffilne(false))

  });

  return isOnline ?
    <HelmetProvider>
      <ToastContainer theme='light' />
      <Routes>

        <Route element={<Layout />}>
          <Route index element={<h1>Dashboard</h1>} />
          <Route path="employees" element={<h1>Employer</h1>} />
          <Route path="attendance" element={<h1>Attendance</h1>} />
          <Route path="payroll" element={<h1>Payroll</h1>} />
          <Route path="interview">
            <Route index element={<InterviewComp />} />
            <Route path=":id" element={<CampaignDetails />} />
          </Route>
          <Route path="circular" element={<h1>Circular</h1>} />
          <Route path="invoices" element={<h1>Invoices</h1>} />
          <Route path="notes" element={<h1>Notes</h1>} />
          <Route path="documents" element={<h1>Documents</h1>} />
        </Route>

        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </HelmetProvider>
    :
    <p>No internet connection</p>
}
export default App;