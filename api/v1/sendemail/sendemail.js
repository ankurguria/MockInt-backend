const nodemailer = require('nodemailer');
require("dotenv").config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mockinterviewplatform@gmail.com',
    pass: 'helloworld1!'
  }
});

console.log(process.env.emailpwd);

const mailOptions = {
  from: 'mockinterviewplatform@gmail.com'
};

module.exports.transporter = transporter;
module.exports.mailOptions = mailOptions;

