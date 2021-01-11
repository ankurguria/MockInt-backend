const getAllDomains = require('./queries').getAllDomains
const createDomain = require('./queries').createDomain
const db = require('../../../config/dbConfig')


let getAllDomainsController = async() => {
    try{
        let op = await getAllDomains();
        console.log(op.rows);
        return {"status": 200, 'domains': op.rows};
    }catch(e){
        console.log('server error', e);
        return {"status": 500, "error": "server error"};
    }
}

module.exports.getAllDomainsController = getAllDomainsController;

let createDomainController = async(domain) => {
    try{
        let op = await createDomain(domain);
        return {"status": 200, "domains": domain};
    }catch(e){
        console.log("server error", e);
        return {"status": 500, 'error':"server error"};
    }
}

module.exports.createDomainController = createDomainController;