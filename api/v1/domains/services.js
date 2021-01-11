const getAllDomainsController = require('./controllers').getAllDomainsController
const createDomainController = require('./controllers').createDomainController

let getAllDomainsService = async (req, res) => {
    let op = await getAllDomainsController()
    
    if(op.status === 500) res.status(500).send(op.error)
    else if(op.status === 200) res.status(200).send(op.domains)
}

module.exports.getAllDomainsService = getAllDomainsService;

let createDomainService = async (req,res) => {
    const{domain} = req.body;
    let op = await createDomainController(domain);
    if(op.status === 500) res.status(500).send({"error": op.error})
    else if(op.status === 200) res.status(200).send({"domain_name": op.domains})
}

module.exports.createDomainService = createDomainService;