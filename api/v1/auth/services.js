const bcrypt = require("bcrypt");
const db = require("../../../config/dbConfig");
const validInfo = require("../../../middleware/validateInfo");
const jwtGenerator = require("../../../utils/jwtGenerator");
const authorize = require("../../../middleware/authorization");
const moment = require("moment")
const query = require('./queries')

