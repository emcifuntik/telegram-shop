module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const clientSchema = new Schema({
    telegram: {
      type: Number,
      required: true
    },
    nickname: {
      type: String,
      default: null
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    discount: {
      type: Number,
      default: 0
    },
    activated: {
      type: Boolean,
      default: false
    }
  });
  return mongoose.model('Client', clientSchema);
};