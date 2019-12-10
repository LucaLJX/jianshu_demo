const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, function (err, db) {
  if (err) {
    throw err
  }
  console.log('已连接');

  let testDB = db.db('testdb');
  console.log(testDB);

  testDB.collection('ceshi').find().toArray(function (err, res) {
    if (err) {
      throw err
    }
    console.log(res);
  });
});