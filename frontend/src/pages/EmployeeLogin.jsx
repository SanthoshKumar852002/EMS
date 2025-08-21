import React, { useState } from 'react';
import axios from 'axios';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    try {
      const res = await axios.post('/api/employee/login', { email, password });
      localStorage.setItem('employee', JSON.stringify(res.data));
      window.location.href = '/employee/profile';
    } catch (err) {
      alert('Invalid login');
    }
  };

  return (
    <div className="p-4">
      <h1>Employee Login</h1>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} type="password" />
      <button onClick={loginHandler}>Login</button>
    </div>
  );
};

export default EmployeeLogin;
