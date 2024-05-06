import React, { useState } from 'react';
import Home from '../Home';
import ApiService from '../common/apiService';
import { API_FORGOT_PASSWORD } from '../common/apiEndpoints';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetForgotPassword = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await ApiService.patch(API_FORGOT_PASSWORD, { token: resetToken, user: { password, password_confirmation: confirmPassword } });

      navigate('/log-in');
    } catch (error) {
      const err = error;
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError(err)
      }
    }

    if (!currentPassword || !password) {
      setError('Please fill in all fields');
      return;
    }
    console.log('Loging up user:', { currentPassword, password });
  };

  return (
    <div>Reset Password
      <h2>-Forgot Password</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input
            type="password"
            id="password_confirmation"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetForgotPassword;