const fs = require('fs')
const path = require('path')

const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const time = new Date().toLocaleString()
        const duration = Date.now() - start
        const log = `[${time}] ${req.method} ${req.url} (${duration}ms)\n`
        //output console
        console.log(log)
        //simpan ke file log
        const logPath = path.join(__dirname, "../logs/request.log")
        fs.appendFile(logPath, log, (err) => {
            if (err) console.log("gagal menulis log: ", err)
        })
    })



    next()
}

module.exports = logger