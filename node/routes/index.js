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
  wage: { type: Number },
  working: Boolean,
  totalPay: { type: Number },
  startTime: { type: Number }
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
//Code is from the following tutorial: Tutorial: Getting Started with Amazon AWS IoT, MQTT Protocol, and Node JS. Code source: https://medium.com/dev-jam/getting-started-with-aws-iot-core-and-mqtt-protocol-with-a-node-js-example-ed16bd542704
let device = awsIot.device({
  keyPath: './certificates/86289fca2101af52f1e066a37a13b0a8cfd8590ca1d68a3c46c86d008d130f6d-private.pem.key',
  certPath: './certificates/86289fca2101af52f1e066a37a13b0a8cfd8590ca1d68a3c46c86d008d130f6d-certificate.pem.crt',
  caPath: './certificates/AmazonRootCA1.pem',
  clientId: 'Liam',
  host: 'a3fozwp9y1aejf-ats.iot.us-east-1.amazonaws.com',
  debug: true
});

device
  .on('connect', function () {
    console.log("STEP - Connecting to AWS  IoT Core");
    console.log("---------------------------------------------------------------------------------")
    device.subscribe("TeamSwipe_ESP32/request-employee-array");
    device.subscribe("TeamSwipe_ESP32/clock-in");
    device.subscribe("TeamSwipe_ESP32/clock-out");
    device.subscribe("TeamSwipe_ESP32/request-employee-earned");
  });

device
  .on("message", function (topic, payload) {
    console.log('message', topic, payload.toString());

    if (topic === "TeamSwipe_ESP32/request-employee-array") {
      data = JSON.parse(payload);
      UserData.findOne({ "company": data.email }, function (err, doc) {
        sendData("TeamSwipe_ESP32/return-data", doc.employees)
      });
    }
    if (topic === "TeamSwipe_ESP32/clock-in") {
      const start = Date.now()
      data = JSON.parse(payload);
      UserData.findOneAndUpdate({ "company": data.email, "employees.name": data.name }, { $set: { "employees.$.working": true, "employees.$.startTime": start } }
        , function (err, docs) {
          if (err) {
            console.log(err)
          }
        });
    }

    if (topic === "TeamSwipe_ESP32/clock-out") {
      data = JSON.parse(payload);
      const stop = Date.now()
      UserData.findOne({ "company": data.email }, { "employees": { $elemMatch: { name: data.name } } }, function (err, doc) {
        var time = ((stop - doc.employees[0].startTime) / 1000)
        var payPerSec = (doc.employees[0].wage / 60) / 60
        var pay = time * payPerSec
        sendData("TeamSwipe_ESP32/return-employee-pay", { pay: pay, status: false })
        var updatePay = doc.employees[0].totalPay
        updatePay += pay
        UserData.findOneAndUpdate({ "company": data.email, "employees.name": data.name }, { $set: { "employees.$.totalPay": updatePay, "employees.$.working": false } }
          , function (err, docs) {
            if (err) {
              console.log(err)
            }
          });
      });
    }
    if (topic === "TeamSwipe_ESP32/request-employee-earned") {
      data = JSON.parse(payload);
      UserData.findOne({ "company": data.email }, { "employees": { $elemMatch: { name: data.name } } }, function (err, doc) {
        var total = doc.employees[0].totalPay
        sendData("TeamSwipe_ESP32/return-employee-earned", { totalPay: total })
      });
    }
  });

device
  .on("error", function (topic, payload) {
    console.log('Error:', topic, JSON.stringify(payload));
  });

function sendData(topicName, data) {
  console.log("Sending data to AWS  IoT Core: ")
  return device.publish(topicName, JSON.stringify(data))
}
// end of tutorial code
router.get('/', function (req, res, next) {
});

router.get('/get-data', authenticateToken, (req, res) => {
  UserData.findOne({ "company": req.email.email }, function (err, doc) {
    res.json(doc.employees);
  });
})

router.get('/get-presets', authenticateToken, (req, res) => {
  UserData.findOne({ "company": req.email.email }, function (err, doc) {
    res.json(doc.presets);
  });
})

router.post('/insert-employee', authenticateToken, (req, res, next) => {

  UserData.findOneAndUpdate({ "company": req.email.email }, {
    $push: {
      "employees": {
        name: req.body.name,
        age: req.body.age,
        role: req.body.role,
        ppsn: req.body.ppsn,
        wage: req.body.wage,
        working: false,
        startTime: 0,
        totalPay: 0.0
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

router.post('/update-employee', authenticateToken, (req, res, next) => {
  UserData.findOneAndUpdate({ "company": req.email.email, "employees._id": req.body.id }, { $set: { "employees.$.name": req.body.name, "employees.$.age": req.body.age, "employees.$.role": req.body.role, "employees.$.ppsn": req.body.ppsn, "employees.$.wage": req.body.wage } }
    , function (err, docs) {
      if (err) {
        console.log(err)
      }
    });
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