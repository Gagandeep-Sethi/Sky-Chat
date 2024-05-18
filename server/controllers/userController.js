const {
  generateJwtToken,
  generateTokenExpiry,
  generateVerificationToken,
} = require("../helpers/tokenGeneration");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields must be field");
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("Invalid username or password");
    }
    const passwordCheck = await bcrypt.compare(password, user.password || "");
    if (!passwordCheck) {
      throw new Error("Invalid username or password");
    }
    if (!user.verified) {
      throw new Error("Verify your Email !!");
    }
    generateJwtToken(user?._id, res);
    res
      .status(200)
      .json({ email, username: user.username, profilePic: user?.profilePic });
  } catch (error) {
    console.log(error, "sigup error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    if (!username || !password || !confirmPassword || !email) {
      throw new Error("All Fields must be filled");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Email not valid");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Not a strong password");
    }
    if (password !== confirmPassword) {
      throw new Error("confirm Password doesn't match");
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      //user try to to signup when user already exist
      if (emailExist.verified) {
        throw new Error("Already a user please login !!");
      }
      //user exist but not verified but verified token still alive
      if (!emailExist.verified && emailExist.verifyTokenExpiry > Date.now()) {
        throw new Error("Please verify your email !!");
      }
      //user exist but verify token expired so i delete the user from db and procceed to add that user again
      if (!emailExist.verified && emailExist.verifyTokenExpiry < Date.now()) {
        await User.findOneAndDelete({ email });
        throw new Error("Email not verified on time please re-register");
      }
    }
    const name = await User.findOne({ username });
    if (name) {
      throw new Error("This username already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashPassword,
      verifyToken: generateVerificationToken(),
      verifyTokenExpiry: generateTokenExpiry(),
    });

    res.status(200).json({
      email,
      username: user.username,
      message: "Verification link send to your email please verify !!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
//searching all user execpt the requestion user
exports.search = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            username: { $regex: req.query.search, $option: "i" },
          },
          {
            email: { $regex: req.query.search, $option: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
};
exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
};
