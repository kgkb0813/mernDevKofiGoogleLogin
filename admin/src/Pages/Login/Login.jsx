import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, reset } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import { setClientBookingMode } from 'features/appState/appStateSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, isError, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password:""
  });
  const { email, password } = formData;

  useEffect(() => {
    dispatch(setClientBookingMode(false))
    if(isError === true) {
      alert("Login Failed")
      dispatch(reset())
    }
    if(isSuccess) {
      navigate("/")
      dispatch(reset())
    }
  }, [isSuccess, user, isError])

  const handleChange = (e) => {
    setFormData((data) => ({...data, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {email, password};
    dispatch(loginUser(dataToSubmit))
  }
  // console.log( email, password)

  return (
    <div className='container'>
      <Header/>
      <h1 className='heading center'>Login</h1>
    
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            Submit
          </button>

        </form>
      </div>

    </div>
  )
}

export default Login