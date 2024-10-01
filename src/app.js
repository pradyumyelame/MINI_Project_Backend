import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from "cors"

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


// routes import..

import  userRouter from './routes/user.routes.js';


// routes declaration
app.use("/api/v1/user", userRouter)


// routes
// import userRoute from "./routes/userRoute.js"
// app.use("/api/v1/user", userRoute)

// import authorityRoute from "./routes/authorityRoute.js"
// app.use("/api/v1/authority", authorityRoute)

// // middleware
// import errorMiddleware from './middlewares/errorMiddleware.js';
// app.use(errorMiddleware);

export default app
