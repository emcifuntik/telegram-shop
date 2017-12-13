module.exports = (req, res, next) => {
  if (req.user == null) {
    res.redirect('/login');
  }
  else {
    next();
  }
  return;
}