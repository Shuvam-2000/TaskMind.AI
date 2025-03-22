import mongoose from "mongoose";
import { configDotenv } from 'dotenv';

// LOad environment variables
configDotenv();

// initialize db connection with enviorment variables
const mongo_url = process.env.MONGO_URL 

// connecting to the database
mongoose.connect(mongo_url)
.then(() => console.log("MongoDB Connected")).catch((err) => {
    console.log("Connection Failed", err)
})


