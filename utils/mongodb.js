const mongoose = require('mongoose');
require('dotenv').config()


mongoose.Promise = global.Promise;

const connection = mongoose.connect(`${process.env.MONGODB}`);

connection
    .then(db => db)

module.exports = {connection};