module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const deliverySchema = new Schema({
    title: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    }
  });
  return mongoose.model('Delivery', deliverySchema);
};