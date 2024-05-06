import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_LOGOUT } from '../common/apiEndpoints';
import ApiService from '../common/apiService';

const Header = ({ userData, setUserData }) => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('');

    const handleLogout = async () => {
        console.log("========");
        try {
            const response = await ApiService.delete(API_LOGOUT);
            console.log("Logout API response:", response)
            localStorage.removeItem('userData');
            setUserData(null)
            navigate('/');
        } catch (error) {
        }
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <div className="header-2">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark py-2 md:py-4">
                <div className="container">
                    <Link to="/" className="navbar-brand font-weight-bold text-xl text-indigo-600">ChatApp</Link>
                    <button className="navbar-toggler border-0 p-2" type="button" data-toggle="collapse" data-target="#navbar-collapse" aria-controls="navbar-collapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-column flex-md-row ml-md-auto mt-3 mt-md-0" id="navbar-collapse">
                        {userData ? (
                            <>
                                <Link
                                    to="/"
                                    className={` ${activeLink === '/' ? ' active' : ''}`}
                                    onClick={() => handleLinkClick('/')}
                                >
                                    Home
                                </Link>
                                <div className="nav-item text-indigo-600 text-center">
                                    Welcome, <span className="font-weight-bold">{userData.email}</span>
                                </div>
                                <Link
                                    to="/reset-password"
                                    onClick={() => handleLinkClick('/reset-password')}
                                    className="">Reset Password
                                </Link>

                                <Link
                                    to="/"
                                    onClick={handleLogout}
                                    className="">Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/log-in"
                                    className={` font-weight-bold text-indigo-600 ${activeLink === '/log-in' ? ' active' : ''}`}
                                    onClick={() => handleLinkClick('/log-in')}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/forgot-password"
                                    onClick={() => handleLinkClick('/forgot-password')}
                                    className="">Forgot Password
                                </Link>

                                <Link
                                    to="/sign-up"
                                    className={` font-weight-bold text-indigo-600 ${activeLink === '/sign-up' ? ' active' : ''} ml-md-1`}
                                    onClick={() => handleLinkClick('/sign-up')}
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;