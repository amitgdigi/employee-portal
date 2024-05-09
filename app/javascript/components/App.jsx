import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Home from './Home';
import LoginForm from '../components/users/LogIn';
import SignUpForm from '../components/users/SignUp';
import ResetPassword from './users/ResetPassword';
import ForgotPassword from './users/ForgotPassword';
import ResetForgotPassword from './users/ResetForgotPassword';
import Chats from './Chats';

const App = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const userDataString = await localStorage.getItem('userData');
        if (userDataString) {
            const parsedUserData = JSON.parse(userDataString);
            if (parsedUserData) {
                setUserData(parsedUserData);
            } else {
                localStorage.removeItem('userData');
            }
        }
    };

    return (
        <Router>
            {/* <ToastContainer position="top-center" /> */}
            <div className="app-container min-h-screen flex flex-col">
                <Header userData={userData} setUserData={setUserData} />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/log-in" element={<LoginForm setUserData={setUserData} />} />
                        <Route path="/sign-up" element={<SignUpForm setUserData={setUserData} />} />
                        <Route path="/reset-password" element={<ResetPassword setUserData={setUserData} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-forgot-password" element={<ResetForgotPassword />} />
                        <Route path="/chats" element={<Chats userData={userData} />} />
                        {/* <Route path="/reset-password" element={<ResetPasswordForm />} />

                        {/* Catch all undefined routes */}
                        {/* <Route path="*" element={<ErrorPage />} /> */}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;