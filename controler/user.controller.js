const bcrypt = require("bcrypt");
const { SALT, JWT_SECRET } = require("../config/variables");
const { UserModel } = require("../model/user.model");
const jsonwebtoken = require("jsonwebtoken");
const { BlacListModel } = require("../model/blacklist.model");
const { default: mongoose } = require("mongoose");

exports.registerUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, SALT);
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).send({ msg: "Registration successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getsingleUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await UserModel.findById(userID);
    res.status(200).send({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send({ users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).send({ msg: "Invalid Credetials" });
    if (user.status == "disable")
      return res.status(200).send({ msg: "Your access is disabled" });
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(400).send({ msg: "Invalid Credetials" });
    const accessToken = jsonwebtoken.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).send({ msg: "Login Success", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const item = new BlacListModel({ accessToken: req.accessToken });
    await item.save();
    res.status(200).send({ msg: "Logout Success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.manageAccess = async (req, res) => {
  const { id, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ msg: "Invalid ID" });
    }
    const user = await UserModel.findById(id);
    if (!user || user.role == "admin") {
      return res.status(404).send({ msg: "No user found" });
    }
    Object.assign(user, { status });
    await user.save();
    res.status(200).send({ msg: "Operation success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};
