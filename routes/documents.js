const express = require('express');
const router = express.Router();

const docsModel = require("../models/documents");

router.get("/", async (req, res) => {
    const docs =  await docsModel.getAllDocuments();

    return res.json({
        data: docs
    });
});

router.post("/", async (req, res) => {
    const newDoc = req.body;
    const result = await docsModel.insertDoc(newDoc);

    return res.status(201).json({ data: result });
});

module.exports = router;