const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://elgatobarista:CONTRASEÑA@rolgamesandstone.tqgnl5u.mongodb.net/?retryWrites=true&w=majority&appName=RolgameSandstone'
  )
    .then(client => {
      console.log('Connected!');
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = mongoConnect;
