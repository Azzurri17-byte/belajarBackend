const mysql = require('mysql2')

const db = mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "", 
    database: "cuyuniversity"
})

module.exports = db

/* 
halo ini saya raihan saya disini hanya ingin mengetik sebuah kalimat, 
daripada daya mmenggunakan lorom ipsum saya hanya ingin memberika sepatah kalimat, 
jangan patah semangat dan terus berjuang okeee
*/