const express = require("express");
const authRouter = require("./routes/authRoute");
const messageRouter = require("./routes/messageRoute");
const groupRouter = require("./routes/groupRoute");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const googleRouter = require("./routes/googleRoute");
const userRouter = require("./routes/userRoute");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const app = express();
//require for json conversion of content in body
app.use(express.json());
//required for cookie management
app.use(cookieParser());

//required to handle file upload and remove the need to convert image to buffer manually
app.use(fileUpload());
const passport = require("passport");
require("./config/passport");
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
app.use("/api/auth", authRouter);
app.use("/auth/google", googleRouter);
app.use("/api/message", messageRouter);
app.use("/api/group", groupRouter);
app.use("/api/user", userRouter);

app.listen(process.env.PORT, () =>
  console.log("server listening at port 5000")
);
