module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const basketSchema = new Schema({
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    basket: [{
      type: Schema.Types.ObjectId,
      ref: 'Basket',
    }],
    address_first: {
      type: String,
      default: null
    },
    address_second: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    postcode: {
      type: String,
      default: null
    },
    fullname: {
      type: String,
      default: null
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: 'Delivery',
      default: null
    }
  });
  return mongoose.model('Basket', basketSchema);
};