var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// added line, create a 
var userInfo = require('./public/data/userInfo.json');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// ------------------------------------------------------------------------
// get the list of people
app.get('/getUserList', function(req, res)
{
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(userInfo));
});

// app.get('/getUserInfo', function(req, res)
// {
//   res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify(userInfo[req.query.idx]));
// });


// save a whole new person
app.post('/saveUserInfo', function(req, res)
{
  console.log("hello")
  const firstName= req.body.firstName
  const lastName= req.body.lastName
  const dateOfBirth = req.body.dateOfBirth
  const bio = req.body.bio
  const userId=  req.body.userID
  const pet= req.body.pet

  var lst = {firstName, lastName, dateOfBirth, bio, userId, pet}
  userInfo.push(lst)
  
    // firstName: req.body.firstName,
    // lastName: req.body.lastName,
    // dateOfBirth: req.body.dateOfBirth,
    // bio: req.body.bio,
    // userId: req.body.userID,
    // pet: req.body.pet

  
  console.log(userInfo)
  
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(userInfo));
})

//delete a user
app.post('/deleteUser', function(req, res)
{
  const personToDelete = req.body.otherName
  const indexOfPerson = userInfo.indexOf(personToDelete)

  if(indexOfPerson > -1)
  {
    userInfo.splice(indexOfPerson, 1)
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(userInfo));
});


//update the information
app.post('/setUserInfo', function(req, res)
{
  userInfo[req.body.idx].firstName = req.body.firstName;
  userInfo[req.body.idx].lastName = req.body.lastName;
  userInfo[req.body.idx].dateOfBirth = req.body.dateOfBirth;
  userInfo[req.body.idx].bio = req.body.bio;
  userInfo[req.body.idx].id = req.body.id;
  userInfo[req.body.idx].pet = req.body.pet;


  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(userInfo[req.body.idx]));
});
// -----------------------------------------------------------------------




app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
