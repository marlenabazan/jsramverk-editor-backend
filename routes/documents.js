const express = require('express');
const router = express.Router();

const docsModel = require("../models/documents");

router.get("/documents", async (req, res) => {
    const docs =  await docsModel.getAllDocuments();

    return res.json({
        data: documents
    });
});

module.exports = router;