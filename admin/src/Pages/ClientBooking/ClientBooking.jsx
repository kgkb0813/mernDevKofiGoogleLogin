import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createBooking, reset } from "../../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";

const ClientBooking = () => {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSuccess } = useSelector((state) => state.booking); // state.booking: store.js의 configureStore()에 정의된 reducer의 변수 booking을 의미함.
  // eslint-disable-next-line no-unused-vars
  const [room, setRoom] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const { name, email, checkInDate, checkOutDate } = formData;

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        const data = await res.json();
        if (!res.ok) {
          return console.log("there was a problem getting room");
        }
        return setRoom(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getRoom();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigate("/success");
      dispatch(reset());
    }
  }, [isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      roomId,
      name,
      email,
      checkInDate,
      checkOutDate,
    };

    dispatch(createBooking(dataToSubmit)); // dataToSubmit값은 server에서 mongoDB에 저장됨 --> dataToSubmit 데이터 타입은 mongoDB의 booking Model과 데이터 타입이 동일해야 함.
  };

  return (
    <div>
      <h1 className="heading center">Book Now</h1>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter full name"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">Email</label>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Enter your email address"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">Check In Date</label>
            <input
              type="date"
              name="checkInDate"
              value={checkInDate}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">Check Out Date</label>
            <input
              type="date"
              name="checkOutDate"
              value={checkOutDate}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ClientBooking;
