const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express')
const path = require('path');
const fs = require('fs');

const config = require('./config/config')
const {connectToDB} = require('./config/db');
const globalRouters = require('./api/routers/global-routers');
const swaggerJsonPath = path.resolve('swagger_output.json');
const swaggerFile = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));

connectToDB();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.static(config.baseDir + '/public'));
app.use(logger('dev'));

app.use('/api', globalRouters);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`)
})