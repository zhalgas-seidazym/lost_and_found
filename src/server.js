const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const config = require('./config/config')
const {connectToDB} = require('./config/db');
const globalRouters = require('./api/routers/global-routers');

connectToDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.static(config.baseDir + '/public'));
app.use(logger('dev'));

app.use('/api', globalRouters);

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`)
})