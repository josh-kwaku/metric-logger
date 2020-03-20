import express from "express";
import metrics from "./metrics";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Welcome to version one");
})

router.use('/metric', metrics);

export default router;