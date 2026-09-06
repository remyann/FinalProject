const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const register = async (req, res) => {
  const userdata = req.body;
  if (
    !userdata.Username ||
    !userdata.Password ||
    !userdata.Email ||
    !userdata.Gender ||
    !userdata.DateOfBirth
  ) {
    return res.status(406).json({ message: "All fields are required" });
  }
  const user = await userModel.create(userdata);
  user.save();
  return res.status(201).json(user);
};
const login = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(406).json({ message: "All fields are required" });
  }
  //   check user is exist or not
  const user = await userModel.findOne({ Email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //   check password
  const result = await bcrypt.compare(Password, user.Password);
  if (result) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    // set jwt tokent to cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    return res
      .status(200)
      .json({ message: "Login Successfully", token: token });
  } else {
    return res.status(200).json({ message: "incorrect password" });
  }
};
const checkAuth = async (req, res) => {};

module.exports = {
  register,
  login,
};
