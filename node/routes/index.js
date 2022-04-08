//Code is from the following tutorial: Node.js + Express - Tutorial - Insert and Get Data with MongoDB. Code source: https://github.com/mschwarzmueller/nodejs-basics-tutorial
require('dotenv').config()
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
mongoose.connect('mongodb://127.0.0.1:27017/test');
const cors = require('cors');
router.use(express.json())
router.use(cors());
var Schema = mongoose.Schema;
const awsIot = require('aws-iot-device-sdk');

var EmployeeSchema = new Schema({
  name: String,
  age: String,
  role: String,
  ppsn: String,
  wage: String
});
var PresetSchema = new Schema({
  role: String,
  wage: String
});

var UserSchema = new Schema({
  company: String,
  password: String,
  employees: [EmployeeSchema],
  presets: [PresetSchema]
}, { collection: 'user-data', versionKey: false });

var UserData = mongoose.model('EmployeeData', UserSchema);

let device = awsIot.device({
  keyPath: './certificates/86289fca2101af52f1e066a37a13b0a8cfd8590ca1d68a3c46c86d008d130f6d-private.pem.key',
  certPath: './certificates/86289fca2101af52f1e066a37a13b0a8cfd8590ca1d68a3c46c86d008d130f6d-certificate.pem.crt',
  caPath: './certificates/AmazonRootCA1.pem',
  clientId: 'Liam', // Your own device name . . . whatever you like
  host: 'a3fozwp9y1aejf-ats.iot.us-east-1.amazonaws.com', // your IOT setup
  debug: true
  // port: 8883
});

device
  .on('connect', function () {
    console.log("STEP - Connecting to AWS  IoT Core");
    console.log("---------------------------------------------------------------------------------")
    device.subscribe("TeamSwipe_ESP32/pub");
  });

device
  .on("message", function (topic, payload) {
    console.log('message', topic, payload.toString());
  });

device
  .on("error", function (topic, payload) {
    console.log('Error:', topic, JSON.stringify(payload));
  });



function sendData(topicName, data) {
  console.log("STEP - Sending data to AWS  IoT Core: " + JSON.stringify(data))
  console.log("---------------------------------------------------------------------------------")
  return device.publish(topicName, JSON.stringify(data)) //  "signInEtc" in the topic
}

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/get-data', authenticateToken, (req, res) => {
  UserData.findOne({ "company": req.email.email }, function (err, doc) {
    res.json(doc.employees);
    sendData("TeamSwipe_ESP32/sub", doc.employees)
  });
})

router.get('/get-presets', authenticateToken, (req, res) => {
  UserData.findOne({ "company": req.email.email }, function (err, doc) {
    res.json(doc.presets);
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

router.post('/insert-preset', authenticateToken, (req, res, next) => {

  UserData.findOneAndUpdate({ "company": req.email.email }, {
    $push: {
      "presets": {
        role: req.body.role,
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

router.post('/delete-preset', authenticateToken, (req, res, next) => {
  UserData.findOneAndUpdate({ "company": req.email.email }, { $pull: { "presets": { "_id": req.body.id } } }
    , function (err, docs) {
      if (err) {
        console.log(err)
      }
    });
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

router.post('/insert-preset', authenticateToken, (req, res, next) => {

  UserData.findOneAndUpdate({ "company": req.email.email }, {
    $push: {
      "presets": {
        role: req.body.role,
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

router.post('/delete-preset', authenticateToken, (req, res, next) => {
  UserData.findOneAndUpdate({ "company": req.email.email }, { $pull: { "presets": { "_id": req.body.id } } }
    , function (err, docs) {
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

router.post('/delete-account', authenticateToken, (req, res) => {

  UserData.findOne({ "company": req.email.email }, async (err, doc) => {
    try {
      if (await bcrypt.compare(req.body.password, doc.password)) {
        var id = doc._id;
        UserData.findByIdAndRemove(id).exec();
        res.status(200).send()
      }
      else {
        res.status(400).send('Not Allowed')
      }
    }
    catch
    {
      res.status(500).send()
    }
  });
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

router.post('/delete-account', authenticateToken, (req, res) => {

  UserData.findOne({ "company": req.email.email }, async (err, doc) => {
    try {
      if (await bcrypt.compare(req.body.password, doc.password)) {
        var id = doc._id;
        UserData.findByIdAndRemove(id).exec();
        res.status(200).send()
      }
      else {
        res.status(400).send('Not Allowed')
      }
    }
    catch
    {
      res.status(500).send()
    }
  });
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