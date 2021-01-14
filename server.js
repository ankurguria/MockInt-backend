"use strict";
const express = require("express");
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;
const connectDatabase = require("./db/index")
const moment = require("moment");

app.use(cors());
app.use(express.json({extended: false}));


let init = async () => {
  await connectDatabase();
  app.listen(port, () => {
	  console.log(`node server running on port ${port}`);
	});
}

init();
app.get('/', (req, res) => res.json({'sayHello':moment().format()}))
app.use('/api/domains',require('./api/v1/domains/routes'))
app.use('/api/auth', require('./api/v1/auth/routes'))
app.use('/api', require('./api/v1/dashboard/routes'));
app.use('/api/slotbooking',require('./api/v1/slotBooking/routes'));
app.use('/api/feedback',require('./api/v1/feedback/routes'));