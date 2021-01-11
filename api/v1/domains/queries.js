const db = require('../../../config/dbConfig');

let getAllDomains = async () => {
    let op = await db.query('select * from domain;');
    return op;
}

module.exports.getAllDomains = getAllDomains;

let createDomain = async (domain) => {
    let op = await db.query("insert into domain(domain_name) values($1) returning *;",[domain]);
    return op;
}

module.exports.createDomain = createDomain;