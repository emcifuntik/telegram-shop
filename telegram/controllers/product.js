const db = require('../../db');
const { Extra, Markup } = require('telegraf');
const getPriceString = require('../../util/getPriceString');

const productsOnPage = 3;
const searchProductsOnPage = 3;
const inSearch = {};

class Product {
  async getLink(ctx) {
    ctx.reply('Ссылка на товар: ' + 'https://t.me/' + botInfo.username + '?start=' + ctx.match[1]);
  }

  async getProductsByCategory(ctx) {
    let page = 0;
    if(Array.isArray(ctx.match) && ctx.match[2]) {
      let _page = parseInt(ctx.match[2]);
      if(!isNaN(_page)) {
        page = _page;
      }
    }
    let categoryID = ctx.match[1];
    let category = await db.category.findOne({
      _id: categoryID
    });
    if(!category) {
      return ctx.reply('Эта категория товаров удалена');
    }
  
    let searchQuery = {
      categories: category._id
    };
  
    let productsCount = await db.product.count(searchQuery);
    let pages = Math.ceil(productsCount / productsOnPage);
    let products = await db.product.find(searchQuery).skip(page * productsOnPage).limit(productsOnPage);
  
    for(let product of products) {
      await ctx.reply(product.title + '\n' + getPriceString(product.cost, product.unit) + '\n' + 'https://telegra.ph/' + product.telegraphLink, Markup.inlineKeyboard([
        [Markup.callbackButton('Добавить в корзину', '__addToBasket_' + product._id.toString()),
        Markup.callbackButton('Ссылка на товар', '__link_' + product._id.toString())]
      ]).extra());
    }
  
    if(products.length < productsCount) {
      let navButtons = [];
      if(page > 2 && pages > 5) {
        navButtons.push(Markup.callbackButton('<', '__category_' + category._id.toString() + '_page_' + ((page - 3) >= 0 ? (page - 3) : 0)));
      }

      if(pages > 5) {
        if(page < (pages - 2)) {
          let from = (page - 2) >= 0 ? (page - 2) : 0;
          for(let p = from; p < (from + 5); ++p) {
            navButtons.push(Markup.callbackButton(p == page ? '•' : (p + 1), p == page ? '__nothing' : ('__category_' + category._id.toString() + '_page_' + p)));
          }
        }
        else {
          let from = (pages - 5) >= 0 ? (pages - 5) : 0;
          for(let p = from; p < (from + 5); ++p) {
            navButtons.push(Markup.callbackButton(p == page ? '•' : (p + 1), p == page ? '__nothing' : ('__category_' + category._id.toString() + '_page_' + p)));
          }
        }
      }
      else {
        for(let p = 0; p < pages; ++p) {
          navButtons.push(Markup.callbackButton(p == page ? '•' : (p + 1), p == page ? '__nothing' : ('__category_' + category._id.toString() + '_page_' + p)));
        }
      }

      if(page < (pages - 3) && pages > 5) {
        navButtons.push(Markup.callbackButton('>', '__category_' + category._id.toString() + '_page_' + ((page + 3) <= (pages - 1) ? (page + 3) : (pages - 1))));
      }
      await ctx.reply('Вы находитесь на ' + (page + 1) + '/' + pages + ' странице товаров категории "' + category.title + '". Выведены товары ' + (productsOnPage * page + 1) + '-' + (productsOnPage * page + products.length) + ' из ' + productsCount, Markup.inlineKeyboard([
        navButtons
      ]).extra());
    }
  }

  async getSearch(ctx, next) {
    inSearch[ctx.user._id.toString()] = true;
    return ctx.reply('Введите слово или фразу для поиска', Markup.inlineKeyboard([
      Markup.callbackButton('Отменить поиск', '__cancelSearch')
    ]).extra())
  }

  async cancelSearch(ctx, next) {
    delete inSearch[ctx.user._id.toString()];
    return ctx.editMessageText('Поиск отменён');
  }

  async searchByKeyword(ctx, next) {
    if(inSearch[ctx.user._id.toString()]) {
      let searchRegex = new RegExp(ctx.message.text, 'i');
      let searchQuery = {
        title: searchRegex
      };

      let searchCount = await db.product.count(searchQuery);

      if(searchCount == 0) {
        return await ctx.reply('Товары не найдены', Markup.inlineKeyboard([
          Markup.callbackButton('Отменить поиск', '__cancelSearch')
        ]).extra());
      }

      let searchResult = await db.product
        .find(searchQuery)
        .limit(searchProductsOnPage)
        .populate('categories');

      for(let product of searchResult) {
        let categories = product.categories.map(value => value.title).join(', ');
        await ctx.reply(product.title + '\n\nКатегории товара: ' + categories + '\n' + getPriceString(product.cost, product.unit) + '\n\n\n' + 'https://telegra.ph/' + product.telegraphLink, Markup.inlineKeyboard([
          [Markup.callbackButton('Добавить в корзину', '__addToBasket_' + product._id.toString()),
          Markup.callbackButton('Ссылка на товар', '__link_' + product._id.toString())]
        ]).extra());
      }

      if(searchCount > searchProductsOnPage) {

      }  
      delete inSearch[ctx.user._id.toString()];
    }
    else
      return next();
  }
}

module.exports = new Product();