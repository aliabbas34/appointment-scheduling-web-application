import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterFrom'
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import EditWorkingHours from './components/EditWorkingHours';
import EditBreaks from './components/EditBreaks';
import EditDaysOff from './components/EditDaysOff';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import UserHomePage from './components/UserHomePage';
import BookAppointment from './components/BookAppointment';
import UserAppointments from './components/UserAppointments';
import ConsultantAppointments from './components/ConsultantAppointments';

function App() {

  return (
    <>
      <Router>
            <Routes>
                <Route path="/consultant/home" element={<HomePage/>} />
                <Route path="/consultant/login" element={<LoginPage />} />
                <Route path="/consultant/register" element={<RegisterForm />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/consultant/working-hours" element={<EditWorkingHours />} />
                <Route path="/consultant/breaks" element={<EditBreaks />} />
                <Route path="/consultant/days-off" element={<EditDaysOff />} />
                <Route path="/consultant/show/appointment" element={<ConsultantAppointments/>} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/home" element={<UserHomePage />} />
                <Route path="/book/:id" element={<BookAppointment/>} />
                <Route path="/show/appointment" element={<UserAppointments/>} />
            </Routes>
      </Router>
    </>
  )
}

export default App
