const express = require("express");
const router = express.Router();
const authorize = require("../../../middleware/authorization");
const controller = require("./controllers")

router.post('/book_now', authorize ,controller.slotBookingController);
// router.post('/searchforpeers',authorize, controller.searchForPeers);
router.post('/cancelinterview', authorize, controller.cancelSession);
router.post('/accept',authorize, controller.expertAcceptRequest);
router.post('/reject', authorize, controller.expertRejectRequest);
router.get('/allExpertData', authorize, controller.getExpertDataController);



module.exports = router;