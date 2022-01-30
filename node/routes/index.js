 //Code is from the following tutorial: Node.js + Express - Tutorial - Insert and Get Data with MongoDB. Code source: https://github.com/mschwarzmueller/nodejs-basics-tutorial
var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find({}).toArray(function (err, result) {
      if (err) throw err;
      res.json(result)});
    });
  //   cursor.forEach(function(doc, err) {
  //     assert.equal(null, err);
  //     resultArray.push(doc);
  //   }, function() {
  //     db.close();
  //     res.render('index', {items: resultArray});
  //   });
  // });
});

router.post('/insert', function(req, res, next) {
  // var item = {
  //   title: req.body.title,
  //   content: req.body.content,
  //   author: req.body.author
  // };
  var item = {
    name: req.body.name,
    age: req.body.age,
    role: req.body.role,
    ppsn: req.body.ppsn,
    wage: req.body.wage
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  // var item = {
  //   title: req.body.title,
  //   content: req.body.content,
  //   author: req.body.author
  // };
  var item = {
    name: req.body.name,
    age: req.body.age,
    role: req.body.role,
    ppsn: req.body.ppsn,
    wage: req.body.wage
  };
  var id = req.body.id;
  console.log(req.body);
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;