import { useState } from 'react';
import axios from 'axios'; // Import Axios for making API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // Create the navigate function

  const handleSignup = async () => {
    // Reset error and success messages before each attempt
    setError('');
    setSuccessMessage('');

    // Input validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
      });

      // On successful signup
      setSuccessMessage('User registered successfully!');
      console.log(response.data); // You can handle response data if necessary

      // Redirect to the signin page after registration
      setTimeout(() => {
        navigate('/signin'); // Redirect to signin page
      }, 2000); // Optional: delay the redirect to show the success message for a moment

    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Error occurred during signup.');
      } else {
        setError('Server error, please try again later.');
      }
    }
  };

  return (
    <div className="border-2 border-black rounded-xl w-96 p-3 h-[45rem]">
      <div className="border-2 border-gray-500 rounded-lg p-2 h-[50%]">
        <header className="flex justify-center text-2xl font-medium underline">Signup</header>
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
            <div>New Password:</div>
            <input
              type="password"
              placeholder="Set a password"
              className="border border-black rounded-md px-2 py-1 w-[100%] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <div>Confirm Password:</div>
            <input
              type="password"
              placeholder="Confirm the password"
              className="border border-black rounded-md px-2 py-1 w-[100%] outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <div
              className="border border-gray-600 rounded-md py-1 w-[10rem] cursor-pointer flex justify-center"
              onClick={handleSignup}
            >
              Signup
            </div>
            <div className="border border-gray-600 rounded-md py-1 w-[10rem] cursor-pointer flex justify-center">
              Clear
            </div>
          </div>
          <div className="text-sm flex justify-center">
            <p>
              Already have an account? <a href="/signin" className='text-blue-500'>Sign in</a>
            </p>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
