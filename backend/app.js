const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const swaggerUI = require('swagger-ui-express');
const path = require("path")
const docs = require('./docs');

const appointmentReminder = require('./utils/appointment-reminder')

const appointmentsRouter = require('./routes/appointments')
const usersRoutes = require('./routes/users')
const citiesRoutes = require('./routes/cities')
const authRoutes = require('./routes/auth')
const workersRoutes = require('./routes/workers')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
// moment.locale('Asia/Hebron')


mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to the DB');
    appointmentReminder.start()
  })
  .catch(err => {
    console.log('Connection to DataBase failed', err);

  })

mongoose.set('debug', true);
mongoose.set('debug', function (coll, method, query, doc, options) {
  console.log(coll, method);
});


app.use(cors())

// app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())



const imgsPath = path.join(__dirname, 'imgs')
app.use('/imgs', express.static(imgsPath));




app.use('/api/appointments', appointmentsRouter)
app.use('/api/cities', citiesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api', authRoutes)
app.use('/api/workers', workersRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));



const htmlPath = path.join(__dirname, 'html')
app.use(express.static(htmlPath));

app.use('/', (req, res, next) => {
  res.sendFile(htmlPath + '/index.html')
})



//handling errors
app.use((req, res, next) => {
  console.log('error')
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});


//handling all errors
app.use((error, req, res, next) => {
  console.log(req.path, error.message)
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});



module.exports = app
