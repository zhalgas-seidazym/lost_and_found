const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://zhalgasseidazym2005:NXzIpHAJ8Fp7od7U@kinopoisk-app.95x5lts.mongodb.net/lostandfound')
.then(() => console.log('Connected to MongoDB'))
.catch((e) => console.log('Failed to connect to MongoDB'))

// zhalgasseidazym2005
// NXzIpHAJ8Fp7od7U
// 'mongodb+srv://zhalgasseidazym2005:NXzIpHAJ8Fp7od7U@kinopoisk-app.95x5lts.mongodb.net/'
// https://cloud.mongodb.com/v2/66ad43c4a4ad243040da522b#/security/network/accessList  mongodb atlass