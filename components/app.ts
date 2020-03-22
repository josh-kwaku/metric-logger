import express from "express";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import * as path from "path";
import * as fs from "fs";
import bodyParser from "body-parser";
import apiV1 from "./v1";

const app = express();

// Middleware -
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let logDirectory = path.join(process.cwd(), 'httplogs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
let logStream = rfs.createStream('requests.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

app.use(morgan('combined', {stream: logStream}));

app.get('/', (req, res) => {
    res.status(200).send("Metric Logger Application");
});

// routes
app.use('/api/v1', apiV1);

export default app;