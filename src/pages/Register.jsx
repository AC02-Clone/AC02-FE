import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Illustration from '../assets/illustration.svg'
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../services/authApi';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }
    
    if (password.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiRegister(username, email, password, confirmPassword);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }
  
    return (
      <>
       <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-b from-[#1F3A5F] to-[#4D648D] items-center justify-center p-12">
          <div className="text-white">
            <div className="flex items-center mb-8">
              <h1 className="text-xl font-semibold">Sistem Monitoring Prediksi Kerusakan Mesin</h1>
            </div>
            <img 
              src={Illustration} 
              alt="Factory Illustration" 
              className="w-full max-w-lg"
            />
          </div>
        </div>
  
        <div className="flex-1 flex justify-center bg-[#1a2942] px-8 py-12">
          <div className="w-full max-w-md">
            <div className="flex justify-between items-center mb-12">
              <div className="text-white text-sm">
                Already Engineer? <Link to="/login" className="underline hover:text-gray-300 border px-2 py-1 ml-4 rounded-lg border-gray-300">Login</Link>
              </div>
              <div className="text-white text-2xl font-bold">
                <img src={Logo} alt="Logo" className='w-24 h-auto'/>
              </div>
            </div>
  
            <div className=''>
              <h2 className="text-white text-5xl font-bold">Welcome</h2>
              <div className="border border-white w-1/3 mb-12 mt-2"></div>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded">
                    Registrasi berhasil! Mengalihkan ke halaman login...
                  </div>
                )}

                <div className="mb-6">
                  <input
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-500 text-white py-3 px-2 focus:outline-none focus:border-blue-400 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-500 text-white py-3 px-2 focus:outline-none focus:border-blue-400 placeholder-gray-400"
                    required
                  />
                </div>
  
                <div className="mb-10 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-500 text-white py-3 px-2 focus:outline-none focus:border-blue-400 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="mb-10 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-500 text-white py-3 px-2 focus:outline-none focus:border-blue-400 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
  
                <button
                  type="submit"
                  disabled={loading || success}
                  className="bg-[#4a6b8a] text-white py-3 px-12 rounded-md hover:bg-[#5a7b9a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </>
    )
}

export default Register