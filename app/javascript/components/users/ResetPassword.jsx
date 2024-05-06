import React, { useState } from 'react';
import Home from '../Home';
import ApiService from '../common/apiService';
import { API_RESET_PASSWORD } from '../common/apiEndpoints';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ({ setUserData }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await ApiService.post(API_RESET_PASSWORD, { user: { password_challenge: currentPassword, password, password_confirmation: confirmPassword } });
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      setUserData(response.data.user);
      navigate('/');
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
      <h2>-</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="current_password">Current Password:</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
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

export default ResetPassword;