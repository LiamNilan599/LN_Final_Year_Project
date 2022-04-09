//Code is from the following tutorial: JWT Authentication Tutorial - Node.js. Code source: https://github.com/WebDevSimplified/JWT-Authentication
require('dotenv').config()
const cors = require('cors');
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
mongoose.connect('mongodb://127.0.0.1:27017/test');
app.use(cors());
var Schema = mongoose.Schema;

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

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, email) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: email.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', async (req, res) => {
  // Authenticate email
  var company = await UserData.findOne({ "company": req.body.email });
  if (company == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, company.password)) {
      const email = req.body.email
      const user = { email: email }

      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
      refreshTokens.push(refreshToken)
      res.json({ accessToken: accessToken, refreshToken: refreshToken })

    }
    else {
      res.status(400).send('Not Allowed')
    }
  }
  catch
  {
    res.status(500).send()
  }
})

app.post('/register', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    var user = await UserData.findOne({ "company": req.body.email });
    if (user == null) {
      var item = {
        company: req.body.email,
        password: hashedPassword,
        employees:
          [{
            name: req.body.name,
            age: req.body.age,
            role: req.body.role,
            ppsn: req.body.ppsn,
            wage: req.body.wage,
            working: false,
            startTime: 0,
            totalPay: 0.0
          }]
      }
      var data = new UserData(item);
      data.save()
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
      refreshTokens.push(refreshToken)
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }
    else {
      res.send('Username used')
    }
  }
  catch
  {
    res.status(500).send()
  }
});

function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN, { expiresIn: '15m' })
}

app.listen(4000)