const { sendEmail } = require("../helpers/email");
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
    //if username is not unique throw an error
    const name = await User.findOne({ username });
    if (name) {
      throw new Error("This username already exists");
    }
    //encrpt. password usinf bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashPassword,
      verifyToken: generateVerificationToken(),
      verifyTokenExpiry: generateTokenExpiry(),
    });
    //sending verification link to email
    sendEmail(
      user.email,
      "Email Verification",
      `Click the following link to verify your email: ${process.env.DOMAIN}/verify?token=${user.verifyToken}`,
      `<p>Click the following link to verify your email: <a href="${process.env.DOMAIN}/api/users/verify?token=${user.verifyToken}&action=verify-email">Verify Email</a></p>`
    );

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

exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;
    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("All fields must be filed");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("password not strong");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Confirm password doesn't match");
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found please try again" });
    }
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password doesn't match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated please login" });
  } catch (error) {
    console.log(error, "sigup error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("No user found with this email !!");
    }
    if (!user.verified) {
      throw new Error("User not verified !!");
    }
    // if (user.googleId) {
    //   throw new Error(
    //     "You have signed in using google please login using your google account !!"
    //   );
    // }
    user.forgotPasswordToken = generateVerificationToken();
    user.forgotPasswordTokenExpiry = generateTokenExpiry();
    await user.save();
    sendEmail(
      user.email,
      "Reset Password",
      `Click the following link to reset your password: ${process.env.DOMAIN}/verify?token=${user.forgotPasswordToken}`,
      `<p>Click the following link to verify your email: <a href="${process.env.DOMAIN}/api/users/verify?token=${user.forgotPasswordToken}&action=reset-password">Verify Email</a></p>`
    );

    return NextResponse.json(
      { message: "Reset password link sent to your email please checkout" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "sigup error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
exports.verifyEmail = async (req, res) => {
  const token = req.query.token;
  const action = req.query.action;

  try {
    //if verification is for signup
    if (action === "verify-email") {
      // find user using verification token
      const user = await User.findOne({ verifyToken: token });

      if (!user || user.verifyTokenExpiry < Date.now()) {
        // Token is invalid or expired
        return res.status(400).json({
          message: "Invalid or expired token please try to signup again",
        });
      }

      // Mark user as verified
      user.verified = true;
      user.verifyToken = null;
      user.verifyTokenExpiry = null;
      await user.save();

      // Redirect to a verification success page
      return res.redirect(`${process.env.DOMAIN}/user/verified`);
    }

    //if the verification is for forgot password
    if (action === "reset-password") {
      // find user using verification token
      const user = await User.findOne({ forgotPasswordToken: token });

      if (!user || user.forgotPasswordTokenExpiry < Date.now()) {
        // Token is invalid or expired
        return res.status(400).json({
          message:
            "Invalid or expired token please try to reset password again",
        });
      }

      return res.redirect(
        `${process.env.DOMAIN}/user/resetPassword?email=${encodeURIComponent(
          user.email
        )}&token=${encodeURIComponent(token)}`
      );
    }
    return res
      .status(400)
      .json({ message: "Something went wrong Please try again !!" });
  } catch (error) {
    return res.status(400).json({ message: "Error verifying user" });
  }
};
