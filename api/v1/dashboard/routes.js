const express = require("express");
const router = express.Router();
const authorize = require("../../../middleware/authorization");
const controller = require("./controllers")

router.get('/dashboard', authorize ,controller.userDashboardController);



module.exports = router;