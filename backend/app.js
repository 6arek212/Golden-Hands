const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')



const appointmentsRouter = require('./routes/appointments')
const usersRoutes = require('./routes/users')
const citiesRoutes = require('./routes/cities')
const authRoutes = require('./routes/auth')
const workersRoutes = require('./routes/workers')

const app = express()
// moment.locale('Asia/Hebron')


mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to the DB');
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



app.use('/api/appointments' , appointmentsRouter)
app.use('/api/cities', citiesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api', authRoutes)
app.use('/api/workers', workersRoutes)







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
