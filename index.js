import express from "express";
import { connectDB } from './database/db.js'
import dotenv from 'dotenv';
import Router from "./routes/routes.js";
import cors from 'cors';
// import bodyParser from 'body-parser';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();




app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))

app.use('/uploads', express.static(__dirname + '/uploads'));

// app.use(bodyParser.json({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', Router);

app.use((err, req, res, next) => {
    // Log the error and stack trace using Morgan
    if (err) {
        morgan.token('stack', (req, res) => (err.stack || ''));
    }
    next(err);
});




const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

connectDB(process.env.MONGO_URI);