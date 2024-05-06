import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../common/apiService';
import { API_LOGIN } from '../common/apiEndpoints';

const LogIn = ({ setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await ApiService.post(API_LOGIN, { user: { email, password } });
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      setUserData(response.data.user);
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

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    console.log('Loging up user:', { email, password });
  };

  return (
    <div>
      <h2>Sign In</h2>
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
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogIn;