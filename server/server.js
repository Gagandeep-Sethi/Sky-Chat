const express = require("express");
const authRouter = require("./routes/authRoute");
const messageRouter = require("./routes/messageRoute");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const googleRouter = require("./routes/googleRoute");
require("dotenv").config();
const app = express();
//require for json conversion of content in body
app.use(express.json());
//required for cookie management
app.use(cookieParser());
const passport = require("passport");
require("./config/passport");
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
app.use("/api", authRouter);
app.use("/auth/google", googleRouter);
app.use("/api/message", messageRouter);

app.listen(process.env.PORT, () =>
  console.log("server listening at port 5000")
);
