const Telegraf = require('telegraf');
const { Extra, Markup } = require('telegraf');
const config = require('../config.json');
const app = new Telegraf(config.telegram.token);
const db = require('../db');

const controllers = {
  basket: require('./controllers/basket'),
  product: require('./controllers/product'),
  category: require('./controllers/category'),
  main: require('./controllers/main')
}

const middleware = {
  auth: require('./middleware/auth')
}

app.telegram.getMe().then((info) => {
  global.botInfo = info;
});

app.use(middleware.auth);

/*
 *  Main controller routes
 */
app.command('/start', controllers.main);
app.command('/menu', controllers.main.getMenu);

/*
 *  Product controller routes
 */
app.action(/^__link_(.*)$/, controllers.product.getLink);
app.action(/^__category_([0-9a-fA-F]{24})$/, controllers.product.getProductsByCategory);
app.action(/^__category_([0-9a-fA-F]{24})_page_(\d+)$/, controllers.product.getProductsByCategory);
app.hears('🔍 Поиск', controllers.product.getSearch);
app.action('__cancelSearch', controllers.product.cancelSearch);
app.on('message', controllers.product.searchByKeyword);

/*
 *  Basket controller routes
 */
app.hears(/^(\d+)$/, controllers.basket.addToBasketCount);
app.hears('🛒 Корзина', controllers.basket.getBasket);
app.action('__backToBasket', controllers.basket.getBasket);
app.action(/^__addToBasket_([0-9a-fA-F]{24})$/, controllers.basket.addToBasket);
app.action(/^__goBasketPage_(\d+)$/, controllers.basket.getBasket);
app.action(/^__goToBasketItem_([0-9a-fA-F]{24})$/, controllers.basket.getBasketItem);
app.action(/^__removeFromBasket_([0-9a-fA-F]{24})$/, controllers.basket.removeFromBasket, controllers.basket.getBasket);
app.action('__checkout', controllers.basket.checkout);

/*
 *  Category controller routes
 */
app.hears('📋 Категории', controllers.category.getCategories);


/*
 *  404 like message
 */
app.use(controllers.main.notFound);

app.startPolling();