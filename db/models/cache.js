module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const cacheSchema = new Schema({
    hash: {
      type: String,
      required: true
    },
    tgId: {
      type: String,
      required: true
    }
  });
  return mongoose.model('Cache', cacheSchema);
};