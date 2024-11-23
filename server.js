const express = require('express')
const cors = require('cors')
const logger = require('morgan')

const app = express()

require('./server/config/db.js')

app.use(logger('dev'))
app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.use(require('./server/routes/authorization.js'))
app.use(require('./server/routes/search.js'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})