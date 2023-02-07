const express = require('express');
const router = express.Router();

const docsModel = require("../models/documents");
const authModel = require("../models/auth");

router.get("/",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
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

router.put("/", async (req, res) => {
    const docToUpdateId = req.body._id;
    const newText = req.body.text;
    // console.log(req.body.text);
    const result = await docsModel.updateDoc(docToUpdateId, newText);

    return res.status(201).json({ data: result });
});

router.delete("/", async (req, res) => {
    const result = await docsModel.removeDocs();

    return res.status(204).json();
    }
)

router.get("/:id", async (req, res) => {
    const docToGet = req.params.id;
    const oneDocument =  await docsModel.getOneDocument(docToGet);

    return res.json({
        data: oneDocument
    });
});

module.exports = router;