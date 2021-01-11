const Pool= require("pg").Pool

module.exports = new Pool({
    user: "postgres",
    password: "8lkFaC7JG68PmEY4BSUv",
    host: "mock-interview.cbog7vkaucki.ap-south-1.rds.amazonaws.com",
    port: 5432,
    database: "mockdb"
})

