import { useState } from 'react';
import axios from 'axios'; // Import Axios for making API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // Create the navigate function

  const handleSignin = async () => {
    // Reset error and success messages before each attempt
    setError('');
    setSuccessMessage('');

    // Input validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      // On successful login
      setSuccessMessage('Login successful!');
      console.log(response.data); // You can handle response data if necessary

      // Save JWT tokens (you may want to store them in localStorage or cookies)
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Redirect to the homepage or dashboard after successful login
      setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 2000); // Optional: delay the redirect to show the success message for a moment

    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Error occurred during login.');
      } else {
        setError('Server error, please try again later.');
      }
    }
  };

  return (
    <div className="border-2 border-black rounded-xl w-96 p-3 h-[45rem]">
      <div className="border-2 border-gray-500 rounded-lg p-2 h-[40%]">
        <header className="flex justify-center text-2xl font-medium underline">Signin</header>
        <div className="h-[90%] flex flex-col justify-around">
          <div>
            <div>Email:</div>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-black rounded-md px-2 py-1 w-[100%] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div>Password:</div>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-black rounded-md px-2 py-1 w-[100%] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <div
              className="border border-gray-600 rounded-md py-1 w-[10rem] cursor-pointer flex justify-center"
              onClick={handleSignin}
            >
              Sign in
            </div>
            <div className="border border-gray-600 rounded-md py-1 w-[10rem] cursor-pointer flex justify-center">
              Clear
            </div>
          </div>
          <div className="text-sm flex justify-center">
            <p>
              Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a>
            </p>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Signin;
