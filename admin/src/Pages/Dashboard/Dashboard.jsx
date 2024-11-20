import "./dashboard.scss"
import React from 'react'
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { getBookings } from '../../features/booking/bookingSlice';
import { Link } from 'react-router-dom';
import Header from "../../component/Header/Header";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {bookings} = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getBookings())
  }, [dispatch])

  return (
    <div className='container'>
      <Header/>
      <div className='table-container'>
        <h1 className='heading center'>Dashboard</h1>
        <table className="table table-stripped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Room</th>
              <th>Confirmed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              bookings.map(item=> 
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.roomId.name}</td>
                  <td>{item.confirmed ? "Yes" : "No"}</td>
                  <td>
                    {/* <Link to={`/bookings/${item._id}`}>View</Link> */}
                    <Link to={`/bookings/${item._id}`} reloadDocument>View</Link>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard