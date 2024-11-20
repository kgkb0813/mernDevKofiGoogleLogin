import "./room.styles.scss";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, deleteRoom } from "../../features/room/roomSlice";
import Carousel from "./../../component/Carousel/Carousel";
import Header from "../../component/Header/Header";


const Room = () => {
  const { clientBookingMode } = useSelector((state)=> state.appState);
  const { user } = useSelector((state) => state.auth);
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    console.log("===clientBookingMode: ",clientBookingMode)
    if (isSuccess) {
      navigate("/rooms");
      dispatch(reset());
    }
  }, [isSuccess, dispatch, navigate]);

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getRoom();
  }, [id]);
  
  const handleDelete = () => {
    dispatch(deleteRoom(id));
  };

  return (
    <div id="room">
      <Header/>
      <div className="container">
        {room ? (
          <div>
            <div className="img-wrapper">
              <Carousel data={room.img} />
              {/* <img src={room.img[0]} alt="" /> */}
            </div>

            <div className="text-wrapper">
              <h1 className="heading center"> {room.name} </h1>
              <p> {room.desc} </p>
              <h2> ${room.price.toFixed(2)} </h2>
            </div>

            {
              user && user.isAdmin ? (
                <div className="cta-wrapper">
                  <Link to={`/edit/rooms/${room._id}`}>Edit Room</Link>      {/* <Link to={`http://localhost:3000/edit/rooms/${room._id}`}>Edit Room</Link> */}
                  <button onClick={handleDelete}>Delete Room</button>
                </div>
              ) : null
            }
            {
              clientBookingMode ? (
                <div className="cta-wrapper">
                  <Link to={`/clientbookings/${room._id}`}>Book Now</Link>    
                </div>
              ) : null
            }
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Room;
