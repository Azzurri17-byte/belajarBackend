const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const bookRouter = require('./routes/book')
const port = 3000

app.use(bodyParser.json())
app.use('/auth', authRouter)
app.use('/book', bookRouter)

app.listen(port, () => {
    console.log(`listen in ${port}`)
})