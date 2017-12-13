module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const basketSchema = new Schema({
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  });
  return mongoose.model('Basket', basketSchema);
};