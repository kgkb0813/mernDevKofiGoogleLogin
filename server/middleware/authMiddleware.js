const User = require("./../models/userModel")
const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if(!token) {
      return res.status(401).json({message: "not authorized"})
    }
    const data = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(data.id)
    if(!user) {
      return res.status(400).json({message: "not authrized"})
    }
    req.user = user
    next()
  }
  catch (err) {
    console.log(err.message)
    return res.status(400).json({message: "no token"})
  }
}

module.exports = { auth }