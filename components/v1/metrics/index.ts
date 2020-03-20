import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Metric route");
})

router.post('/:key', (req, res) => {
    res.status(200).send(req.params.key);
})

router.get('/:key/sum', (req, res) => {
    res.status(200).send({sum: 0});
})

export default router;