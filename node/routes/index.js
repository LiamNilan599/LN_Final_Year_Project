//Code is from the following tutorial: Node.js + Express - Tutorial - Insert and Get Data with MongoDB. Code source: https://github.com/mschwarzmueller/nodejs-basics-tutorial
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
  name: String,
  age: Number,
  role: String,
  ppsn: String,
  wage: Number
}, { collection: 'user-data' });

var EmployeeData = mongoose.model('EmployeeData', EmployeeSchema);

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/get-data', function (req, res, next) {
  EmployeeData.find().lean().exec(function (err, doc) {
    res.json(doc);
  });
});

router.post('/insert', function (req, res, next) {
  var item = {
    name: req.body.name,
    age: req.body.age,
    role: req.body.role,
    ppsn: req.body.ppsn,
    wage: req.body.wage
  };

  var data = new EmployeeData(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function (req, res, next) {
  var id = req.body.id;
  EmployeeData.findById(id, function (err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.name = req.body.name
    doc.age = req.body.age
    doc.role = req.body.role
    doc.ppsn = req.body.ppsn
    doc.wage = req.body.wage
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function (req, res, next) {
  var id = req.body.id;
  EmployeeData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;