const Room = require("../models/roomModel")

const getRooms = async (req, res, next) => {
  try{
    const rooms = await Room.find();
    if(!rooms) {
      res.status(400)
      throw new Error("rooms not found")
    }
    return res.status(200).json(rooms)
  }
  catch (err) {
    next(err)
  }
}

const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if(!room) {
      res.status(401)
      throw new Error("room not found")
    }
    return res.status(200).json(room)
  }
  catch (err) {
    next(err)
  }
}

const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    if (!room) {
      res.status(400);
      throw new Error("there was a problem creating");
    }
    
    const rooms = await Room.find();
    return res.status(201).json(rooms);
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    if(!updateRoom) {
      res.status(400)
      throw new Error("cannot update room")
    }
    return res.status(200).json(updateRoom);
  }
  catch (err) {
    next(err);
  }
}

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id)
    if(!room) {
      res.status(400)
      throw new Error("room not deleted")
    }
    return res.status(200).json({id: req.params.id})
  }
  catch (err) {
    next(error)
  }

}
module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom }