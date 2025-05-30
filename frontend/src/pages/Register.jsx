import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setUsernameError('');
    setPasswordError([]);
    try {
      await api.post('user/register/', {
        username: username, email: email, password: password
      })
      setSuccess(true);
    } catch (error) {
      error.response.data.username ? setUsernameError("A user with that username already exists!") : setUsernameError('');
      error.response.data.email ? setEmailError("A user with that email already exists!") : setEmailError("");
      error.response.data.password ? setPasswordError(error.response.data.password) : setPasswordError([]);
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">SN</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Shoppy Nepal</h2>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success&&(
            <p className='text-sm italic text-center text-green-500'>User created successfully, you may now <Link className='underline hover:cursor-pointer' to={'/login'}>login!</Link></p>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <p className='text-center text-sm italic text-red-500'>{usernameError}</p>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <p className='text-center text-sm italic text-red-500'>{emailError}</p>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <ul className='text-sm italic text-red-500 text-center'>
                {passwordError.length > 0 ? passwordError.map((err) => (
                  <li key={Math.random()}>{err}</li>
                )) : null}
              </ul>

              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="text-sm">
              <p className="text-gray-600">
                By creating an account, you agree to our{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          &copy; 2023 Shoppy Nepal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;