const db = require('../../db');

module.exports = async(ctx, next) => {
  ctx.user = null;
  if (ctx.from) {
    try {
      ctx.user = await db.client.findOne({
        telegram: ctx.from.id
      });
    } catch (err) {
      console.error(err);
    }

    if (!ctx.user) {
      ctx.user = await db.client.create({
        telegram: ctx.from.id,
        nickname: ctx.from.username || '',
        firstname: ctx.from.first_name,
        lastname: ctx.from.last_name
      });
    }
  }
  next();
}