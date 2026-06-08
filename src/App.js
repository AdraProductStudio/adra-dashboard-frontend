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
import AdminAuth from "Views/Admin/Docs/AdminAuth";
import Layout from "Views/Admin/Layout/Layout";
import Campaign from 'Views/Admin/Docs/Campaign/Campaign';
import Campaign_detail from "Views/Admin/Docs/Campaign/Campaign_detail";
import Campaign_candidate_details from "Views/Admin/Docs/Campaign/Campaign_candidate_details";
import FellowshipCandidatesRegistration from "Views/Common/Docs/FellowshipCandidatesRegistration";
import Fellowship from "Views/Admin/Docs/Fellowship";
import FellowshipDetails from "Views/Admin/Docs/Fellowship/details";
import Sample_test from "Views/Admin/Docs/Campaign/Sample_test";


const App = () => {

  return (
    <HelmetProvider>
      <ToastContainer theme='light' />
      <Routes>
        <Route element={<InitializeProjectSetup />}>
          <Route path="/" element={<Login />} />
          <Route path="candidates_registration" element={<InterviewCandidatesRegistration />} />
          <Route path="fellowship_candidate_register" element={<FellowshipCandidatesRegistration />} />

          {/* interview candidates Views */}
          <Route path="candidates_home" element={<InterviewCandidatesAuth />}>
            <Route index element={<InterviewCandidatesHome />} />
          </Route>

          {/* Admin view */}
          <Route path="dashboard" element={<AdminAuth />}>
            <Route element={<Layout />}>
              {/* <Route path="home" element={<p>hi</p>} />
              <Route path="employees" element={<p>employees</p>} />
              <Route path="attendance" element={<p>attendance</p>} />
              <Route path="payroll" element={<p>payroll</p>} /> */}

              <Route path="interview">
                <Route index element={<Campaign />} />
                <Route path=":campaign_id" element={<Campaign_detail />} />
                <Route path=":campaign_id/generate_sample_test" element={<Sample_test />} />
                <Route path=":campaign_id/:candidate_id" element={<Campaign_candidate_details />} />
              </Route>

              {/* <Route path="circular" element={<p>circular</p>} />
              <Route path="invoices" element={<p>invoices</p>} />
              <Route path="notes" element={<p>notes</p>} />
              <Route path="documents" element={<p>documents</p>} />
              <Route path="fellowship_candidates" >
                <Route index element={<Fellowship />} />
                <Route path=":fellowship_candidate_id" element={<FellowshipDetails />} />
              </Route> */}
            </Route>
          </Route>

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </HelmetProvider >
  )
}
export default App;