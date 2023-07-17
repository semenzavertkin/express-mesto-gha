const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const routes = require('./routes');
const { login, createUser } = require('./controllers/users');
const {
  validationLogin,
  validationCreateUser,
} = require('./middlewares/validation');
const handelError = require('./middlewares/handelError');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);
app.use(routes);
app.use(errors());
app.use(handelError);

app.listen(PORT);
