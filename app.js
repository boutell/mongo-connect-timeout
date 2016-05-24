// Simple test case for issue where simple connections with the
// mongodb 2.1.19 driver time out after a very short period and
// don't automatically reconnect or generate an error, they just
// hang forever on new queries. tom@punkave.com

var mongo = require('mongodb');

var db;
var things;

mongo.MongoClient.connect('mongodb://localhost:27017/test', function(err, _db) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  db = _db;
  things = db.collection('things');
  console.log('connected');
  firstQuery();
});


function firstQuery() {
  return things.findOne({ who: 'cares' }, function(err, result) {
    if (err) {
      console.error('first query error: ', err);
      process.exit(1);
    }
    console.log('first query complete');
    setTimeout(secondQuery, 6 * 60 * 1000);
  });
}

function secondQuery() {

  setInterval(function() {
    console.log('secondQuery still stumbling along!');
  }, 30000);

  return things.findOne({ who: 'cares' }, function(err, result) {
    if (err) {
      console.error('second query error: ', err);
      process.exit(1);
    }
    console.error('no error from second query. Done.\n');
    process.exit(0);
  });

}

