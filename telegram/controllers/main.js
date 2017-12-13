const db = require('../../db');
const { Extra, Markup } = require('telegraf');
const getPriceString = require('../../util/getPriceString');

const keyboard = Markup
.keyboard([
  ['🔍 Поиск', '📋 Категории'],
  ['🛒 Корзина']
])
.resize()
.extra();

class Main {
  async getStart(ctx, next) {
    let parts = ctx.message.text.split(' ');
    let param = null;
    if(parts.length > 1) {
      param = parts[1];
    }
  
    let product = null;
    try {
      product = await db.product.findOne({
        _id: param
      });
    }
    catch(err) {
      console.error(err);
    }
  
    if(!ctx.user.activated) {
      await ctx.reply('Добро пожаловать в наш магазин!', keyboard);
      ctx.user.activated = true;
      await ctx.user.save();
    }
  
    if(product) {
      return await ctx.reply(product.title + '\n' + getPriceString(product.cost, product.unit) + '\n' + 'https://telegra.ph/' + product.telegraphLink, Markup.inlineKeyboard([
        [Markup.callbackButton('Добавить в корзину', '__addToBasket_' + product._id.toString()),
        Markup.callbackButton('Ссылка на товар', '__link_' + product._id.toString())]
      ]).extra());
    }
    else {
      return await ctx.reply('К сожалению товар не найден');
    }
  }

  async getMenu(ctx, next) {
    return ctx.reply('Меню', keyboard);
  }

  async notFound(ctx, next) {
    return ctx.reply('По вашему запросу ничего не найдено', keyboard);
  }
}

module.exports = new Main();