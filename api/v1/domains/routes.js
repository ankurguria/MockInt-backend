const db = require('../../../config/dbConfig')
const express = require('express')
const router = express.Router()
const services = require('./services')

// @route  GET api/domains
// @route Get all domains
// @access public
router.get('/' ,services.getAllDomainsService);

// @route  POST api/domains
// @route Create domains
// @access public
router.post('/',services.createDomainService);


module.exports= router