// Import Statements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userRoutes = require('./routes/user-routes');
const adminRoutes = require('./routes/admin-routes');
const HttpError = require('./utils/http-error');

// Configuration statements
const port = 3001;
app.use(bodyParser.json());


app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Role');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
})

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use((req,res,next) => {
  const error = new HttpError('Page not found',404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code);
  res.json({message: error.message || 'Unknown error occured' , code: error.code });
});

//database is not conected
mongoose.connect('<enter your database connection>',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(() => {
    app.listen(port, () => {
      console.log(`App running on http://localhost:${port}`)
    });
  }).catch(err => {
    console.log(err);
  });



