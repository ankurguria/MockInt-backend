const bcrypt = require("bcrypt");
const jwtGenerator = require("../../../utils/jwtGenerator");
const moment = require("moment")
const query = require('./queries')
const { validationResult, check} = require('express-validator');
const {transporter, mailOptions} = require('../sendemail/sendemail');

// = { email, first_name, last_name, ph_no, education,created_at, is_peer, country, time_zone, is_admin, is_expert, is_active, last_login, is_reported, signup_type, password } = 


let signupController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json(errors.array());
    }
    let data = req.body;
    console.log(data);
    //this part has to be changed after frontend is done
    data.created_at = moment().format();
    data.time_zone = data.created_at;
    data.last_login = null;
    // till here
    try {
      const user = await query.checkUserExist(data.email);
      if (user.rows.length > 0) {
        return res.status(401).json({"error":"User already exist!"});
      }
  
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(data.password, salt);
      data.password = bcryptPassword;
      let newUser = await query.createUser(data);
  
      const jwtToken = jwtGenerator(newUser.rows[0].user_id);

      mailOptions.to = data.email;
      mailOptions.subject = "Welcome to MIP";
      mailOptions.text = "You have been succesfully registered to the Mock Interview Platform";

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.status(200).send({
        "token": jwtToken, 
        "is_expert": newUser.rows[0].is_expert,
      });
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }


module.exports.signupController = signupController


let signinController = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json(errors.array());
    }

  
    try {
      const user = await query.checkUserExist(email)
    //   console.log(user.rows[0].password);
      if (user.rows.length === 0) {
        return res.status(401).json("This Email doesn't exist");
      }
  
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
  
      if (!validPassword) {
        return res.status(401).json("Invalid Password");
      }
      const jwtToken = jwtGenerator(user.rows[0].user_id);
      
      return res.json({"is_expert":user.rows[0].is_expert, "token":jwtToken});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  module.exports.signinController = signinController

  let verifyUserController = async (req, res) => {
    try {
      res.json({
        'status':true,
        "user_id" : req.user.id
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  let expertProfileCreationController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json(errors.array());
    }
    let data = req.body;
    data.user_id = req.user.id;
    try{
      let expertProfile = await query.createExpertProfile(data);
      console.log(expertProfile.rows[0]);
      return res.status(200).send("expert profile creation successfull");
    }catch(err){
      console.log(err.message);
      return res.status(500).send("server error");
    }
  }
  let peerProfileCreationController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json(errors.array());
    }
    let data = req.body;
    data.user_id = req.user.id;
    try{
      let peerProfile = await query.createPeerProfile(data);
      console.log(peerProfile.rows[0]);
      return res.status(200).send("peer profile creation successfull");
    }catch(err){
      console.log(err.message);
      return res.status(500).send("server error");
    }
  }
  module.exports.peerProfileCreationController = peerProfileCreationController;
  module.exports.expertProfileCreationController = expertProfileCreationController;
  module.exports.verifyUserController = verifyUserController;