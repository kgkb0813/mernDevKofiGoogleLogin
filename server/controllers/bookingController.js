const Booking = require("./../models/bookingModel")

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("roomId")
    if(!bookings) {
      res.status(400)
      throw new Error("bookings are not found")
    } 
    return res.status(200).json(bookings)
  }
  catch (err) {
    next(err)
  }
}

const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("roomId")
    if(!booking) {
      res.status(400)
      throw new Error("booking is not found")
    } 
    return res.status(200).json(booking)
  }
  catch (err) {
    next(err)
  }
}

const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    if(!booking) {
      res.status(400)
      throw new Error("Booking is not created")
    }
    return res.status(200).json(booking)
  }
  catch (err) {
    next(err)
  }
}

const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body},
      { new: true}
    )
    if(!updatedBooking) {
      res.status(400);
      throw new Error("can not create booking!")
    }
    const bookings = await Booking.find();
    return res.status(200).json(bookings)
  }
  catch (err) {
    next(err)
  }
}

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if(!booking) {
      res.status(400)
      throw new Error("can not delete booking")
    }
    return res.status(200).json({id: req.params.id})
  }
  catch (err) {
    next(err)
  }

} 
module.exports = { getBookings, getBooking, createBooking, updateBooking, deleteBooking }