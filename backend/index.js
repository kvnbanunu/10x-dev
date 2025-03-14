import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';

const app = express();
const db = new Storage('database.sqlite');
