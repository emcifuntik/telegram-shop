module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const categorySchema = new Schema({
    title: {
      type: String,
      required: true
    }
  });
  return mongoose.model('Category', categorySchema);
};