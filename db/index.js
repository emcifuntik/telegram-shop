const mongoose = require('mongoose');
mongoose.Promise = Promise;
const config = require('../config.json');

let port = 27017;
if(config.mongodb.port !== undefined) {
  port = config.mongodb.port;
}
if(config.mongodb.user.length > 0 && config.mongodb.pass.length > 0) {
  mongoose.connect('mongodb://' + config.mongodb.user + ':' + config.mongodb.pass + '@' + config.mongodb.host + ':' + port + '/' + config.mongodb.collection, {
    useMongoClient: true
  });
}
else {
  mongoose.connect('mongodb://' + config.mongodb.host + ':' + port + '/' + config.mongodb.collection, {
    useMongoClient: true
  });
}

const user = require('./models/user.js')(mongoose);
const product = require('./models/product.js')(mongoose);
const category = require('./models/category.js')(mongoose);
const client = require('./models/client.js')(mongoose);
const basket = require('./models/basket.js')(mongoose);

module.exports = {
  user,
  product,
  category,
  client,
  basket,
  mongoose
};