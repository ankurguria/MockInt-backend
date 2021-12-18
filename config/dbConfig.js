const Pool= require("pg").Pool

module.exports = new Pool({
    user: "wangjblhlglyvi",
    password: "7156d718a43cbb5f550c5f9861f2c0fdb40df43208efe68e1d0f849aea039942",
    host: "ec2-34-255-134-200.eu-west-1.compute.amazonaws.com",
    port: 5432,
    database: "dffi7ok6hrhu6b"
})

