import "./header.scss"
import React from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, reset } from '../../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state)=> state.auth);   // auth: store.js 참조

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(reset())
  }
  console.log(user)
  return (
    <div className='header'>
      <Link to="/" className='header_title'>YtVilla</Link>

      <nav className='header_list'>
        <Link to="/" >Home</Link>
        <Link to="/rooms" >Rooms</Link>
        {
          user? (
            <>
              <Link to="/dashboard" >Dashboard</Link>
              <Link to="/rooms/create" >Create</Link>
              <Link to="/login" onClick={handleLogout}>Logout</Link>
              {/* <button onClick={handleLogout}>Logout</button> */}
            </>
          ):(
            <>
              <Link to="/login" >Login</Link>
              <Link to="/register" >Register</Link>
            </>
          )
        }
      </nav>
    </div>
  )
}

export default Header