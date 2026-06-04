import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";
import authRoute from './routes/AuthRoute.js';
import session from "express-session";
import passport from "passport";
import "./config/passport.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret:process.env.TOKEN_KEY,
        resave:false,
        saveUninitialized:false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin:true,
        
        credentials:true,
    })
);


app.use("/api",chatRoutes);
app.use("/",authRoute);


app.listen(PORT,async ()=> {
    console.log(`Listening on port ${PORT}`);
    await connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected with database");
    } catch(err) {
        console.log(err);
    }
}



