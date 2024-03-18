const express= require ("express")
const userRouter=require('./routes/userRoute')
const mongoose= require("mongoose")

const googleRouter = require('./routes/googleRoute')
require("dotenv").config()
const app=express()


app.use(express.json())

const passport = require('passport');
require('./config/passport');
mongoose.connect(process.env.MONGO_DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
})
app.use('/api/user',userRouter)
app.use('/auth/google', googleRouter);

app.listen(process.env.PORT,()=>console.log("server listening at port 5000"))

