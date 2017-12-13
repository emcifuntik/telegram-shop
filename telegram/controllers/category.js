const db = require('../../db');
const { Extra, Markup } = require('telegraf');
const categoriesInRow = 3;

class Category {
  async getCategories(ctx, next) {
    let catsCount = await db.category.count({});
    let cats = await db.category.find({}).sort('title').limit(10);
    let buttons = [];
    let tempButtons = [];
  
    for(let c of cats) {
      tempButtons.push(Markup.callbackButton(c.title, '__category_' + c._id.toString()));
      if(tempButtons.length >= categoriesInRow) {
        buttons.push(
          tempButtons
        );
        tempButtons = [];
      }
    }
  
    if(tempButtons.length != 0) {
      buttons.push(
        tempButtons
      );
      tempButtons = [];
    }
  
    if(catsCount > 10) {
      buttons.push(
        Markup.callbackButton(c.title, '__category_next_page_' + 0)
      );
    }
  
    let markup = Markup.inlineKeyboard(buttons).extra()
  
    await ctx.reply('Доступных категорий товаров: ' + catsCount, markup);
  }
}

module.exports = new Category();