import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Header from "./component/Header/Header";
import Home from './Pages/Home/Home';
import "./App.scss"
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import CreateRoom from './Pages/CreateRoom';
import Room from './Pages/Room/Room';
import EditRoom from './Pages/EditRoom/EditRoom';
import Rooms from './Pages/Rooms/Rooms';
import Booking from './Pages/Booking/Booking';
import Profile from './Pages/Profile/Profile';
import ClientBooking from './Pages/ClientBooking/ClientBooking'
import Success from "./Pages/Success/Success";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/rooms/create' element={<CreateRoom />} />
        <Route path="/rooms/all/:id" element={<Room />} />
        <Route path="/edit/rooms/:id" element={<EditRoom />} />
        <Route path="/bookings/:id" element={<Booking />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/clientbookings/:id" element={<ClientBooking />} />
        <Route path="/success" element={<Success />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;





// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Home from './Pages/Home/Home';
// import "./App.scss";
// import Register from './Pages/Register/Register';
// import Login from './Pages/Login/Login';
// import Dashboard from './Pages/Dashboard/Dashboard';
// import CreateRoom from './Pages/CreateRoom';
// import Room from './Pages/Room/Room';
// import EditRoom from './Pages/EditRoom/EditRoom';
// import Rooms from './Pages/Rooms/Rooms';
// import Booking from './Pages/Booking/Booking';
// const router = createBrowserRouter([
//   {path: '/', element: (<Home />)},
//   {path: '/register', element: (<Register />)},
//   {path: '/login', element: (<Login />)},
//   {path: '/rooms', element: (<Rooms />)},
//   {path: '/dashboard', element: (<Dashboard />)},
//   {path: '/rooms/create', element: (<CreateRoom />)},
//   {path: '/rooms/all/:id', element: (<Room />)},
//   {path: '/edit/rooms/:id', element: (<EditRoom />)},
//   {path: '/bookings/:id', element: (<Booking />)},
// ]);

// function App() {
//   return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
// }

// export default App;






