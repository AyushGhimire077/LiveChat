import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import cookieParser from 'cookie-parser'
//file import
import connectDB from './config/connectDB.js'
import socketService from './config/socket.js'
import authRouter from './routes/authRoute.js'
import messageRouter from './routes/messageRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()
const server = http.createServer(app)   

//Connect to DB
connectDB();

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
socketService.initialize(server);


//Routes
app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)
app.use('/api', userRouter )
//Get port 
const port = process.env.PORT || 5000 


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
