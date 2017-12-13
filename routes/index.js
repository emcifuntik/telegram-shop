const db = require('../db');
const mw = require('../middleware');
const multer = require('multer');
const randomstring = require('randomstring');
const mimeTypes = require('mime-types');

const whiteList = [
  'image/jpeg',
  'image/png'
];

const storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    cb(null, whiteList.indexOf(file.mimetype) != -1);
  },
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, randomstring.generate(32) + '.' + mimeTypes.extension(file.mimetype));
  }
})

const upload = multer({ storage })


const products = require('../controllers/products');
const categories = require('../controllers/categories');

module.exports = (router, passport) => {
  router.get('/', mw.loggedIn, (req, res, next) => {
    res.render('index');
  });

  router.get('/products', mw.loggedIn, products.getProducts);
  router.get('/products/add', mw.loggedIn, products.getAddProduct);
  router.post('/products/add', mw.loggedIn, upload.any(), products.postAddProduct);
  
  router.get('/categories', mw.loggedIn, categories.getCategories);
  router.get('/categories/add', mw.loggedIn, categories.getAddCategory);
  router.post('/categories/add', mw.loggedIn, upload.any(), categories.postAddCategory);
  
  router.get('/register', (req, res, next) => {
    res.render('register', {});
  });
  
  router.post('/register', (req, res, next) => {
    db.user.register(new db.user({username: req.body.username}), req.body.password, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
  
  router.get('/login', (req, res, next) => {
    res.render('login', {
      user: req.user,
      error: req.flash('error')
    });
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  }));
  
  router.get('/logout', mw.loggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
  });
  return router;
}