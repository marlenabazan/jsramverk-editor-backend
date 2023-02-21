const express = require('express');
const router = express.Router();

const inviteModel = require("../models/invite");

router.post("/", async (req, res) => {
    const recipient = req.body.recipient;
    await inviteModel.send(req, res);

    return res.status(200).json({ message: `Invite sent to ${recipient}` });
});

module.exports = router;