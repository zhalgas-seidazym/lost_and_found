const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const passport = require('passport')
const bodyParser = require('body-parser')

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(passport.initialize())

require('./server/config/db.js')
require('./server/config/passport.js')

app.use(require('./server/routes/authorization.js'))
app.use(require('./server/routes/profile.js'))
app.use(require('./server/routes/category.js'))
app.use(require('./server/routes/lost.js'))
app.use(require('./server/routes/found.js'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})