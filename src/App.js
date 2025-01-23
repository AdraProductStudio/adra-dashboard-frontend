import React from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { InitializeProjectSetup } from "Views/Common/Docs/InitializeProjectSetup";
import Login from "Views/Common/Docs/Login";
import Error from "Views/Common/Docs/error";
import InterviewCandidatesRegistration from "Views/InterviewCandidates/Docs/InterviewCandidatesRegistration";
import InterviewCandidatesHome from "Views/InterviewCandidates/Docs/InterviewCandidatesHome";
import InterviewCandidatesAuth from "Views/InterviewCandidates/Docs/InterviewCandidatesAuth";
import CandidateStatus from "CandidateStatus";
import AdminAuth from "Views/Admin/Docs/AdminAuth";
import Layout from "Views/Admin/Layout/Layout";


const App = () => {

  return (
    <HelmetProvider>
      <ToastContainer theme='light' />
      <Routes>
        <Route element={<InitializeProjectSetup />}>
          <Route path="/" element={<Login />} />
          <Route path="candidates_registration" element={<InterviewCandidatesRegistration />} />

          {/* interview candidates Views */}
          <Route path="candidates_home" element={<InterviewCandidatesAuth />}>
            <Route index element={<InterviewCandidatesHome />} />
          </Route>

          <Route path="CandidateStatus" element={<CandidateStatus />} />

          {/* Admin view */}
          <Route path="dashboard" element={<AdminAuth />}>
            <Route element={<Layout />}>
              <Route path="home" element={<p>hi</p>} />
              <Route path="employees" element={<p>employees</p>} />
              <Route path="attendance" element={<p>attendance</p>} />
              <Route path="payroll" element={<p>payroll</p>} />
              <Route path="interview" element={<p>interview</p>} />
              <Route path="circular" element={<p>circular</p>} />
              <Route path="invoices" element={<p>invoices</p>} />
              <Route path="notes" element={<p>notes</p>} />
              <Route path="documents" element={<p>documents</p>} />
            </Route>
          </Route>

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </HelmetProvider >
  )
}
export default App;