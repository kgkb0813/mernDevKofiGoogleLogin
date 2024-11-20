import "./booking.scss"
import React from 'react'
import { useEffect } from "react"
import { useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { confirmBooking, deleteBooking, reset } from '../../features/booking/bookingSlice';

const Booking = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [booking, setBooking] = useState(null);
  const dispatch = useDispatch()
  

  useEffect(() => {
    dispatch(reset())
    const getBooking = async () => {
      const res = await fetch(`/api/bookings/${id}`, {method: "GET"});
      const data = await res.json(res);
      setBooking(data);
    }
    getBooking();
  }, [id, dispatch])

  const handleConfirm = () => {
    dispatch(confirmBooking(id))
    navigate("/dashboard");
  }
  const handleDelete = () => {
    dispatch(deleteBooking(id))
    navigate("/dashboard");
  }
  const { isSuccess } = useSelector((state)=> state.booking);
  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate("/dashboard");
    }
  }, [isSuccess, dispatch, navigate]);


  return (
    <div>
      {
        booking && (
          <div className="booking">
            <p className='booking-title'>Booking</p>
            <p className='booking-name'>{booking.name}</p>
            <p className="booking-roomname">{booking.roomId.name}</p>
            <p className="booking-etc">{booking.email}</p>
            <p className="booking-etc">{booking.checkInDate}</p>
            <p className="booking-etc">{booking.checkOutDate}</p>
            <div>
            <Link 
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
            </Link>
            </div> 
          </div>
        )
      }

    </div>
  )
}

export default Booking