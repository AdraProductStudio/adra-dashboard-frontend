import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "views/Human_Resource/Main_layout/Layout";

const App = () => {


  return (
    <>

      <Routes>
        <Route element={<Layout/>}>
            <Route index element={<h1>Dashboard</h1>}/>
            <Route path="employees" element={<h1>Employer</h1>}/>
            <Route path="attendance" element={<h1>Attendance</h1>}/>
            <Route path="payroll" element={<h1>Payroll</h1>}/>
            <Route path="interview" element={<h1>Interview</h1>}/>
            <Route path="circular" element={<h1>Circular</h1>}/>
            <Route path="invoices" element={<h1>Invoices</h1>}/>
            <Route path="notes" element={<h1>Notes</h1>}/>
            <Route path="documents" element={<h1>Documents</h1>}/>
        </Route>

        <Route path="*" element={<h1>Not found</h1>}/>
      </Routes>
    </>
  );
};

export default App;
