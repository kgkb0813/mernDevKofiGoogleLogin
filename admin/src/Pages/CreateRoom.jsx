import React, { useEffect } from 'react'
import { useState } from 'react';
import { uploadImage } from './../helper/utils';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, reset } from './../features/room/roomSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header/Header';

const CreateRoom = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSuccess } = useSelector((state) => state.room);

  const navigate = useNavigate();
  const [files, setFiles] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    roomNumbers: "" 
  });
  const { name, price, desc, roomNumbers } = formData;

  useEffect(() => {
    if(!user) {
      navigate("/login");
    }
  }, [user, navigate])    

  useEffect(() => {
    if(isSuccess) {
      dispatch(reset());
      navigate("/rooms")
    }
  }, [isSuccess, dispatch, navigate])
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const handleFileChange = async (e) => {
    setFiles(e.target.files)
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

    // Promise.all: 비동기로 진행되는 이미지업로드되는 모든 작업이
    //              완료될때까지 기다린 후 url을 return
    // Object.values(files): files의 모든값을 배열로 변환
    //              files의 각 file들을 이미지업로드 후 주소 배열을 return 
    let list = [];
    list = await Promise.all(
      Object.values(files).map(async (file) => {
        const url = await uploadImage(file)
        return url;
      })
    )

    const dataToSubmit = {
      name, price, desc, 
      roomNumbers: roomArray,
      img: list
    }

    
    dispatch(createRoom(dataToSubmit))
  }
  // console.log(isSuccess, name, price, desc, roomNumbers)
  
  return (
    <div>
      <Header/>
      <h1 className='heading center'>CreateRoom</h1>

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

          <div className='input-group'>
            <label htmlFor="images">Images</label>
            <input 
              type= "file" 
              name="file" 
              multiple
              onChange={handleFileChange}
            />
          </div>

          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default CreateRoom