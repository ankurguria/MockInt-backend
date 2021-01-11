const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../../config/dbConfig");
const validInfo = require("../../../middleware/validateInfo");
const jwtGenerator = require("../../../utils/jwtGenerator");
const authorize = require("../../../middleware/authorization");
const controller = require("./controllers")
const { validationResult, check} = require('express-validator');
//authentication

router.post("/register",[
    check('email','Invalid Email').normalizeEmail().isEmail(),
    check('password', 'password not strong enough').isStrongPassword(),
    check('first_name', "this is required").exists(),
    check('last_name', "this is required").exists(),
    check('ph_no',"invalid mobile number").isMobilePhone()
  ]
,controller.signupController);

router.post("/login", [
  check('email', "Enter valid Email").normalizeEmail().isEmail()
], controller.signinController);

router.post('/expert_profile_creation', authorize, [

], controller.expertProfileCreationController

)

router.post('/peer_profile_creation', authorize, [

], controller.peerProfileCreationController

)

router.get("/verify", authorize, controller.verifyUserController);

module.exports = router;