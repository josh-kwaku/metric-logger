import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import apiV1 from "./v1";

const app = express();

// Middleware -
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('combined'));

// app.use(cors({
//     origin: process.env.NODE_ENV === 'development' ? process.env.FRONTEND_LOCAL_URL : process.env.FRONTEND_PRODUCTION_URL
// }));

app.get('/', (req, res) => {
    res.status(200).send("Metric Logger Application");
});

// routes
app.use('/api/v1', apiV1);

export default app;