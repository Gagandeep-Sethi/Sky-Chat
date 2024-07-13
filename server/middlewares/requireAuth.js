const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying token
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded._id).select("-password"); // Extracting _id part from the token which was encoded in it
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attaching user property to req and passing it on to next middleware of main function
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ message: "Request not authorized" });
  }
};

module.exports = requireAuth;

//for cookies auth

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const requireAuth = async (req, res, next) => {
//   try {
//     //const token = req.cookies.jwt; //getting a cookie from req name jwt
//     const token = req.cookies.jwt; //for production
//     console.log(token, "cookie in req auth");
//     if (!token) {
//       return res.status(401).json({ message: "unauthorised token not found" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifying token
//     if (!decoded) {
//       return res.status(401).json({ message: "unauthorised invalid token" });
//     }

//     const user = await User.findById(decoded._id).select("-password"); //extracting _id part from the token which was encoded in it
//     if (!user) {
//       return res.status(401).json({ message: "user not found" });
//     }
//     req.user = user; //we are attaching user property to req and passing it on to next middleware of main function and we can use that tha user property as we know now the user is authenticated
//     next();
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ message: "unauthorised invalid token" });
//     }
//     res.status(500).json({ message: "Request not authorized" });
//   }
// };

// module.exports = requireAuth;
