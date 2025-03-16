import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
// database
// middleware
// handlers

dotenv.config();

// TODO await initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: ['https://kvnbanunu.github.io', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// TODO app.use(reqLogger);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
