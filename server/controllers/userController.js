const bcrypt = require("bcryptjs")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel")

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if(!users) {
      res.status(400)
      throw new Error("users not found")
    }
    return res.status(200).json(users)
  }
  catch (err) {
    next(err)
  }
}

const createUser = async (req, res, next) => {
  try {
    const { password, ...rest} = req.body;
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    if(!user) {
      res.status(400)
      throw new Error("user creating error")
    }
    const { password: userPassword, ...others} = user._doc;
    return res.status(200).json(others)
  }
  catch (err) {
    next(err)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if(!user) {
      res.status(400)
      throw new Error("login failed")
    }

    const isCorrect = await bcrypt.compare(password, user.password)
    if(!isCorrect) {
      res.status(400)
      throw new Error("incorrect password")
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("jwt", token)

    const {password: userPassword, ...others} = user._doc;
    return res.status(200).json(others);
  }
  catch (err) {
    next(err);
  }
}

const loginSocial = async (req, res, next) => {
  const { email, loginType } =  req.body;
  try {   
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      res.cookie('jwt', token, {  // access_token --> jwt
        httpOnly: true,
        expires: expiryDate,
      })
      return res.status(200).json(rest);
    } 
    else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        name: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8), // req.body.name에 포함된 빈칸을 삭제한 후 소문자로 변환 후, 8개의 임의 문자열과 합친다 
        email: req.body.email,
        password: hashedPassword,
        loginType: loginType,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;  // 비번을 제외시킨 후, rest에 저장
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res.cookie('jwt', token, { // access_token --> jwt
        httpOnly: true,
        expires: expiryDate,
      })
      return res.status(200).json(rest);  // 비번을 제회한 정보를 return
    }
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  res.cookie("jwt", " ", { expiresIn: "-1" });
  return res.json({ message: "you have been logged out" });
};

const deleteUser = async (req, res, next) => {
  if (req.body.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }
};

const deleteSocial = async (req, res, next) => {
  const { mid, uid } = req.body;    // mid: mongoDB id, uid: Firebase id

  // Firebase Admin 초기화는 한 번만 수행
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    const serviceAccount = require('../config/merndevkofi-firebase-adminsdk-lc73m-52b270f84b.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  //delete account in Firebase
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: 'Account deleted successfully in Firebase' });
  } 
  catch (error) {
    // next(error);
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }

  // delete account in mongoDB
  try {
    await User.findByIdAndDelete(mid);
    res.status(200).json('User has been deleted in databse...');
  } catch (error) {
    next(error);
  }


};

module.exports = { getUsers, createUser, loginUser, loginSocial, logoutUser, deleteUser, deleteSocial }


{/* loginGoogle(), loginGithub()
  const loginGoogle = async (req, res, next) => {
    try {   
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        const { password: hashedPassword, ...rest } = user._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        
        res.cookie('jwt', token, {  // access_token --> jwt
          httpOnly: true,
          expires: expiryDate,
        })
        return res.status(200).json(rest);
      } 
      else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        
        const newUser = new User({
          name: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8), // req.body.name에 포함된 빈칸을 삭제한 후 소문자로 변환 후, 8개의 임의 문자열과 합친다 
          email: req.body.email,
          password: hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword2, ...rest } = newUser._doc;  // 비번을 제외시킨 후, rest에 저장
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res.cookie('jwt', token, { // access_token --> jwt
          httpOnly: true,
          expires: expiryDate,
        })

        return res.status(200).json(rest);  // 비번을 제회한 정보를 return
      }
    } catch (error) {
      next(error);
    }
  };

  const loginGithub = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        const { password: hashedPassword, ...rest } = user._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        
        res.cookie('jwt', token, {  // access_token --> jwt
          httpOnly: true,
          expires: expiryDate,
        })
        return res.status(200).json(rest);
      } 
      else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        
        const newUser = new User({
          name: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8), // req.body.name에 포함된 빈칸을 삭제한 후 소문자로 변환 후, 8개의 임의 문자열과 합친다 
          email: req.body.email,
          password: hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword2, ...rest } = newUser._doc;  // 비번을 제외시킨 후, rest에 저장
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res.cookie('jwt', token, { // access_token --> jwt
          httpOnly: true,
          expires: expiryDate,
        })

        return res.status(200).json(rest);  // 비번을 제회한 정보를 return
      }
    } catch (error) {
      next(error);
    }
  };

*/}