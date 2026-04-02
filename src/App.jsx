import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuggestionPage from './pages/Suggestion/SuggestionPage';
import DefaultDashboard from './pages/Dashboard/DefaultDashboard';
import HodDash from './components/Dash_hod/HodDash';
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import ApplyLeavePage from "./pages/Faculty/ApplyLeavePage";
import { LoginPage, SignupPage, NewPasswordPage, VerifyOtpPage, ForgetPasswordPage } from './pages/Login';
import LeaveApplication from './pages/LeaveApplication/LeaveApplication';
import VJTICasualLeaveForm from './pages/LeaveApplication/CasualLeaveApp';
import RejectedApplications from './pages/LeaveApplication/RejectedApplications';
import PendingApplications from './pages/LeaveApplication/PendingApplications';
import ApprovedApplications from './pages/LeaveApplication/ApprovedApplications';
import FacultyMainPage from './pages/FacultyMainPage';
import Notification from './pages/notification';
import Facultyonleave from './components/faculty/Facultyonleave';
import AdminDash from './components/Dash_hod/AdminDash';
<Route path="/login" element={<Navigate to="/login" replace />} />
function App() {
  return (
    <Routes>
      <Route path="/facultymain" element={<FacultyMainPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/" element={<LoginPage />} /> */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/suggestions" element={<SuggestionPage />} />
      <Route path="/default" element={<DefaultDashboard />} />
      <Route path="/leave-application" element={<LeaveApplication />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/new-password" element={<NewPasswordPage />} />
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}

      <Route path="*" element={<Navigate to="/facultymain" replace />} />
      
      <Route path="/Hoddash" element={<HodDash />} />
      {/* <Route path="/Deandash" element={<DeanDash />} /> */}
      {/* <Route path="/DepDirdash" element={<DepDirDash />} /> */}
      {/* <Route path="/Dirdash" element={<DirDash />} /> */}
      <Route path="/faculty" element={<FacultyDashboard />} />
      <Route path="/faculty/apply" element={<ApplyLeavePage />} />
      <Route path="/casual-leave-application" element={<VJTICasualLeaveForm />} />
      <Route path="/rejected-applications" element={<RejectedApplications />} />
      <Route path="/pending-applications" element={<PendingApplications />} />
      <Route path="/approved-applications" element={<ApprovedApplications />} />
      <Route path="/faculty-on-leave" element={<Facultyonleave />} />
      <Route path="/Admindash" element={<AdminDash />} />
    </Routes>
  );
}

export default App;
