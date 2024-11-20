import "./header.scss"
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, deleteUser, deleteSocial, reset } from '../../features/auth/authSlice';
import { setClientBookingMode } from "features/appState/appStateSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state)=> state.auth);   // auth: store.js 참조
  const { clientBookingMode } = useSelector((state)=> state.appState);

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(reset())
  }

  const handleDelete = () => {
    user.loginType === "email" ? dispatch(deleteUser(user)) : dispatch(deleteSocial(user._id))
    dispatch(reset())
  }

  const handleBooking = () => {
    clientBookingMode === true ?  dispatch(setClientBookingMode(false)) : dispatch(setClientBookingMode(true))
  }
  
  return (
    <div className="container">
    <div className='header'>
      <Link to="/" className='header_title'>YtVilla</Link>

      <nav className='header_list'>
        <Link to="/" >Home</Link>
        <Link to="/rooms" >Rooms</Link>
        {
          user? (
            <>
              <Link to="/dashboard" >Dashboard</Link>
              <Link to="/rooms/create" >Create</Link>   {/* --> CreateRoom.jsx */}
              <Link to={`/profile/${user._id}`} >Profile</Link>   {/* --> Profile.jsx */}
              <Link to="/login" onClick={handleLogout}>Logout</Link>
              <Link to="/register" onClick={handleDelete}>Delete</Link>
              {/* <button onClick={handleLogout}>Logout</button> */}
            </>
          ):(
            <>
              <Link to="/login" >Login</Link>
              <Link to="/register" >Register</Link>
              {
                clientBookingMode === true ? (
                  <Link to="/" onClick={handleBooking} style={{margin: "0 0 0 10px", color: "red", fontSize: "1.5rem", fontWeight: "300"}}>in Booking Mode</Link>
                ) : (
                  <Link to="/" onClick={handleBooking} style={{margin: "0 0 0 10px"}}>Booking</Link>
                )
              }
            </>
          )
        }
      </nav>
    </div>
    </div>
  )
}

export default Header