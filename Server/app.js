import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import './utils/connection.js'
import userRoute from './routes/user.routes.js'
import taskRoute from './routes/task.routes.js'
import aiRoute from './routes/ai.routes.js'

// intialize the app
const app = express();

// load enviornment variables
configDotenv();

// initalize the PORT
const PORT = process.env.PORT || 8001;

// middlewares
app.use(express.json());   // Parse JSON request
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded request bodies
app.use(cookieParser());  // Enable Cookie parsing
app.use(cors());

// test route
app.get('/', (req,res) => {
    res.send('Hello Server Is Runing');
})

// defining the routes for the application
app.use('/api/user', userRoute);  // user Route
app.use('/api/task', taskRoute);  // task Route
app.use('/api/ai', aiRoute)  // ai Route

// start the server
app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`))