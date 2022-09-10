var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const data = {
        msg: "Documents API"
    };

    res.json(data);
});

module.exports = router;