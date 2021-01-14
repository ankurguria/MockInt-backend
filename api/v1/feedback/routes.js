const express = require("express");
const router = express.Router();
const authorize = require("../../../middleware/authorization");
const controller = require("./controllers")


router.post('/giveFeedback', authorize, controller.giveFeedback);
router.get('/viewFeedback', authorize, controller.viewFeedback);


module.exports = router;