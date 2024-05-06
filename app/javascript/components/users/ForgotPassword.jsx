import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../common/apiService';
import { API_FORGOT_PASSWORD } from '../common/apiEndpoints';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await ApiService.post(API_FORGOT_PASSWORD, { email });
      console.log(response.data.user);
      navigate('/');
    } catch (error) {
      const err = error;
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError(err)
      }
    }

    if (!email) {
      setError('Please fill in all fields');
      return;
    }
    console.log('Loging up user:', { email });
  };

  return (
    <div>
      <h2>Forgot Password </h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPassword;