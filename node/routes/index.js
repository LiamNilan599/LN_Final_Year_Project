//Code is from the following tutorial: Node.js + Express - Tutorial - Insert and Get Data with MongoDB. Code source: https://github.com/mschwarzmueller/nodejs-basics-tutorial
require('dotenv').config()
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
mongoose.connect('mongodb://127.0.0.1:27017/test');
router.use(express.json())

var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
  name: String,
  age: String,
  role: String,
  ppsn: String,
  wage: String
});

var UserSchema = new Schema({
  company: String,
  password: String,
  employees: [EmployeeSchema]
}, { collection: 'user-data', versionKey: false });

var UserData = mongoose.model('EmployeeData', UserSchema);

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/get-data', authenticateToken, (req, res) => {
  UserData.findOne({ "company": req.email.email }, function (err, doc) {
    res.json(doc.employees);
  });
})

router.post('/insert', function (req, res, next) {
  var item = {
    company: req.body.email,
    employees:
      [{
        name: req.body.name,
        age: req.body.age,
        role: req.body.role,
        ppsn: req.body.ppsn,
        wage: req.body.wage
      }]
  }


  var data = new UserData(item);
  data.save();

  res.redirect('/');
});

router.post('/register', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    var user = await UserData.findOne({ "company": req.body.email });
    console.log(user)
    if (user == null) {
      console.log("here top")
      var item = {
        company: req.body.email,
        password: hashedPassword,
        employees:
          [{
            name: req.body.name,
            age: req.body.age,
            role: req.body.role,
            ppsn: req.body.ppsn,
            wage: req.body.wage
          }]
      }
      var data = new UserData(item);
      data.save();

      res.redirect('/');
    }
    else {
      res.send('Username used')
    }
  }
  catch
  {
    console.log("here")
    res.status(500).send()
  }
});

router.post('/insert-employee', authenticateToken, (req, res, next) => {

  UserData.findOneAndUpdate({ "company": req.email.email }, {
    $push: {
      "employees": {
        name: req.body.name,
        age: req.body.age,
        role: req.body.role,
        ppsn: req.body.ppsn,
        wage: req.body.wage
      }
    }
  }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  });
  res.redirect('/');
});

router.post('/update', function (req, res, next) {
  var id = req.body.id;
  UserData.findById(id, function (err, doc) {
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

router.post('/update-employee', authenticateToken, (req, res, next) => {
  UserData.findOneAndUpdate({ "company": req.email.email, "employees._id": req.body.id }, { $set: { "employees.$.name": req.body.name, "employees.$.age": req.body.age, "employees.$.role": req.body.role, "employees.$.ppsn": req.body.ppsn, "employees.$.wage": req.body.wage } }
    , function (err, docs) {
      if (err) {
        console.log(err)
      }
    });
  res.redirect('/');
});

router.post('/delete', function (req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

router.post('/delete-employee', authenticateToken, (req, res, next) => {
  UserData.findOneAndUpdate({ "company": req.email.email }, { $pull: { "employees": { "_id": req.body.id } } }
    , function (err, docs) {
      if (err) {
        console.log(err)
      }
    });
  res.redirect('/');
});
//Code is from the following tutorial: JWT Authentication Tutorial - Node.js. Code source: https://github.com/WebDevSimplified/JWT-Authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, email) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.email = email
    next()
  })
}
module.exports = router;