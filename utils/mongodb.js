const mongoose = require('mongoose');
require('dotenv').config()


mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);

connection
    .then(db => db)
    .catch(err => {
        console.log(err);
    });

module.exports = {connection};