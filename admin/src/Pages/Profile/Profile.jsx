import Header from 'component/Header/Header'
import React from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, deleteSocial, reset } from '../../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=> state.auth)

  const handleDelete = async () => {
    user.loginType === "email" ? dispatch(deleteUser(user)) : dispatch(deleteSocial(user._id))
    dispatch(reset())
  }
  
  return (
    <div>
      <Header/>
      <div>
        {
          user && (
            <div className="booking">
              <p className='booking-title'>Profile</p>
              <p className='booking-title'>of Current User</p>
              <br/> <br/>
              <p className='booking-name'>{user.name}</p>
              <p className="booking-roomname">{user.email}</p>
              <div>
              <Link 
                to="/register"
                onClick={handleDelete}
              >
                Delete Account
              </Link>

              {/* <Link 
                to="/dashboard"
                onClick={handleConfirm}
              >
                Confirm
              </Link>
              <Link 
                to="#" className="booking-delete"
                onClick={handleDelete}
              >
                Delete
              </Link> */}
              </div> 
            </div>
          )
        }

      </div>
    </div>
  )
}

export default Profile