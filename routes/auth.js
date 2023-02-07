const express = require('express');
const router = express.Router();

const authModel = require("../models/auth");

router.post("/register", async (req, res) => {
    const body = req.body;
    await authModel.register(res, body);

    // return res.status(201).json({ data: result });
});

router.post("/login", async (req, res) => {
    const body = req.body;
    await authModel.login(res, body);

    // return res.status(201).json({ data: result });
});


module.exports = router;