import "./rooms.styless.scss"
import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import RoomList from './../../component/RoomList/RoomList';
import { getRooms, reset } from "../../features/room/roomSlice";
import Header from "../../component/Header/Header";

const Rooms = () => {
  const dispatch = useDispatch()
  const { rooms, isSuccess, isLoading } = useSelector((state)=>state.room);

  useEffect(() => {
    dispatch(getRooms())
  }, [dispatch])

  useEffect(() => {
    if(isSuccess) {
      dispatch(reset())
    }
  }, [isSuccess, dispatch])

  if(isLoading) {
    return(
      <div className="heading center">
        Loading...
      </div>
    )
  }

  // console.log(rooms)
  return (
    <div className="container">
      <Header/>
      <h1 className="title center">Rooms</h1>
      {
        rooms?.length >0 ? <RoomList rooms={rooms} /> : null
      }
    </div>
  )
}

export default Rooms