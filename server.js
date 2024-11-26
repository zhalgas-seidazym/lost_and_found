const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const passport = require('passport')

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(passport.initialize())

require('./server/config/db.js')
require('./server/config/passport.js')

app.use(require('./server/routes/authorization.js'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})