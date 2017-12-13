const db = require('../../db');
const { Extra, Markup } = require('telegraf');
const getUnit = require('../helpers/getUnit');
const getPriceString = require('../../util/getPriceString');

const basketItemsOnPage = 5;
const selectedProduct = {};

class Basket {
  async getBasket(ctx, next) {
    let page = ((ctx.page != undefined) ? ctx.page : (Array.isArray(ctx.match) ? parseInt(ctx.match[1]) : 0));

    let query = {
      client: ctx.user._id
    };

    let basketCount = await db.basket.count(query);

    if(basketCount == 0) {
      return await ctx.reply('Ваша корзина пуста');
    }

    let baskets = await db.basket.find(query)
      .limit(basketItemsOnPage)
      .skip(page * basketItemsOnPage)
      .populate('product');

    let finalCost = 0;
    let allBaskets = await db.basket.find(query).populate('product');
    for(let b of allBaskets) {
      finalCost += (b.product.cost * b.quantity);
    }

    let pages = Math.ceil(basketCount / basketItemsOnPage);
    
    let products = [];
    for (let b of baskets) {
      products.push([
        Markup.callbackButton('🔹 ' + b.product.title + ' / ' + getUnit(b.product.unit, b.quantity) + ' / ' + (b.product.cost * b.quantity).toFixed(2) + ' руб.', '__goToBasketItem_' + b._id.toString())
      ]);
    }

    if (basketCount > basketItemsOnPage) {
      let navButtons = [];
      if (page != 0) {
        navButtons.push(
          Markup.callbackButton(
            '⬅️ Назад',
            '__goBasketPage_' + (page - 1)
          ),
        );
      }
      if (page != (pages - 1)) {
        navButtons.push(
          Markup.callbackButton(
            'Далее ➡️',
            '__goBasketPage_' + (page + 1)
          ),
        );
      }
      products.push(navButtons);
    }

    products.push([Markup.callbackButton(
      'Оформить заказ (' + finalCost.toFixed(2) + ' руб.)',
      '__checkout'
    )]);

    let markup = Markup.inlineKeyboard(products).extra()
    let additionalMessage = (ctx.additionalMessage ? (ctx.additionalMessage + '\n\n') : '');
    if(ctx.updateType == 'message') {
      return ctx.reply(additionalMessage + 'Товары в вашей корзине. Страница ' + (page + 1) + ' из ' + pages, markup);
    }
    else {
      return ctx.editMessageText(additionalMessage + 'Товары в вашей корзине. Страница ' + (page + 1) + ' из ' + pages, markup);
    }
  }

  async checkout(ctx, next) {
    const allBaskets = await db.basket.find({
      client: ctx.user._id,
      active: true
    }).populate('product');

    let labeledPrices = [];
    let sumPrice = 0;

    let image = allBaskets[0].product.images[0];

    for(let b of allBaskets) {
      let price = Math.round(b.product.cost * b.quantity * 100);
      labeledPrices.push({
        label: b.product.title + ' - ' + getUnit(b.product.unit, b.quantity),
        amount: Math.round(b.product.cost * b.quantity * 100)
      });
      sumPrice += price;
    }

    ctx.replyWithInvoice({
      title: 'Покупка товаров',
      description: 'Покупка',
      payload: '124123125123123',
      provider_token: '381764678:TEST:3354',
      start_parameter: '39gj98j3gj',
      currency: 'RUB',
      prices: labeledPrices,
      photo_url: image,
      need_shipping_address: true
    });
  }

  async addToBasket(ctx, next) {
    let productID = ctx.match[1];
    let product = await db.product.findOne({
      _id: productID
    });
  
    if(!product) {
      return ctx.reply('К сожалению товар не найден');
    }
  
    selectedProduct[ctx.user._id.toString()] = product._id;
  
    let unit = '';
    switch(product.unit) {
      case 'piece':
      unit = 'в штуках';
      break;
      case 'kilogram':
      unit = 'в килограммах';
      break;
      case 'gram': 
      unit = 'в граммах';
      break;
      case 'ton': 
      unit = 'в тоннах';
      break;
    }
  
    await ctx.reply('Сколько единиц "' + product.title + '" (' + unit + ') добавить в корзину?', Markup.inlineKeyboard([
      [Markup.callbackButton('Отменить', '__cancelAddToBasket')]
    ]).extra());
  }

  async addToBasketCount (ctx, next) {
    if(selectedProduct[ctx.user._id.toString()] != undefined) {
      if(ctx.match[1].length >= 12) 
        return next;
      let count = parseInt(ctx.match[1]);
      
      let product = await db.product.findOne({
        _id: selectedProduct[ctx.user._id.toString()]
      });
      if(!product) {
        delete selectedProduct[ctx.user._id.toString()];
        return await ctx.reply('Товар был удалён');
      }
  
      if(count > product.available) {
        return await ctx.reply('Нельзя купить товара больше чем доступно. Доступно: ' + product.available);
      }
  
      await db.basket.create({
        client: ctx.user._id,
        product: product._id,
        quantity: count
      });
  
      await ctx.reply('Товар "' + product.title + '" добавлен в корзину')
    }
    else
      return next();
  }

  async getBasketItem(ctx, next) {
    let basketID = ctx.match[1];
    let basket = await db.basket.findOne({
      _id: basketID
    }).populate('product');

    if(!basket) {
      return ctx.reply('К сожалению товар в вашей корзине не найден');
    }

    await ctx.editMessageText(basket.product.title + ' - ' + getUnit(basket.product.unit, basket.quantity) + ' стоимостью (в рублях): ' + (basket.product.cost * basket.quantity).toFixed(2) + '\n' + 'https://telegra.ph/' + basket.product.telegraphLink, Markup.inlineKeyboard([
      [Markup.callbackButton('Удалить из корзины', '__removeFromBasket_' + basket._id.toString()),
      Markup.callbackButton('Изменить количество', '__changeCount_' + basket._id.toString())],
      [Markup.callbackButton('Вернуться в корзину', '__backToBasket')]
    ]).extra());
  }

  async removeFromBasket(ctx, next) {
    let basketID = ctx.match[1];
    let basket = await db.basket.findOne({
      _id: basketID
    }).populate('product');

    if(!basket) {
      return ctx.reply('К сожалению товар в вашей корзине не найден');
    }

    ctx.additionalMessage = 'Товар "' + basket.product.title + '" убран из вашей корзины';
    ctx.page = 0;
    await basket.remove();
    next();
  }
}

module.exports = new Basket();