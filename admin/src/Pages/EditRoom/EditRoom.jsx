import "./editroom.scss"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, reset, updateRoom } from './../../features/room/roomSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../../component/Header/Header";

const EidtRoom = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSuccess } = useSelector((state) => state.room);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    roomNumbers: "" 
  });
  const { name, price, desc, roomNumbers } = formData;
  const { id } = useParams();

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        const room = await res.json();
        const { roomNumbers, ...rest} = room;
        const roomMap = roomNumbers.map(item => item.number)
        const roomString = roomMap.join(",")
        setFormData({
          roomNumbers: roomString,
          ...rest,
        })
      }
      catch (err) {
        console.log(err);
      }
    }
    getRoom();
  }, [])    

  useEffect(() => {
    if(isSuccess) {
      dispatch(reset())
      navigate(`/rooms/all/${id}`);
    }
  }, [id, isSuccess, dispatch, navigate])

  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !price || !roomNumbers) {
      return;
    }
    const roomArray = roomNumbers.split(",").map((item) => {
      return {
        number: parseInt(item),
        unavailableDates: [],
      }
    })

    const dataToSubmit = {
      name, price, desc, 
      roomNumbers: roomArray,
      roomId: id,
    }

    dispatch(updateRoom(dataToSubmit))
  }
  // console.log(isSuccess, name, price, desc, roomNumbers)
  
  return (
    <div className="container">
      <Header/>
      <h1 className='heading center'>Edit Room</h1>

      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor="name">Name</label>
            <input 
              type = "text" 
              name = "name" 
              value = {name} onChange={handleChange}
              placeholder = "Enter your name" />
          </div>
          
          <div className='input-group'>
            <label htmlFor="price">Price</label>
            <input 
              type = "text" 
              name = "price"
              value = {price} onChange={handleChange}
              placeholder = "Enter room price" />
          </div>

        <div className='input-group'>
          <label htmlFor="desc">Description</label>
          <textarea 
            name="desc" 
            cols="30" rows="10" 
            value={desc} onChange={handleChange}
            placeholder="Enter Your Message"
          />
        </div>

        <div className='input-group'>
          <label htmlFor="roomNumbers">Room Numbers</label>
          <textarea 
            name="roomNumbers" 
            cols="30" rows="10" 
            value={roomNumbers} onChange={handleChange}
            placeholder="Enter room numbers"
          />
        </div>
        
        <button type='submit'>Submit</button>

        </form>

        {/* 
        <form onSubmit={handleSubmit}>




        </form> */}
      </div>
    </div>
  )
}

export default EidtRoom