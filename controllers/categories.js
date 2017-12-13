const db = require('../db');

class Categories {
  async getCategories(req, res, next) {
    const categories = await db.category.find({});
    
    res.render('categories', {
        categories
    });
  }

  async getAddCategory(req, res, next) {
    res.render('categoryAdd');
  }

  async postAddCategory(req, res, next) {
    try {
      await db.category.create(req.body);
    }
    catch(e) {
      return res.render('categoryAdd', {
        error: e.toString()
      });
    }

    res.redirect('/categories');
  }
}

const categories = new Categories();
module.exports = categories;