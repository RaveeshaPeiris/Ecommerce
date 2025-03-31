import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  // Handle input change
  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const url =
      currentState === 'Sign Up'
        ? 'http://localhost:5000/api/auth/signup'
        : 'http://localhost:5000/api/auth/login';

    const payload =
      currentState === 'Sign Up'
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (currentState === 'Login') {
          alert('Login Successful');
          console.log('User Info:', data);
          // Redirect to Home Page after login
          navigate('/');
        } else {
          alert('Sign Up Successful');
          setCurrentState('Login');
        }
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Show Name field only for Signup */}
      {currentState === 'Login' ? null : (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChangeHandler}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required={currentState === 'Sign Up'}
        />
      )}
      {/* Email Input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChangeHandler}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      {/* Password Input */}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={onChangeHandler}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />
      {/* Show message from the backend */}
      {message && (
        <p
          className={`text-sm ${
            message.includes('successful') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
      {/* Toggle between Login and Signup */}
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
