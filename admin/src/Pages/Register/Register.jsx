import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, reset } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
// import { OAuthGoogle } from './../../component/OAuth/OAuthGoogle';
// import { OAuthGithub } from './../../component/OAuth/OAuthGithub';
import { OAuthGoogleGithub } from './../../component/OAuth/OAuthGoogleGithub';
import { setClientBookingMode } from 'features/appState/appStateSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, user } = useSelector((state) => state.auth); 
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password:""
  });
  const { name, email, password } = formData;

  useEffect(() => {
    dispatch(setClientBookingMode(false))
    if(isSuccess) {
      navigate("/login")
      dispatch(reset())
    }
  }, [isSuccess, user, navigate, dispatch])

  const handleChange = (e) => {
    setFormData((data) => ({...data, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {name, email, password};
    dispatch(registerUser(dataToSubmit))
  }

  return (
    <div className='container'>
      <Header/>
      <h1 className='heading center'>Register</h1>
    
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>

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

          <br/>
          <button type="submit">
            Submit
          </button>

        </form>
        <OAuthGoogleGithub/>
        {/* <OAuthGoogle/>
        <OAuthGithub/> */}

      </div>

    </div>
  )
}

export default Register


