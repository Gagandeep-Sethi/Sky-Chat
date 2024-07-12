// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const generateJwtToken = (_id, res) => {
//   const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "15d" });
//   res.cookie("jwt", token, {
//     httpOnly: true,
//     maxAge: 15 * 24 * 60 * 60 * 1000,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });
// };

// const generateVerificationToken = () => {
//   return crypto.randomBytes(20).toString("hex");
// };
// //creating expiration for token
// const generateTokenExpiry = () => {
//   return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
// };
// module.exports = {
//   generateJwtToken,
//   generateTokenExpiry,
//   generateVerificationToken,
// };
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateJwtToken = (_id, res) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "15d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "none", // 'none' for cross-domain cookies
    secure: true, // ensure this is true if your site is HTTPS
    path: "/",
    domain: "https://sky-chat-chi.vercel.app",
  });
};

const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const generateTokenExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
};

module.exports = {
  generateJwtToken,
  generateTokenExpiry,
  generateVerificationToken,
};
