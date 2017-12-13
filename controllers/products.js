const db = require('../db');
const config = require('../config.json');
const telegraph = require('telegraph-node');
const ph = new telegraph();
const phUpload = require('../util/phUpload');
const domToNode = require('../util/domToNode');

class Products {
  async getProducts(req, res, next) {
    const products = await db.product.find({}).populate('categories');
    
    res.render('products', {
      products
    });
  }

  async getAddProduct(req, res, next) {
    const categories = await db.category.find({});
    res.render('productAdd', {
      categories
    });
  }

  async postAddProduct(req, res, next) {
    const images = req.files.map(value => value.filename);
    req.body.images = images;
    
    if(req.body.categories.length != 0) {
      if(!Array.isArray(req.body.categories)) {
        req.body.categories = [req.body.categories];
      }
    }

    let phNodes = [domToNode(req.body.description)];
    for(let f of req.files) {
      let url = await phUpload(global.__baseDir + '/uploads/' + f.filename);
      phNodes.push({
        tag: 'img', attrs:{
          src: url[0].src
        }
      });
    }

    let article = await ph.createPage(config.telegraph.token, 
      req.body.title, 
      phNodes, 
      {return_content: true}
    );

    req.body.telegraphLink = article.path;

    try {
      await db.product.create(req.body);
    }
    catch(e) {
      const categories = await db.category.find({});
      return res.render('productAdd', {
        categories,
        error: e.toString()
      });
    }

    res.redirect('/products');
  }
}

const products = new Products();
module.exports = products;