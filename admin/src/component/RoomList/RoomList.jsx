import "./roomList.styles.scss";
import React from 'react'
import { Link } from 'react-router-dom';
import Carousel from "../Carousel/Carousel";

const RoomList = ({rooms}) => {
  return (
    <div id="room-list">
      {
        rooms.map((room) => (
          <Link
            to={`/rooms/all/${room._id}`}
            key={room._id}
            className='room-unit'
          >
            <div className='img-wrapper'>
              <img src={room.img[0]} alt=""/>
              {/* <Carousel data={room.img} /> */}
            </div>
            <p className='name'>{room.name}</p>
          </Link>
        ))
      }
    </div>
  )
}

export default RoomList