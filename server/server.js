const express= require ("express")
const userRouter=require('./routes/userRoute')
const mongoose= require("mongoose")
require("dotenv").config()
const app=express()
app.use(express.json())
mongoose.connect(process.env.MONGO_DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
})
app.use('/api/user',userRouter)
app.listen(process.env.PORT,()=>console.log("server listening at port 5000"))

