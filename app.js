const express = require('express');
const telegraf = require('telegraf');
const notify = require('telegram-notifier');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const config = require('./config.json');
const telegraph = require('telegraph-node');
const ph = new telegraph();
const telegram = require('./telegram');

global.__baseDir = __dirname;

if(!config.telegraph.token || config.telegraph.token.length == 0) {
  ph.createAccount(config.telegraph.shortName).then((result) => {
    console.log(result);
    config.telegraph.token = result.access_token;
  })
}

// notify('390581623:AAENZ2FxA93SxNmYgT1rxCOqMuh9-HDl5es', '-1001106017080', {
//   error: true,
//   warning: false,
//   exception: true,
//   rejection: true
// });

passport.use(new LocalStrategy(db.user.authenticate()));

passport.serializeUser(db.user.serializeUser());
passport.deserializeUser(db.user.deserializeUser());

const app = express();
const listener = require('http').Server(app);
const routes = require('./routes')(express.Router(), passport);

app.use(express.static('static',{
  maxage: '4h'
}));
app.use('/uploads', express.static('uploads',{
  maxage: '4h'
}));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSession({
  secret: config.express.secret,
  store: new MongoStore({
    mongooseConnection: db.mongoose.connection
  }),
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(async (req, res, next) => {
  res.locals.error = null;
  // res.locals.helpers = helpers;
  res.locals.user = null;
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});
app.use(routes);
app.use((req, res, next) => {
  let err = new Error('Здесь ничего нет');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if(!req.user || !req.user.admin && err.status != 404)
    err.message = 'Неизвестная ошибка';
  console.error(err);
  return res.status(err.status || 500).render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : null,
    status: err.status || 500
  });
});

let server = listener.listen(config.express.port || 3000, () => {
  const host = server.address().address == '::' ? 'localhost' : server.address().address;
  const port = server.address().port;
  console.log("Start at http://%s:%s", host, port)
});



//////
// db.user.register(new db.user({username: 'tuxick'}), '', function(err) {
//   if (err) {
//     return next(err);
//   }
// });