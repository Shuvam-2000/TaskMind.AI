import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';

// intialize the app
const app = express();

// load enviornment variables
configDotenv();

// initalize the PORT
const PORT = process.env.PORT || 8001;

// middlewares
app.use(express.json());   // Parse JSON request
app.use(express.urlencoded({ extended: true }))  // Parse URL-encoded request bodies
app.use(cookieParser());  // Enable Cookie parsing
app.use(cors())

// test route
app.get('/', (req,res) => {
    res.send('Hello Server Is Runing');
})

// start the server
app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`))