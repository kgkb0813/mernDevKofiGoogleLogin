const express = require("express")
const connectDB =require("./config/db")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv").config()
const cors = require('cors');
const path = require('path');

// for render.com
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/admin/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dist', 'index.html'));
});

const auth = require("./middleware/authMiddleware")
const bookingRoutes = require("./routes/bookingRoutes")
const roomRoutes = require("./routes/roomRoutes")
const userRoutes = require("./routes/userRoutes")
const { errorHandler } = require("./middleware/errorHandler")

const app = express()

app.use(cors());

// middleware
app.use(express.json())
app.use(errorHandler)
app.use(cookieParser())

// setup routes
app.use("/api/rooms", roomRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/users", userRoutes)

const PORT = process.env.PORT || 5000
connectDB()
app.listen(PORT, () => {
  console.log(`Backend Server is running on Port ${PORT}...`);
})

