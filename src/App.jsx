import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Index from "../src/components/landing-page/Index";
import SymptomsAnalysis from "./components/form/SymptomsAnalysis";
import Signup from "../src/components/Auth/Patients/Signup";
import Login from "../src/components/Auth/Patients/Login";
import DoctorSignup from "../src/components/Auth/Doctors/DoctorSignup";
import DoctorLogin from "../src/components/Auth/Doctors/DoctorLogin";
import Patient from "../src/components/Dashboard/Patient";
import Doctor from "../src/components/Dashboard/Doctor"
import DoctorRegistration from "../src/components/form/DoctorRegistration";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/patient/signup" element={<Signup />} />
      <Route path="/patient/login" element={<Login />} />
      <Route path="/doctor/signup" element={<DoctorSignup />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/patient" element={<SymptomsAnalysis />} />
      <Route path="/patient/dashboard" element={<Patient />} />
      <Route path="/doctor/dashboard" element={<Doctor />} />
      <Route path="/doctor/registration" element={<DoctorRegistration />} />

    </Routes>
  );
}

export default App;
