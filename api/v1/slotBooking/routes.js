const express = require("express");
const router = express.Router();
const authorize = require("../../../middleware/authorization");
const controller = require("./controllers")

router.post('/book_now', authorize ,controller.slotBookingController);
// router.post('/searchforpeers',authorize, controller.searchForPeers);
router.post('/cancelinterview', authorize, controller.cancelSession);



module.exports = router;