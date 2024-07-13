// const express = require("express");
// const authRouter = require("./routes/authRoute");
// const messageRouter = require("./routes/messageRoute");
// const groupRouter = require("./routes/groupRoute");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const userRouter = require("./routes/userRoute");
// const fileUpload = require("express-fileupload");
// const cors = require("cors");
// const { app, server } = require("./socket/socket");
// require("dotenv").config();
// //const app = express();

// // Require for JSON conversion of content in body
// app.use(express.json());
// // Required for cookie management
// app.use(cookieParser());

// // Required to handle file upload and remove the need to convert image to buffer manually
// app.use(fileUpload());

// // const whitelist = ["http://localhost:3000"];
// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     if (whitelist.indexOf(origin) !== -1 || !origin) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true, // Helps to set credentials cookie mainly
// // };
// // app.use(cors(corsOptions));
// const corsOptions = {
//   origin: "https://sky-chat-chi.vercel.app", // Allow all origins
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these HTTP methods
//   preflightContinue: true,
//   allowedHeaders:
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization", // Allow these headers
//   credentials: true, // Allow cookies to be sent
// };
// app.use(cors(corsOptions)); // Enable CORS with options

// mongoose.connect(process.env.MONGODB_URI);

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });
// app.get("/", (req, res) => {
//   res.send("hi");
// });

// // app.use((req, res, next) => {
// //   res.header("Access-Control-Allow-Origin", "https://sky-chat-chi.vercel.app");
// //   res.header("Access-Control-Allow-Credentials", "true");
// //   res.header("preflightContinue", "true");
// //   res.header(
// //     "Access-Control-Allow-Methods",
// //     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
// //   );
// //   res.header(
// //     "Access-Control-Allow-Headers",
// //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
// //   );
// //   next();
// // });

// app.use("/api/auth", authRouter);
// app.use("/api/message", messageRouter);
// app.use("/api/group", groupRouter);
// app.use("/api/user", userRouter);

// server.listen(process.env.PORT, () =>
//   console.log(`server listening at port ${process.env.PORT}`)
// );
const express = require("express");
const authRouter = require("./routes/authRoute");
const messageRouter = require("./routes/messageRoute");
const groupRouter = require("./routes/groupRoute");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { app, server } = require("./socket/socket");
require("dotenv").config();

// Configure CORS options
const corsOptions = {
  origin: "https://sky-chat-chi.vercel.app", //  client domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  preflightContinue: true,
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization", // Allowed headers
  credentials: true, // Allow cookies to be sent
};

// Use CORS middleware
app.use(cors(corsOptions));

// Require for JSON conversion of content in body
app.use(express.json());

// Required to handle file upload and remove the need to convert image to buffer manually
app.use(fileUpload());

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/group", groupRouter);
app.use("/api/user", userRouter);

server.listen(process.env.PORT, () =>
  console.log(`Server listening at port ${process.env.PORT}`)
);
//origin: "http://localhost:3000",
